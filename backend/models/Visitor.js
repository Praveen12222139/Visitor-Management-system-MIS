import mongoose from "mongoose";

const schema = mongoose.Schema;

const Visitor = new schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  hostEmployee: {
    name: {
      type: String,
      required: true,
    },
    dept: {
      type: String,
      required: true,
    },
  },
  orgDetail: {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  checkIn: {
    type: Date,
    default: null,
    required: true,
  },
  checkOut: {
    type: Date,
    default: null,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
    required: true,
  },
  photo: {
    type: String,
    // required: true,
  },
  qrCode: {
    type: String,
    default: null,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Visitor", Visitor);
