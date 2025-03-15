# Project Management Tool

## 📌 Overview
This **Project Management Tool** is a full-stack web application built using **React.js** for the frontend and **Express.js with MongoDB** for the backend. It provides an efficient platform for teams to create, assign, track, and manage tasks seamlessly. The application supports authentication, real-time updates, and user role management to enhance productivity.

---

## 🚀 Features
- **User Authentication** (JWT-based login & signup)
- **Task Management** (Create, update, delete, and assign tasks)
- **Real-time Updates** (WebSockets/Sockets.io for instant changes)
- **State Management** (React Context API / Redux)
- **Dark Mode Support** (User-friendly UI/UX with Material UI)
- **Responsive Design** (Optimized for desktop and mobile devices)
- **Deployment-ready** (Vercel for frontend, MongoDB Atlas for database)

---

## 🛠️ Tech Stack

| Component        | Technology Used               |
|-----------------|--------------------------------|
| **Frontend**    | React.js, Material UI         |
| **Backend**     | Express.js, Node.js           |
| **Database**    | MongoDB (MongoDB Atlas)       |
| **Authentication** | JWT (JSON Web Token)       |
| **State Management** | React Context API / Redux |
| **Real-Time Updates** | WebSockets / Socket.io |
| **Deployment**  | Vercel (Frontend), MongoDB Atlas (Database) |

---

## 🔧 Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Kaushik00007/Project-Management-Tool
cd project-management-tool
```

### 2️⃣ Install Dependencies
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd frontend
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the **backend** directory and add the following:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/project-management-tool

# Authentication & Security
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000

# WebSockets (For Real-time Updates)
SOCKET_PORT=6000

# Deployment (For Production Mode)
NODE_ENV=development  # Change to 'production' in production environments
```

---

## 📦 Running the Project
### 1️⃣ Start the Backend Server
```bash
cd backend
npm start
```
### 2️⃣ Start the Frontend
```bash
cd frontend
npm start
```
The project will be accessible at **http://localhost:3000**.

## 🎯 Conclusion
This **Project Management Tool** provides an efficient way to track and manage tasks, improving productivity for teams and organizations. With real-time updates, secure authentication, and an intuitive UI, it ensures seamless collaboration. Future improvements aim to make the tool even more powerful and scalable.

---

## 📌 Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Commit your changes: `git commit -m 'Added new feature'`
4. Push to the branch: `git push origin feature-branch`
5. Open a Pull Request.

---

## 📞 Contact
For any queries or contributions, feel free to reach out:
- 📧 Email: kaushi00007@gmail.com  
- 🔗 LinkedIn: https://www.linkedin.com/in/kaushik-k-dev
- 🌍 GitHub: https://github.com/Kaushik00007/Kaushik00007
