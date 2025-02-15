import { createCanvas, loadImage } from "canvas";
import { Router } from "express";
import multer from "multer";
import QRCode from "qrcode";
import sharp from "sharp";
import { sendEmail, sendEmailWA } from "../email/emailer.js";
import Employee from "../models/Employee.js";
import PreApprove from "../models/PreApprove.js";
import Visitor from "../models/Visitor.js";
import { verifyToken } from "./auth.js";
const router = Router();
const upload = multer().single("photo");

const generateAppointmentCard = async (visitor, qrCode) => {
  const canvas = createCanvas(500, 700);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  try {
    if (visitor.photo) {
      const img = await loadImage(visitor.photo);
      ctx.drawImage(img, 150, 20, 200, 200);
    }
  } catch (error) {
    console.error("Error loading visitor photo:", error.message);
  }

  ctx.fillStyle = "#000";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(visitor.fullName, canvas.width / 2, 250);

  try {
    const qrImg = await loadImage(qrCode);
    ctx.drawImage(qrImg, 125, 300, 250, 250);
  } catch (error) {
    console.error("Error loading QR code:", error.message);
  }

  ctx.font = "18px Arial";
  ctx.fillText(`Host: ${visitor.hostEmployee.name}`, canvas.width / 2, 580);
  ctx.fillText(
    `Department: ${visitor.hostEmployee.dept}`,
    canvas.width / 2,
    610
  );
  ctx.fillText(`Check-In: ${visitor.checkIn}`, canvas.width / 2, 640);
  ctx.fillText(`Check-Out: ${visitor.checkOut}`, canvas.width / 2, 670);

  return canvas.toDataURL("image/png");
};

router.post("/add", async (req, res) => {
  try {
    const {
      fullName,
      email,
      purpose,
      name,
      dept,
      orgName,
      orgAddress,
      checkIn,
      checkOut,
      photo,
    } = req.body;
    const hostEmp = await Employee.findOne({
      fullName: name,
      department: dept,
    });
    if (!hostEmp)
      return res.status(400).json({ message: "Host employee not found" });

    if (!checkIn || !checkOut || checkIn >= checkOut) {
      return res
        .status(400)
        .json({ message: "Invalid check-in/check-out time" });
    }
    let formattedPhoto = photo;
    if (photo.startsWith("data:image/webp;base64,")) {
      const base64Data = photo.replace(/^data:image\/webp;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const pngBuffer = await sharp(buffer).toFormat("png").toBuffer();
      formattedPhoto = `data:image/png;base64,${pngBuffer.toString("base64")}`;
    }

    const newVisitor = new Visitor({
      fullName,
      email,
      purpose,
      hostEmployee: { name, dept },
      orgDetail: { name: orgName || null, address: orgAddress || null },
      checkIn,
      checkOut,
      photo: formattedPhoto,
    });

    await newVisitor.save();
    sendEmailWA(hostEmp.email,name, "You have a new visitor request.");
    return res.status(200).json({ message: "Visitor added successfully" });
  } catch (err) {
    console.error("Error in add visitor:", err);
    return res.status(500).json({ message: err.message });
  }
});

router.get("/find/:email", async (req, res) => {
  try {
    const hostEmp = await Employee.findOne({ email: req.params.email });
    if (!hostEmp)
      return res.status(400).json({ message: "Host employee not found" });

    const visitors = await Visitor.find({
      "hostEmployee.name": hostEmp.fullName,
      "hostEmployee.dept": hostEmp.department,
    });

    let expiredCount = 0;
    const currentTime = new Date();

    for (let visitor of visitors) {
      if (visitor.checkOut && new Date(visitor.checkOut) <= currentTime) {
        if (visitor.status === "Pre-Approved") expiredCount++;
        visitor.status = "Expired";
        await visitor.save();
      }
    }

    await PreApprove.findOneAndUpdate(
      { EmployeeId: hostEmp._id },
      { $inc: { count: -expiredCount } },
      { new: true }
    );

    return res.status(200).json(visitors);
  } catch (err) {
    console.error("Error in find visitor:", err);
    return res.status(500).json({ message: err.message });
  }
});

router.post("/preapprove/:visitorId", async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.visitorId);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    if (visitor.status === "Rejected" || visitor.status !== "Pending") {
      return res.status(400).json({ message: "Invalid visitor status" });
    }

    const hostEmp = await Employee.findOne({
      fullName: visitor.hostEmployee.name,
      department: visitor.hostEmployee.dept,
    });

    const preApprove = await PreApprove.findOne({ EmployeeId: hostEmp._id });
    if (preApprove.count >= 5)
      return res.status(400).json({ message: "Pre-Approve limit reached" });

    if (
      new Date(visitor.checkIn).getHours() >= 10 &&
      new Date(visitor.checkIn).getHours() <= 12
    ) {
      visitor.status = "Pre-Approved";
      preApprove.count += 1;

      const qrData = `VisitorId: ${visitor._id} VisitorName: ${visitor.fullName} CheckIn: ${visitor.checkIn} CheckOut: ${visitor.checkOut} HostName: ${visitor.hostEmployee.name} HostDept: ${visitor.hostEmployee.dept}`;
      visitor.qrCode = await QRCode.toDataURL(qrData);

      await visitor.save();
      await preApprove.save();

      const appointmentCard = await generateAppointmentCard(
        visitor,
        visitor.qrCode
      );
      sendEmail(
        visitor.email,
        visitor.fullName,
        `Your visit has been pre-approved. Appointment card`,
        appointmentCard
      );

      return res
        .status(200)
        .json({ message: "Visitor pre-approved successfully" });
    } else {
      return res.status(400).json({
        message: "Check-in time must be between 10:00 AM and 12:00 PM",
      });
    }
  } catch (err) {
    console.error("Error in preapprove visitor:", err);
    return res.status(500).json({ message: err.message });
  }
});

