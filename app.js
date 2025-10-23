import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ POST /contact endpoint
app.post("/contact", async (req, res) => {
  console.log("Received body:", req.body); // 🧠 Debug line

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "We Received Your Message - A.S.N Electromechanical Contracting",
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out! We received your message and will respond within 24 hours.</p>
        <p>Your message:</p>
        <blockquote>${message}</blockquote>
        <p>Best regards,<br>A.S.N Electromechanical Contracting Team</p>
      `,
    };

    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(customerMailOptions);

    res.status(200).json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error.message);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Contact API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
