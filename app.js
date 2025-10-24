import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Configure Nodemailer for Hostinger / real email
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // Hostinger SMTP
      port: 465,                  // Use 465 for SSL
      secure: true,               // True for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // ✅ Send email to website owner
    const ownerMailOptions = {
      from: `"A.S.N Electromechanical Contracting" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(ownerMailOptions);

    res.status(200).json({ success: true, message: "Message sent successfully to owner!" });
  } catch (error) {
    console.error("Email sending error:", error.message);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Contact API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
