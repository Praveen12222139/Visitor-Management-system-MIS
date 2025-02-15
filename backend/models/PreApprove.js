import mongoose from "mongoose";
import Employee from "./Employee.js";
const schema = mongoose.Schema;

const PreApprove = new schema({
  EmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Employee,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.model("PreApprove", PreApprove);
