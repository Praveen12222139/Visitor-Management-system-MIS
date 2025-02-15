

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import API from "../utils/api";

const departments = ["HR", "IT", "Finance", "Marketing", "Operations"];

const BookAppointment = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [hostName, setHostName] = useState("");
  const [hostDept, setHostDept] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  const capturePhoto = () => {
    setPhoto(webcamRef.current.getScreenshot());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/appoint/add", {
        fullName,
        email,
        purpose,
        name: hostName,
        dept: hostDept,
        orgName,
        orgAddress,
        checkIn,
        checkOut,
        photo,
      });
      alert("Appointment Requested Successfully!");
    } catch (error) {
      alert("Booking Failed");
      console.error("Booking Failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 p-4">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-wide">
          Book an Appointment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
            />
            <input
              type="text"
              placeholder="Purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
            />
            <input
              type="text"
              placeholder="Host Name"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
            />
            <select
              value={hostDept}
              onChange={(e) => setHostDept(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
            >
              <option value="" disabled>
                Select Host Department
              </option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Organization Name (Optional)"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
            />
            <input
              type="text"
              placeholder="Organization Address (Optional)"
              value={orgAddress}
              onChange={(e) => setOrgAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
            />
            <div className="flex space-x-4">
              <input
                type="datetime-local"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
              />
              <input
                type="datetime-local"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full rounded-lg overflow-hidden">
              <Webcam
                ref={webcamRef}
                className="w-full rounded-lg"
                videoConstraints={{
                  facingMode: "user",
                }}
              />
            </div>
            <button
              type="button"
              onClick={capturePhoto}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-xl"
            >
              Capture Photo
            </button>
            {photo && (
              <img
                src={photo}
                alt="Captured"
                className="mt-4 rounded-lg w-32 h-32 object-cover border-2 border-gray-300"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-xl"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
