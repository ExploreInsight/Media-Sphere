<h1 align='center'>📱 Media-Sphere – A Modern Social Media Clone (MERN + React Query)</h1>

A feature-rich **Social Media Web App** that allows users to register, log in, follow other users, create posts, comment, like, and explore public content. Built using **MERN Stack**, **Zod validation**, and **TanStack React Query** for data fetching and caching.

---

## 📸 Screenshots

![home page](/client/public/Home_MS.png)

---

## 🧱 Tech Stack

### 🔧 Backend:
- **Express.js** – REST API framework
- **MongoDB + Mongoose** – NoSQL database & ODM
- **JWT** – Token-based authentication
- **bcryptjs** – Password hashing
- **Zod** – Schema-based validation
- **Cloudinary** – Image storage
- **dotenv** – Environment configuration
- **cookie-parser** – Cookie management
- **CORS** – Cross-origin handling
- **http-status-codes** – Status code abstraction

### 🎨 Frontend:
- **React.js (v18)** – Component-based UI
- **React Router DOM v7** – Routing
- **@tanstack/react-query** – Server state management
- **Axios** – HTTP requests
- **React Hot Toast** – Notifications
- **React Icons** – Icon support
- **DaisyUI** – Tailwind component library

---

## ✨ Features

- 🔐 **User Authentication** (signup, login, logout)
- 👤 **User Profile** with bio, profile picture, and followers
- 📝 **Create Posts** with text and optional media
- ❤️ **Like & Comment** on posts
- 🔁 **Follow / Unfollow Users**
- 🌐 **Suggested Users** to connect with
- 🧾 **Post Feeds**: All posts, following feed, user feed
- ✅ **Schema-based request validation** using Zod
- 🔒 **Protected Routes** using custom middleware

---

## 🔌 API Endpoints

> Base URL: `/api`

### 🧑 Auth Routes

| Method | Endpoint      | Description                  |
|--------|---------------|------------------------------|
| POST   | `/signup`     | Register a new user          |
| POST   | `/login`      | Authenticate user            |
| POST   | `/logout`     | Log out the user             |
| GET    | `/profile`    | Get current user's profile   |

---

### 📝 Post Routes

| Method | Endpoint             | Description                      |
|--------|----------------------|----------------------------------|
| GET    | `/all`               | Get all public posts             |
| GET    | `/following`         | Get posts from followed users    |
| GET    | `/likedPost/:id`     | Get posts liked by a user        |
| GET    | `/user/:username`    | Get posts by specific user       |
| POST   | `/create`            | Create a new post                |
| PUT    | `/like/:id`          | Like or unlike a post            |
| POST   | `/comment/:id`       | Add comment to a post            |
| DELETE | `/:userId`           | Delete a user’s post             |

---

### 👥 User Routes

| Method | Endpoint                         | Description                          |
|--------|----------------------------------|--------------------------------------|
| GET    | `/v1/profile/:username`          | Get profile by username              |
| GET    | `/suggested`                     | Get suggested users                  |
| POST   | `/follow/:userId`                | Follow or unfollow a user            |
| PUT    | `/update`                        | Update user profile info             |

---

### 🧑‍💻 Getting Started

 Clone the Repo
 
```shell

https://github.com/ExploreInsight/Media-Sphere.git
cd Media Shpere

```
### Install Dependencies
Backend
```shell

npm install

```

 Frontend:
 
 ```shell

cd client
npm install

```

### ⚙️ Setup Environment Variables

In the /server folder, create a .env file and add the following:

```js
 PORT=7001
 MONGO_URI=your-mongodb-uri
 JWT_SECRET=your-jwt-secret
 CLOUDINARY_NAME=your-cloud-name
 CLOUDINARY_API_KEY=your-api-key
 CLOUDINARY_SECRET=your-secret
```
---

### Run the API

```shell
npm run dev
```
The backend (API) should be running at:
http://localhost:7001 

### Run the frontend

```shell
cd client
npm run dev
```

The frontend should be running at:
http://localhost:5173

---

### 👨‍💻 Author
Chirag
