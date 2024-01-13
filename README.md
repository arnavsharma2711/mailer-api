# Mailer App API

Mailer App API is a simple Node.js application using Express and Nodemailer to send emails. It provides an endpoint to send emails with a specified recipient, subject, and HTML content. It now includes token-based authentication with expiry to secure the `/send-email` endpoint.

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
    GMAIL_USER=your-email@gmail.com
    GMAIL_PASS=your-email-password
    AUTH_TOKEN_SECRET=your-secret-token
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
    "x-auth-token": "jwt-token"
  }
  ```
- **Request Body:**
  ```json
  {
    "subject": "Your Subject",
    "html": "<p>Your HTML content</p>"
  }
  ```
- **Example:** `http://localhost:3000/send-email`

### 3. 404 Page
- **URL:** `/*`
- **Method:** `GET`
- **Description:** Displays a 404 error message for any undefined routes.
- **Example:** `http://localhost:3000/undefined-route`

## Generating JWT Token

To use the `/send-email` endpoint from your application, you need to generate a JWT token. Here's how you can do it:

```javascript
const jwt = require('jsonwebtoken');

const payload = {
  to: 'test@email.com'
};

const options = {
  expiresIn: '1h',
};

const authTokenSecret = "your-secret-token";
const jwtToken = jwt.sign(payload, authTokenSecret, options);
```
In this code, `payload` is an object that contains the email address to which you want to send the email. `options` is an object that specifies the expiry time of the token. `jwt.sign()` is a method provided by the jsonwebtoken package that generates a JWT token. It takes three arguments: the payload, the secret key, and the options.

Remember to replace `'test@email.com'` with the actual email address and `your-secret-token` with your actual secret key.

## Authentication
Token-based authentication is implemented using the `x-auth-token` header. Include this header with the secret token in your requests to the `/send-email` endpoint. The token has an expiry time, after which it will no longer be valid.

## CORS Configuration
The server is configured to allow Cross-Origin Resource Sharing (CORS) to any origin.

## Author
- Arnav Sharma (@arnavsharma2711)

Feel free to use and modify the code according to your needs. If you encounter any issues or have suggestions, please create an issue or reach out to the author.