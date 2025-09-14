# 🔗 URL Shortener Service

A full-stack URL Shortening Service built using **Node.js (Express)** for the backend and **React** for the frontend,
with support for user authentication, URL management, statistics tracking, and QR code generation.

---

## ✅ Features

- Generate short URLs from long URLs
- Optional custom alias and expiration date
- JWT-based Authentication (Admin & User)
- View URL list and individual URL statistics
- Update URL expiration date
- Delete short URLs
- Generate QR codes for shortened URLs
- REST API with rate limiting
- Secure API endpoints with role-based access

---

## 🧱 Architecture Overview

### Backend (Node.js + Express)

- Implements a modular design using classes for various API handlers:
    - Create Short URL
    - Fetch Original URL and Redirect
    - Fetch URL Metadata (Stats)
    - Update Expiry Date
    - Delete Short URL
    - List All URLs
    - User Login and JWT Authentication
  
- Database: **MySQL**
    - Tables:
        - `users`
        - `short_urls`
        - `access_logs`

- Security:
    - JWT Authentication Middleware
    - Rate limiting (100 requests per 15 minutes)

---

### Frontend (React)

- Components:
    - Login page
    - URL Dashboard (List URLs, Add URL, Expire URL, Delete URL, Show Stats)
    - QR Code generation for short URLs

- User Flow:
    1. Login (admin or user)
    2. Add long URL to create short URL
    3. View URL list and actions
    4. Admin users can update expiry, delete URLs, and view usage stats

---

## ⚡ Technology Stack

| Component      | Technology            |
|-------------- |-----------------------|
| Backend        | Node.js, Express      |
| Frontend       | React                 |
| Database      | MySQL                 |
| Authentication| JWT (jsonwebtoken)    |
| QR Code       | `qrcode` npm library  |
| Data Validation| Joi                   |
| Environment   | dotenv                |
| Rate Limiting | express-rate-limit    |

---

## ⚙️ Setup Instructions

### 1. Backend

1. Install dependencies:
     ```bash
    cd server
    npm install
    ```

2. Create `.env` file with the following variables:
    ```env
    PORT=3000
    BASE_URL=http://localhost:3000
    JWT_SECRET=your_jwt_secret
    ```
    
3. Run the backend server:
    ```bash
    npm start
    ```

---

### 2. Frontend

1. Navigate to the frontend folder and install dependencies:
     ```bash
    cd client
    npm install
    ```

2. Start the frontend development server:
    ```bash
    npm start
    ```

---

## 🚀 How to Use

1. Visit the frontend at:  
    `http://localhost:3001`

2. Login using credentials (admin recommended for full access).

3. Add a long URL and click **Shorten URL**.

4. See your short URL in the list along with:
    - Expiration date
    - Click count
    - QR Code

5. Admin users can:
    - Expire URLs by updating expiry date
    - Delete URLs
    - View URL visit stats (IP addresses, user agents)

---

## 🔒 Authentication Flow

- Users log in with username and password.
- Successful login returns a JWT token.
- All subsequent protected requests send the token in the `Authorization: Bearer <token>` header.
- Middleware validates token and provides access based on `userType` (Admin/User).

---

## 💡 API Rate Limiting

- Limited to **100 requests per 15 minutes per IP** to prevent abuse.

---

## ✅ Error Handling

- Validation errors return `400 Bad Request`
- Unauthorized access returns `401 Unauthorized`
- Not found resources return `404 Not Found`
- Internal errors return `500 Internal Server Error`

---

## Demonstration Video




https://github.com/user-attachments/assets/e36181ed-4462-42dc-af8d-eb189ee6babd





## 🧱 Future Improvements

- Add pagination for URL list
- Allow bulk URL import/export
- Role-based permissions management
- Dockerize the project for easier deployment
- Add monitoring dashboards

---

## 👩‍💻 Author

Vedanti Bhoyar | bhoyar.veda@gmail.com | GitHub: [https://github.com/VedantiBhoyar]

---

## 📄 License

This project is licensed under the MIT License.
