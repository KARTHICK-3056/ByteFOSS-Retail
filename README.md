# ByteFOSS Retail - Modern Retail Point of Sale System

ByteFOSS Retail is a high-performance, modern Retail Point of Sale (POS) system designed with a premium dark-themed interface. It features a robust architecture with a React frontend and a Node.js/Express backend, integrated with MongoDB for data persistence and a built-in mock database fallback for development and offline testing.

![ByteFOSS Retail Banner](https://img.shields.io/badge/ByteFOSS_Retail-Modern_POS-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active_Development-green?style=for-the-badge)

## ✨ Key Features

-   **📊 Dynamic Dashboard**: Real-time insights into sales, orders, and inventory.
-   **🛒 Advanced POS Interface**: Streamlined checkout process with item searching, category filtering, and cart management.
-   **📦 Inventory Management**: Full CRUD operations for products, including stock tracking and tax calculation.
-   **👥 Customer CRM**: Manage customer profiles and loyalty points.
-   **📑 Order History**: Comprehensive tracking of all transactions.
-   **🛡️ Audit Logs**: Automated logging of critical system actions for security and transparency.
-   **🌗 Premium Dark Mode**: Deeply integrated dark theme for a professional and focused user experience.
-   **🔄 Hybrid Database System**: Seamlessly switches between MongoDB and a mock local database if the server is disconnected.

## 🛠️ Tech Stack

**Frontend:**
-   React (Vite)
-   React Router
-   Context API (State Management)
-   Vanilla CSS (Custom Premium UI)

**Backend:**
-   Node.js & Express
-   MongoDB (Mongoose ODM)
-   Dotenv (Environment Configuration)
-   Cors

## 🚀 Getting Started

### Prerequisites
-   [Node.js](https://nodejs.org/) (v16+ recommended)
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/ByteFOSS-Retail.git
    cd ByteFOSS-Retail
    ```

2.  **Install Dependencies**
    Install root dependencies:
    ```bash
    npm install
    ```
    Install Client and Server dependencies:
    ```bash
    cd client && npm install
    cd ../server && npm install
    cd ..
    ```

3.  **Environment Setup**
    Create a `.env` file in the `server` directory based on `.env.example`:
    ```env
    MONGO_URI=mongodb://localhost:27017/bytefoss_retail
    PORT=5000
    ```

### Running the Application

You can start both the client and server concurrently using the root command:

```bash
npm run dev
```

Alternatively, use the provided `run.bat` file (Windows):
```bash
./run.bat
```

## 📁 Project Structure

```text
ByteFOSS-Retail/
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Global state management
│   │   ├── layouts/     # Page layouts (Dashboard, etc.)
│   │   ├── pages/       # Application views
│   │   └── utils/       # Utility scripts
├── server/              # Node.js Express Backend
│   ├── models/          # Mongoose Schemas
│   └── server.js        # Main entry point & API routes
├── package.json         # Root configuration for concurrency
└── run.bat              # Quick start script
```

## 🔐 Database Configuration

The system is designed to be resilient:
-   **MongoDB Mode**: Set a valid `MONGO_URI` in `server/.env`.
-   **Mock Mode**: If no MongoDB connection is found, the server automatically falls back to an in-memory mock database, allowing you to test features without a database setup.


---
Built with ❤️ by ByteFOSS.
