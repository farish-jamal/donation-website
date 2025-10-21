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
const connectDB = require("./config/db");
const Gallery = require("./models/gallery");
const Video = require("./models/video");
const Department = require("./models/department");
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
(async () => {
  await connectDB();
})();

// Configure multer
const upload = multer({ storage, fileFilter });

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

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

app.get("/api/admin/get-admin/:id", async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findById(id);
  res.status(200).json({
    success: true,
    message: "Admin fetched successfully",
    admin,
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

app.patch("/api/admin/update-admin/:id", async (req, res) => {
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

app.get("/api/donation/get-donation/:id", async (req, res) => {
  const { id } = req.params;
  const donation = await Donation.findById(id);
  res.status(200).json({
    success: true,
    message: "Donation fetched successfully",
    donation,
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
    members,
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
      const { title, content, tags, postBy = "admin" } = req.body;

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

app.get("/api/blog/get-blog/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  res.status(200).json({
    success: true,
    message: "Blog fetched successfully",
    blog,
  });
});

app.patch(
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

app.get("/api/event/get-event/:id", async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  res.status(200).json({
    success: true,
    message: "Event fetched successfully",
    event,
  });
});

app.patch(
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

// Gallery Routes

app.get("/api/gallery/get-all-gallery-items", async (req, res) => {
  const galleryItems = await Gallery.find();
  res.status(200).json({
    success: true,
    message: "Gallery items fetched successfully",
    galleryItems,
  });
});

app.delete("/api/gallery/delete-gallery-item/:id", async (req, res) => {
  const { id } = req.params;
  const galleryItem = await Gallery.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Gallery item deleted successfully",
  });
});

app.post(
  "/api/gallery/create-gallery-item",
  upload.single("image"),
  async (req, res) => {
    try {
      const { title } = req.body;

      let imageUrl = "";
      if (req.file) {
        imageUrl = await uploadSingleFile(req.file.path, "gallery");
      }

      const galleryItem = await Gallery.create({
        title,
        image: imageUrl,
      });

      res.status(201).json({
        success: true,
        message: "Gallery item created successfully",
        galleryItem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Video Routes
app.post("/api/video/create-video", async (req, res) => {
  const { title, videoLink } = req.body;
  const video = await Video.create({ title, videoLink });
  res.status(201).json({
    success: true,
    message: "Video created successfully",
    video,
  });
});

app.get("/api/video/get-all-videos", async (req, res) => {
  const videos = await Video.find();
  res.status(200).json({
    success: true,
    message: "Videos fetched successfully",
    videos,
  });
});

app.delete("/api/video/delete-video/:id", async (req, res) => {
  const { id } = req.params;
  const video = await Video.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Video deleted successfully",
  });
});

// Department Routes
app.post("/api/department/create-department", async (req, res) => {
  const { title, description } = req.body;
  const department = await Department.create({ title, description });
  res.status(201).json({
    success: true,
    message: "Department created successfully",
  });
});

app.get("/api/department/get-all-departments", async (req, res) => {
  const departments = await Department.find();
  res.status(200).json({
    success: true,
    message: "Departments fetched successfully",
    departments,
  });
});

app.delete("/api/department/delete-department/:id", async (req, res) => {
  const { id } = req.params;
  const department = await Department.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Department deleted successfully",
  });
});

app.get("/api/department/get-department/:id", async (req, res) => {
  const { id } = req.params;
  const department = await Department.findById(id);
  res.status(200).json({
    success: true,
    message: "Department fetched successfully",
    department,
  });
});

app.patch("/api/department/update-department/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const department = await Department.findByIdAndUpdate(id, { title, description });
  res.status(200).json({
    success: true,
    message: "Department updated successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
