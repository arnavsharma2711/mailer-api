# Mailer App API

Mailer App API is a simple Node.js application using Express and Nodemailer to send emails. It provides an endpoint to send emails with a specified recipient, subject, and HTML content. It now includes token-based authentication to secure the `/send-email` endpoint.

## Prerequisites
- Node.js installed on your machine
- Gmail account for sending emails (or update the email service in the code accordingly)

## Getting Started
1. Clone this repository to your local machine.
2. Install dependencies by running:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and set the following variables:
   ```env
   PORT=3000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   API_AUTH_TOKEN=your-secret-token
   ```
4. Replace `your-email@gmail.com`, `your-email-password`, and `your-secret-token` with your Gmail credentials and a secret token for API authentication.

## Running the Application
Start the server by running:
```bash
npm start
```
The server will run on http://localhost:3000 or the port specified in your `.env` file.

## API Endpoints

### 1. Welcome Page
- **URL:** `/`
- **Method:** `GET`
- **Description:** Displays a welcome message.
- **Example:** `http://localhost:3000/`

### 2. Send Email
- **URL:** `/send-email`
- **Method:** `POST`
- **Description:** Sends an email with the provided details. Requires authentication using the `x-auth-token` header.
- **Request Headers:**
  ```json
  {
    "x-auth-token": "your-secret-token"
  }
  ```
- **Request Body:**
  ```json
  {
    "to": "recipient@example.com",
    "subject": "Your Subject",
    "html": "<p>Your HTML content</p>"
  }
  ```
- **Example:** `http://localhost:3000/send-email`

## Authentication
Token-based authentication is implemented using the `x-auth-token` header. Include this header with the secret token in your requests to the `/send-email` endpoint.

## CORS Configuration
The server is configured to allow Cross-Origin Resource Sharing (CORS) to any origin.

## Author
- Arnav Sharma (@arnavsharma2711)

Feel free to use and modify the code according to your needs. If you encounter any issues or have suggestions, please create an issue or reach out to the author.
