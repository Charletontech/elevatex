# ElevateX Assets - Backend

This is the backend server for ElevateX Assets, a modern investment platform designed to provide users with opportunities for high-growth digital asset investment with confidence. It handles user authentication, transaction management, investment processing, loan requests, and administrative oversight.

## ✨ Features

### User Features
- **Secure Authentication:** JWT-based secure user registration and login.
- **Dashboard:** A comprehensive overview of account balance, investments, and recent activity.
- **Deposits & Withdrawals:** Seamlessly deposit funds and request withdrawals.
- **Investment Plans:** Purchase from a variety of investment plans with different ROIs and durations.
- **Loan Requests:** Apply for loans based on your account standing.
- **Notifications:** Receive in-app and email notifications for all important account activities (deposits, withdrawals, loans, investment maturity).
- **Profile Management:** Update personal information and change passwords.

### Admin Features
- **User Management:** View and manage all registered users.
- **Transaction Oversight:** Approve or decline user deposit and withdrawal requests.
- **Loan Management:** Approve or decline user loan applications.
- **Custom Emails:** Send custom emails directly to any user from the admin panel.

### Automated Services
- **Investment Maturation:** A cron job automatically runs every hour to process matured investments. It credits the user's account with the returns, marks the investment as `completed`, and sends a notification.

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL with Sequelize ORM
- **Authentication:** JSON Web Tokens (JWT)
- **Email Service:** SendPulse
- **File Uploads:** Cloudinary (for deposit screenshots)
- **Task Scheduling:** node-cron
- **Validation:** express-validator
- **Environment Variables:** dotenv

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MySQL](https://www.mysql.com/) or another compatible SQL database.

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/elevatex-backend.git
    cd elevatex-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file.
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and fill in the required credentials. See the [Environment Variables](#-environment-variables) section for details.

4.  **Database Synchronization:**
    The application can synchronize your models with the database schema. When you first start the server, you might want to enable this. In `index.js`, you can uncomment the `Database.sync()` line:
    ```javascript
    // synchronize database
    Database.sync(); 
    ```
    **Important:** Run this once to set up the tables. Afterwards, you can comment it out again to prevent potential data loss in development. For production, it's recommended to use dedicated migration files.

## 🔑 Environment Variables

The `.env` file is crucial for configuring the application.

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=elevatex_db
DB_DIALECT=mysql

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Email Service (SendPulse)
SENDPULSE_API_USER_ID=your_sendpulse_id
SENDPULSE_API_SECRET=your_sendpulse_secret
FROM_NAME="ElevateX Assets"
FROM_EMAIL=support@yourdomain.com

# File Uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Templates
LOGO_URL=https://your-cdn.com/logo.png
```

## ▶️ Running the Application

-   **Development Mode:**
    Runs the server with `nodemon`, which automatically restarts on file changes.
    ```bash
    npm run dev
    ```

-   **Production Mode:**
    Starts the server in a standard way.
    ```bash
    npm start
    ```

## 📂 Project Structure

The project follows a standard MVC-like pattern:

```
/
├── config/         # Database configuration and Sequelize setup
├── controllers/    # Contains the business logic for API routes
├── cron-jobs.js    # Defines and schedules the cron jobs
├── index.js        # The main entry point for the application
├── loaders/        # Database loader utility
├── middleware/     # Custom middleware (e.g., auth, validation)
├── models/         # Sequelize model definitions and associations
├── public/         # Static frontend files for UI and admin panel
├── routes/         # Express route definitions
├── scripts/        # Standalone scripts (e.g., cron job logic)
├── services/       # Services for external APIs (Email, Cloudinary)
├── .env.example    # Example environment file
└── package.json
```

## 📜 API Endpoints

Here is a high-level overview of the available API routes:

-   `POST /api/auth/signup`: User registration.
-   `POST /api/auth/login`: User login.
-   `GET /api/dashboard`: Fetch user-specific dashboard data.
-   `POST /api/investments`: Purchase a new investment plan.
-   `POST /api/transactions/deposit`: Initiate a new deposit.
-   `POST /api/transactions/withdraw`: Request a withdrawal.
-   `GET /api/admin/users`: (Admin) Fetch all users.
-   `PUT /api/admin/deposits/approve/:id`: (Admin) Approve a deposit.
-   `PUT /api/admin/loans/decline/:id`: (Admin) Decline a loan.
-   `POST /api/admin/send-email`: (Admin) Send a custom email to a user.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
