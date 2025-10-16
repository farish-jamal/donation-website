const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const Admin = require("./models/admin");
const Contact = require("./models/contact");
const Donation = require("./models/donation");
const Member = require("./models/member");
const Blog = require("./models/blog");
const Event = require("./models/event");
const { storage, fileFilter } = require("./config/multer/index");
const { uploadSingleFile } = require("./utils/upload_single/index");
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// Configure multer
const upload = multer({ storage, fileFilter });

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

// All Blog Routes
app.post(
  "/api/blog/create-blog",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, content, tags, postBy } = req.body;

      // Upload image to Cloudinary if provided
      let imageUrl = "";
      if (req.files && req.files.image && req.files.image[0]) {
        imageUrl = await uploadSingleFile(req.files.image[0].path, "blogs");
      }

      // Upload bannerImage to Cloudinary
      let bannerImageUrl = "";
      if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
        bannerImageUrl = await uploadSingleFile(
          req.files.bannerImage[0].path,
          "blogs"
        );
      }

      const blog = await Blog.create({
        title,
        content,
        image: imageUrl,
        bannerImage: bannerImageUrl,
        tags: typeof tags === "string" ? JSON.parse(tags) : tags,
        postBy,
      });

      res.status(201).json({
        success: true,
        message: "Blog created successfully",
        blog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

app.get("/api/blog/get-all-blogs", async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json({
    success: true,
    message: "Blogs fetched successfully",
    blogs,
  });
});

app.delete("/api/blog/delete-blog/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});

app.put(
  "/api/blog/update-blog/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, tags, postBy } = req.body;

      // Get existing blog
      const existingBlog = await Blog.findById(id);
      if (!existingBlog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      // Upload new image to Cloudinary if provided, otherwise keep existing
      let imageUrl = existingBlog.image;
      if (req.files && req.files.image && req.files.image[0]) {
        imageUrl = await uploadSingleFile(req.files.image[0].path, "blogs");
      }

      // Upload new bannerImage to Cloudinary if provided, otherwise keep existing
      let bannerImageUrl = existingBlog.bannerImage;
      if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
        bannerImageUrl = await uploadSingleFile(
          req.files.bannerImage[0].path,
          "blogs"
        );
      }

      const blog = await Blog.findByIdAndUpdate(
        id,
        {
          title,
          content,
          image: imageUrl,
          bannerImage: bannerImageUrl,
          tags: typeof tags === "string" ? JSON.parse(tags) : tags,
          postBy,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        blog,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// All Event Routes
app.post(
  "/api/event/create-event",
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, dateAndTime, location } = req.body;

      // Upload image to Cloudinary if provided
      let imageUrl = "";
      if (req.file) {
        imageUrl = await uploadSingleFile(req.file.path, "events");
      }

      const event = await Event.create({
        title,
        description,
        dateAndTime,
        location,
        image: imageUrl,
      });

      res.status(201).json({
        success: true,
        message: "Event created successfully",
        event,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

app.get("/api/event/get-all-events", async (req, res) => {
  const events = await Event.find();
  res.status(200).json({
    success: true,
    message: "Events fetched successfully",
    events,
  });
});

app.delete("/api/event/delete-event/:id", async (req, res) => {
  const { id } = req.params;
  const event = await Event.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
});

app.put(
  "/api/event/update-event/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, dateAndTime, location } = req.body;

      // Get existing event
      const existingEvent = await Event.findById(id);
      if (!existingEvent) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      // Upload new image to Cloudinary if provided, otherwise keep existing
      let imageUrl = existingEvent.image;
      if (req.file) {
        imageUrl = await uploadSingleFile(req.file.path, "events");
      }

      const event = await Event.findByIdAndUpdate(
        id,
        {
          title,
          description,
          dateAndTime,
          location,
          image: imageUrl,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Event updated successfully",
        event,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
