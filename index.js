const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');  
  next();
});

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function authenticateToken(req, res, next) {
  const userToken = req.headers['x-auth-token'];
  const secertToken = process.env.API_AUTH_TOKEN;

  if (userToken == null || userToken !== secertToken) 
    return res.sendStatus(401);

  next();
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(authenticateToken);

app.post('/send-email', async (req, res) => {
  const { to, subject, html} = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
