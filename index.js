const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("node:path");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const port = process.env.SERVER_PORT || 3000;
const authTokenSecret = process.env.JWT_AUTH_TOKEN;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function authenticateToken(req, res, next) {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res.status(403).send("Access Denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, authTokenSecret);
    req.from = decoded.from || "Mailer API";
    req.to = decoded.to;

    if (!req.to) {
      return res.status(400).send("Invalid Token. Email not found.");
    }

    next();
  } catch (ex) {
    res.status(401).send("Invalid Token.");
  }
}

const limiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW || 15, 10) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 5,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests from this IP, please try again later.",
    });
  },
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static/index.html"));
});

app.post("/send-email", limiter, authenticateToken, async (req, res) => {
  const { subject, html } = req.body;

  const mailOptions = {
    from: `"${req.from}" <${process.env.GMAIL_USER}>`,
    to: req.to,
    subject,
    html,
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send email.",
    });
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "static/404.html"));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// To be user from the app email needs to be called from the app
// const payload = {
//   to: "test@email.com",
//   from: "Mailer API",
// };
// const options = {
//   expiresIn: "1h",
// };
// const jwtToken = jwt.sign(payload, authTokenSecret, options);
