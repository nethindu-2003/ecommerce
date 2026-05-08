# E-Commerce Platform - System Structure and Logic

## 🚀 Overview
This is a full-stack e-commerce application built with a modern tech stack. It features a robust backend for managing products, orders, and users, coupled with a responsive React frontend. The system also includes a powerful admin dashboard for store management.

---

## 🏗️ System Architecture

The project follows a **decoupled architecture**, separating the frontend and backend to ensure scalability and maintainability.

### 1. Backend (Node.js & Express)
Located in the `/backend` directory, the backend serves as the core logic engine and API provider.

- **Framework**: Express.js
- **Database**: PostgreSQL with **Sequelize ORM** for data modeling and migrations.
- **Authentication**:
  - **JWT (JSON Web Tokens)**: Used for stateless API authentication between the frontend and backend.
  - **Bcrypt**: Used for secure password hashing.
- **Admin Panel**: Powered by **AdminJS**, providing a high-performance interface for managing database resources (Users, Products, Categories, Orders) without writing custom CRUD logic.
- **Logic Layers**:
  - **Models**: Defines the database schema and relationships (e.g., User has many Orders).
  - **Controllers**: Contains the business logic for handling requests.
  - **Routes**: Maps API endpoints to specific controllers.
  - **Middleware**: Handles authentication checks and role-based access control.

### 2. Role-Based Access Control (RBAC) Logic
The system implements a dual-layer access control mechanism to ensure security and data privacy.

- **Admin Access**: Users with the `admin` role have full access to the AdminJS dashboard, allowing them to manage users, update site settings, and perform CRUD operations on products and categories.
- **User Access**: Users with the `user` role are restricted within the admin dashboard. They can only view their own order history and are prevented from accessing administrative resources or site settings.
- **Dashboard Summaries**: The admin dashboard dynamically calculates and displays system-wide metrics, including total users, total orders, product counts, and cumulative revenue from successful transactions.

### 3. Frontend (React & Vite)
Located in the `/frontend` directory, the frontend provides a seamless user experience.

- **Framework**: React.js (built with Vite for fast development).
- **Navigation**: `react-router-dom` for client-side routing and protected routes.
- **State Management**: Uses React Hooks (`useState`, `useEffect`) and Axios for API data fetching.
- **Styling**: Vanilla CSS for custom, high-performance styling.
- **Layouts**:
  - **Admin Layout**: Dedicated sidebar and dashboard for administrative tasks.
  - **User Layout**: Optimized for product browsing, cart management, and profile viewing.

---

## 🛠️ Key Logic Flows

### Authentication Flow
1. **User Login**: User submits credentials -> Backend validates via Bcrypt -> Backend generates a JWT -> Frontend stores the token (localStorage/sessionStorage).
2. **Authenticated Requests**: Frontend sends the JWT in the `Authorization` header -> Backend middleware verifies the token -> Requested resource is returned.

### Order Management Logic
1. **User Side**: User adds products to cart -> Places order -> Order is saved in the database with a "Pending" status.
2. **Admin Side**: Admin views the order list via the dashboard -> Updates order status (e.g., Shipped, Delivered) -> Data is synchronized across the platform.

### Database Synchronization
- The backend uses `sequelize.sync()` to ensure the database schema matches the models defined in the code, facilitating easy updates during development.

---

## 📦 Deployment & Environment
- **Docker**: The system is containerized using `docker-compose.yml`, allowing for easy orchestration of the Node.js app, React app, and PostgreSQL database.
- **Environment Variables**: Managed via `.env` files for secure configuration (DB credentials, JWT secrets, API keys).

---

## 📂 Project Structure
```text
ecommerce/
├── backend/              # Node.js API & AdminJS
│   ├── config/           # Database & Admin configuration
│   ├── controllers/      # Business logic
│   ├── models/           # Sequelize data models
│   ├── routes/           # API endpoints
│   └── index.js          # Server entry point
├── frontend/             # React Application
│   ├── src/
│   │   ├── api/          # API service configurations
│   │   ├── pages/        # Main page components
│   │   └── App.jsx       # Main application & routing
├── docker-compose.yml    # Container orchestration
└── .env                  # Environment configuration
```
