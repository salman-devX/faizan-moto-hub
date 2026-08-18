# 🚗 Faizan Motor Workshop

A modern full-stack workshop management and service booking platform designed for **Faizan Motor Workshop**. The platform allows customers to request automotive services, track their requests, and upload vehicle images/videos while providing dedicated dashboards for staff and administrators.

## 🌐 Live Demo

**[Visit Faizan Motor Workshop](https://faizan-moto-hub-1.onrender.com)**

## ✨ Features

* 🛠️ Automotive service booking
* 🚗 Mechanical / Motor services
* ⚡ Electrical services
* 🎨 Denting services
* 🖌️ Painting services
* 📍 Service request tracking
* 🔎 Public tracking using booking information
* 📸 Upload vehicle photos/videos
* 👤 Customer authentication
* 👨‍🔧 Staff dashboard
* 👑 Admin dashboard
* 🔐 JWT-based authentication
* 🗃️ SQLite database
* 📱 Responsive and modern UI

## 👥 User Roles

| Role       | Access                                                   |
| ---------- | -------------------------------------------------------- |
| Customer   | Create service requests, track requests and upload media |
| Motor      | Manage mechanical service requests                       |
| Electrical | Manage electrical service requests                       |
| Denter     | Manage denting requests                                  |
| Painter    | Manage painting requests                                 |
| Admin      | Manage all requests and staff roles                      |

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* JavaScript / JSX

### Backend

* Node.js
* Express.js
* SQLite
* Better-SQLite3
* JWT Authentication
* Multer

## 📁 Project Structure

```text
faizan-moto-hub/
├── backend/
│   └── Express API + SQLite database
│
├── frontend/
│   └── React + Vite application
│
├── package.json
├── package-lock.json
└── README.md
```

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/salman-devX/faizan-moto-hub.git
cd faizan-moto-hub
```

### 2. Install dependencies

```bash
npm install
npm run install:all
```

### 3. Start the development environment

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

The backend runs on:

```text
http://localhost:4000
```

## 🔐 Environment Variables

Create the required `.env` files using the provided `.env.example` files.

Never commit sensitive credentials or secrets such as:

```text
JWT_SECRET
```

## 📊 Service Tracking

Each booking receives a unique tracking ID such as:

```text
FMW-2026-0001
```

Customers can use their booking information to track the progress of their service request.

## 🚀 Deployment

The frontend can be deployed using platforms such as:

* Vercel
* Netlify

The backend can be deployed using:

* Render
* Railway
* Other Node.js hosting platforms

For production deployments, persistent storage should be configured for uploaded files and database data.

## 🎯 Purpose

This project demonstrates a real-world full-stack application combining customer-facing functionality with role-based staff and administrative management.

## 👨‍💻 Developer

**Salman Ahmad**

Web Developer • Software Developer

### 🔗 Links

* 🌐 Live Website: https://faizan-moto-hub-1.onrender.com
* 🐙 GitHub: https://github.com/salman-devX

## 📄 License

This project is created and maintained by Salman Ahmad.
