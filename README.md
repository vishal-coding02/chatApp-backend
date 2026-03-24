# ChatApp - Backend

This is the backend (REST API + Socket.io server) for the ChatApp project, built with Node.js, Express, and MongoDB.

## Live API

https://chatapp-backend-production-05f2.up.railway.app/

## Features

- Real-time messaging using Socket.io
- Secure user authentication with JWT
- AES (Advanced Encryption Standard) message encryption using Crypto.js
- Message pagination support
- Online/Offline status tracking
- Typing indicator support
- Message request system (user must accept request before chat starts)
- Chat delete with auto-restore (chat restores if a new message is received after deletion)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Real-time:** Socket.io
- **Authentication:** JWT (JSON Web Token)
- **Encryption:** Crypto.js

## Deployment

- **Frontend (Vercel):** https://chat-app-frontend-mauve-pi.vercel.app/
- **Backend (Railway):** https://chatapp-backend-production-05f2.up.railway.app/

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/vishal-coding02/chatApp-backend.git

# Go to project folder
cd chatApp-backend

# Install dependencies
npm install

# Start the server
npm run start
```

## Environment Variables

Create a `.env` file in the root folder and add:

```
PORT=your_port
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ACCESS_SECRET_KEY=your-access-key
REFRESH_SECRET_KEY=your-refresh-key
CLOUD_NAME=your-cloud-name
CLOUD_API_KEY=your-cloud-api-key
CLOUD_API_SECRET=your-cloud-secret
CLIENT_URL=http://localhost:5173
SMTP_USER=your-username
BREVO_API_KEY=your-brevo-api-key
```

## Project Structure

```
Backend/
├── src/
│   ├── config/        # DB, Socket.io configuration
│   ├── libs/          # JWT, Cloudinary setup
│   ├── modules/
│   │   ├── auth/      # Register, Login, JWT logic
│   │   ├── chat/      # Chat create, delete, restore logic
│   │   ├── message/   # Send, fetch, paginate messages
│   │   └── user/      # User profile , all users
│   └── utils/         # Helper functions
├── .env
├── app.js             # Express app setup
├── server.js          # Entry point
└── package.json
```

## API Endpoints

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| POST   | `/api/auth/register`            | Register new user        |
| POST   | `/api/auth/login`               | Login user               |
| GET    | `/api/user/:id`                 | Get user profile         |
| POST   | `/api/chat/request`             | Send message request     |
| PATCH  | `/api/chats/:chatId/accept`     | Accept message request   |
| GET    | `/api/chat`                     | Get all chats            |
| DELETE | `/api/chats/:chatId`            | Delete a chat            |
| GET    | `/api/messages/:conversationId` | Get messages (paginated) |
| POST   | `/api/message`                  | Send a message           |
| DELETE | `/api/messages/:messageId`      | Delete a message         |

## Frontend Repository

> This is only the backend. Frontend repo is here:
> [chatApp-frontend](https://github.com/vishal-coding02/chatApp-frontend)

