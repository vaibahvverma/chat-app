ChatApp – Real-Time Messaging Application

ChatApp is a real-time messaging application developed using the MERN stack (MongoDB, Express.js, React, Node.js) with Socket.IO integration. It allows users to register, authenticate, and communicate instantly through private and group chats. The project demonstrates full-stack development with a modern, responsive UI and secure backend.

**Features**
User authentication and authorization using JWT
Real-time messaging powered by Socket.IO
Private and group chat functionality
Profile management with avatar support
Message notifications and read receipts
Responsive design for both desktop and mobile
RESTful APIs for scalable communication

**Tech Stack**

Frontend: React.js, CSS/Tailwind (or chosen styling library)
Backend: Node.js, Express.js
Database: MongoDB with Mongoose
Real-Time Communication: Socket.IO
Authentication: JSON Web Tokens (JWT) and bcrypt
Deployment Options: Vercel, Netlify, Render, or Heroku

**Project Structure**
chat-app/
│
├── client/        # React frontend
├── server/        # Node.js + Express backend
├── README.md      # Project documentation
└── package.json   # Dependencies

Installation and Setup
1. Clone the repository
git clone https://github.com/vaibahvverma/chat-app.git
cd chat-app

2. Backend setup
cd server
npm install


Create a .env file inside the server directory and configure the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Run the backend:

npm start

3. Frontend setup
cd client
npm install
npm start


The application will be available at http://localhost:3000

API Endpoints (Examples)

Authentication

POST /api/auth/register – Register a new user

POST /api/auth/login – Login user

Chats

POST /api/chat – Create new chat
GET /api/chat – Get all chats for a user

Messages

POST /api/message – Send a new message
GET /api/message/:chatId – Get all messages in a chat

Deployment

Frontend can be deployed on Netlify or Vercel
Backend can be deployed on Render or Heroku

MongoDB Atlas is recommended for database hosting

Contribution
Contributions are welcome.
Fork the repository
Create a feature branch (feature/your-feature)
Commit and push your changes
Create a pull request

License

This project is licensed under the MIT License.
