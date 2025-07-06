# SocketPrep Server

A powerful Node.js/Express backend for real-time chat, featuring authentication, REST APIs, Socket.io, and advanced fuzzy user search with PostgreSQL.

---

## ✨ Features
- **User Authentication** (JWT-based, secure)
- **Real-time Messaging** (Socket.io)
- **RESTful APIs** for users, chats, and messages
- **Fuzzy User Search** (leveraging PostgreSQL's full-text search)
- **Group & Private Chats**
- **Role-based Access** (only message sender can delete)
- **Modern Prisma ORM**

---

## 🚀 Setup

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd server
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` and set your `DATABASE_URL` and `REFERESH_TOKEN_SECRET`.
4. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```
5. **Start the server:**
   ```bash
   npm run dev
   ```

---

## 🏁 Quick Start Guide

Follow these steps to get up and running with the backend APIs:

### 1. Register a New User
- **Endpoint:** `POST /api/v1/user/register`
- **Body:**
  ```json
  { "name": "Alice", "email": "alice@example.com", "password": "yourpassword", "pic": "<optional-url>" }
  ```
- **Example cURL:**
  ```bash
  curl -X POST http://localhost:8000/api/v1/user/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Alice","email":"alice@example.com","password":"yourpassword"}'
  ```

### 2. Login
- **Endpoint:** `POST /api/v1/user/login`
- **Body:**
  ```json
  { "email": "alice@example.com", "password": "yourpassword" }
  ```
- **Example cURL:**
  ```bash
  curl -X POST http://localhost:8000/api/v1/user/login \
    -H "Content-Type: application/json" \
    -d '{"email":"alice@example.com","password":"yourpassword"}'
  ```
- **Response:** Returns a JWT token. **Save this token!**
- **How to use:** For all protected endpoints, add this header:
  ```
  Authorization: Bearer <your-jwt-token>
  ```

### 3. Fuzzy Search for Users (Find Someone to Chat With)
- **Endpoint:** `GET /api/v1/user/fuzzy-search?email=<search-term>`
- **Description:** Fuzzy search users by email using trigram similarity (PostgreSQL). Returns users with similar emails, even if not an exact match.
- **Example cURL:**
  ```bash
  curl -X GET "http://localhost:8000/api/v1/user/fuzzy-search?email=ali" \
    -H "Authorization: Bearer <your-jwt-token>"
  ```

### 3a. Exact Search for User by Email
- **Endpoint:** `GET /api/v1/user/search?email=<exact-email>`
- **Description:** Search for a user by exact email match.
- **Example cURL:**
  ```bash
  curl -X GET "http://localhost:8000/api/v1/user/search?email=alice@example.com" \
    -H "Authorization: Bearer <your-jwt-token>"
  ```

### 4. Start a Private Chat
- **Endpoint:** `POST /api/v1/chat/private`
- **Body:**
  ```json
  { "userId": 2 }
  ```
- **Example cURL:**
  ```bash
  curl -X POST http://localhost:8000/api/v1/chat/private \
    -H "Authorization: Bearer <your-jwt-token>" \
    -H "Content-Type: application/json" \
    -d '{"userId":2}'
  ```

### 5. Create a Group Chat
- **Endpoint:** `POST /api/v1/chat/group`
- **Body:**
  ```json
  { "users": [2,3], "chatName": "Project Team", "groupPic": "<optional-url>" }
  ```
- **Example cURL:**
  ```bash
  curl -X POST http://localhost:8000/api/v1/chat/group \
    -H "Authorization: Bearer <your-jwt-token>" \
    -H "Content-Type: application/json" \
    -d '{"users":[2,3],"chatName":"Project Team"}'
  ```

### 6. Send a Message
- **Endpoint:** `POST /api/v1/message/`
- **Body:**
  ```json
  { "content": "Hello, team!", "senderId": 1, "chatId": 1 }
  ```
- **Example cURL:**
  ```bash
  curl -X POST http://localhost:8000/api/v1/message/ \
    -H "Authorization: Bearer <your-jwt-token>" \
    -H "Content-Type: application/json" \
    -d '{"content":"Hello, team!","senderId":1,"chatId":1}'
  ```

### 7. Delete a Message
- **Endpoint:** `DELETE /api/v1/message/delete/:messageId`
- **Note:** Only the sender can delete their message.
- **Example cURL:**
  ```bash
  curl -X DELETE http://localhost:8000/api/v1/message/delete/123 \
    -H "Authorization: Bearer <your-jwt-token>"
  ```

### 8. Real-time Messaging with Socket.io
- **Connect:**
  ```js
  const socket = io("http://localhost:8000");
  ```
- **Join a chat room:**
  ```js
  socket.emit("join_chat", chatId);
  ```
- **Send a message:**
  ```js
  socket.emit("send_message", { content: "Hello!", senderId: 1, chatId: 1 });
  ```
- **Receive a message:**
  ```js
  socket.on("receive_message", (msg) => { console.log(msg); });
  ```

---

## 🛠️ API Reference

> **Note:** All protected endpoints require a valid JWT in the `Authorization` header: `Authorization: Bearer <token>`

### User APIs
- **Register:** `POST /api/v1/user/register`
- **Login:** `POST /api/v1/user/login`
- **Exact Search:** `GET /api/v1/user/search?email=<exact-email>`
- **Fuzzy Search:** `GET /api/v1/user/fuzzy-search?email=<search-term>`

### Chat APIs
- **Fetch all chats:** `GET /api/v1/chat/`
- **Create/access private chat:** `POST /api/v1/chat/private`
- **Get single chat:** `GET /api/v1/chat/:chatId`
- **Create group chat:** `POST /api/v1/chat/group`
- **Rename group chat:** `PUT /api/v1/chat/group/rename`
- **Add user(s) to group:** `PUT /api/v1/chat/group/add`
- **Remove user(s) from group:** `PUT /api/v1/chat/group/remove`

### Message APIs
- **Send a message:** `POST /api/v1/message/`
- **Fetch all messages for a chat:** `GET /api/v1/message/:chatId`
- **Delete a message:** `DELETE /api/v1/message/delete/:messageId`

---

## 🔒 Notes
- All protected endpoints require a valid JWT in the `Authorization` header.
- Only the sender of a message can delete it.
- Socket.io events are real-time and scoped to chat rooms.
- Fuzzy user search is powered by PostgreSQL for high performance.

---

## 🧑‍💻 Contributing
Pull requests welcome! Open an issue or submit a PR to contribute.

---

## 📄 License
MIT 