router.post("/approve/:visitorId", async (req, res) => {
  try {
    const { visitorId } = req.params;
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    if (visitor.status === "Rejected") {
      return res
        .status(400)
        .json({ message: "Visitor has already been rejected" });
    }

    if (visitor.status === "Approved") {
      return res
        .status(400)
        .json({ message: "Visitor has already been approved" });
    }

    visitor.status = "Approved";

    // Generate QR Code
    const qrData = `VisitorId: ${visitor._id.toString()} VisitorName: ${
      visitor.fullName
    } CheckIn: ${visitor.checkIn} CheckOut: ${visitor.checkOut} HostName: ${
      visitor.hostEmployee.name
    } HostDept: ${visitor.hostEmployee.dept}`;
    const qrcode = await QRCode.toDataURL(qrData);
    visitor.qrCode = qrcode;

    // Generate appointment card
    const appointmentCard = await generateAppointmentCard(visitor, qrcode);

    await visitor.save();

    // Send approval email
    await sendEmail(
      visitor.email,
      visitor.fullName,
      `Your visit has been approved by the host employee. Your appointment card is attached below.`,
      appointmentCard
    );

    return res.status(200).json({ message: "Visitor approved successfully" });
  } catch (err) {
    console.error("Error approving visitor:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Reject Visitor
router.post("/reject/:visitorId", verifyToken, async (req, res) => {
  try {
    const { visitorId } = req.params;
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    if (visitor.status === "Rejected") {
      return res
        .status(400)
        .json({ message: "Visitor has already been rejected" });
    }

    visitor.status = "Rejected";
    await visitor.save();

    // Send rejection email
    await sendEmailWA(
      visitor.email,
      visitor.fullName,
      "Your visit has been rejected by the host employee."
    );

    return res.status(200).json({ message: "Visitor rejected successfully" });
  } catch (err) {
    console.error("Error rejecting visitor:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
