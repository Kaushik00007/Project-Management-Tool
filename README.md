# Project Management Tool

## 🚀 Overview
The **Project Management Tool** is a web-based application designed to help teams efficiently manage tasks, collaborate in real-time, and track project progress. Built with **React.js** and **Express.js**, the tool provides a seamless experience for task allocation, progress tracking, and team communication.

## ✨ Features
- 🗂 **Task Management** – Create, assign, update, and delete tasks effortlessly.
- 📅 **Project Tracking** – Monitor project milestones and deadlines.
- 🔄 **Real-Time Updates** – Instant task updates using **WebSockets (Socket.io)**.
- 🔐 **Secure Authentication** – JWT-based authentication system.
- ⚡ **Efficient State Management** – Powered by **React Context API / Redux**.
- 📊 **Scalable & Optimized** – Hosted on **Vercel** (Frontend) and **MongoDB Atlas** (Database).

## 🛠️ Tech Stack
| Component        | Technology Used |
|-----------------|----------------|
| **Frontend**    | React.js, Material UI |
| **Backend**     | Express.js, Node.js |
| **Database**    | MongoDB Atlas (NoSQL) |
| **Authentication** | JWT (JSON Web Token) |
| **State Management** | React Context API / Redux |
| **Real-Time Updates** | WebSockets / Socket.io |
| **Deployment**  | Vercel (Frontend), MongoDB Atlas (Database) |

## 🔧 Installation & Setup
### Prerequisites
- **Node.js (>=14.0.0)** installed
- **MongoDB Atlas Account**
- **Git** installed

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Kaushik00007/Project-Management-Tool
cd Project-Management-Tool
```

### 2️⃣ Install Dependencies
#### Backend Setup:
```sh
cd backend
npm install
```
#### Frontend Setup:
```sh
cd ../frontend
npm install
```

### 3️⃣ Set Up Environment Variables
Create a **.env** file inside the backend folder and add:
```env
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Application
#### Start Backend Server:
```sh
cd backend
npm start
```
#### Start Frontend Server:
```sh
cd frontend
npm start
```

## 📌 Usage
1. **Sign up/Login** with secure JWT authentication.
2. **Create & manage tasks** for different projects.
3. **Track progress** and update task status.
4. **Collaborate in real-time** using WebSockets.

## 🙌 Contributions
Contributions are welcome! Follow these steps:
1. Fork the repository
2. Create a new branch 
3. Commit your changes
4. Open a pull request

## 📧 Contact
For any queries, reach out via:
- 📩 Email: kaushi00007@gmail.com
- 🔗 LinkedIn: https://www.linkedin.com/in/kaushik-k-dev

---
💡 *Built with ❤️ using React.js, Express.js, and MongoDB.*
