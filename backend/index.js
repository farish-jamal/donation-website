const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Admin = require("./models/admin");
const Contact = require("./models/contact");
const Donation = require("./models/donation");
const Member = require("./models/member");
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// All Admin Routes
app.post("/api/admin/register", async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  const admin = await Admin.create({ name, email, phoneNumber, password });
  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    admin,
  });
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }
  if (admin.password !== password) {
    return res.status(400).json({
      success: false,
      message: "Invalid password",
    });
  }
  res.status(200).json({
    success: true,
    message: "Admin logged in successfully",
    admin,
  });
});

app.get("/api/admin/get-all-admins", async (req, res) => {
  const admins = await Admin.find();
  res.status(200).json({
    success: true,
    message: "Admins fetched successfully",
    admins,
  });
});

app.delete("/api/admin/delete-admin/:id", async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Admin deleted successfully",
  });
});

app.put("/api/admin/update-admin/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, password } = req.body;
  const admin = await Admin.findByIdAndUpdate(id, {
    name,
    email,
    phoneNumber,
    password,
  });
  res.status(200).json({
    success: true,
    message: "Admin updated successfully",
  });
});

// All Contact Routes
app.post("/api/contact/create-contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  const contact = await Contact.create({ name, email, subject, message });
  res.status(201).json({
    success: true,
    message: "Contact created successfully",
  });
});

app.get("/api/contact/get-all-contacts", async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({
    success: true,
    message: "Contacts fetched successfully",
    contacts,
  });
});

// All Donation Routes
app.post("/api/donation/create-donation", async (req, res) => {
  const { name, email, phoneNumber, amount, message, UTRNumber } = req.body;
  const donation = await Donation.create({
    name,
    email,
    phoneNumber,
    amount,
    message,
    UTRNumber,
  });
  res.status(201).json({
    success: true,
    message: "Donation created successfully",
  });
});

app.get("/api/donation/get-all-donations", async (req, res) => {
  const donations = await Donation.find();
  res.status(200).json({
    success: true,
    message: "Donations fetched successfully",
    donations,
  });
});

// All Memebers Routes
app.post("/api/member/create-member", async (req, res) => {
  const { name, email, phoneNumber, message } = req.body;
  const member = await Member.create({ name, email, phoneNumber, message });
  res.status(201).json({
    success: true,
    message: "Member created successfully",
  });
});

app.get("/api/member/get-all-members", async (req, res) => {
  const members = await Member.find();
  res.status(200).json({
    success: true,
    message: "Members fetched successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
