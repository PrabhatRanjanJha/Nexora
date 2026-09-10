# Nexora 🚀

Nexora is a MERN-based customer portal built with **React, Express, and MongoDB**.

The current version focuses on customer authentication, protected pages, and basic customer profile management.

> 🚧 Nexora is currently under development.

---

## ✨ Features

* 🔐 Customer signup & login
* 🔑 JWT authentication
* 🍪 HTTP-only authentication cookies
* 🔒 Protected routes
* 👤 Customer profile retrieval
* 🚪 Logout
* 🔄 Authentication state management with React Context
* 🗄️ MongoDB database
* 🔒 Password hashing with bcrypt

---

## 🛠️ Tech Stack

**Frontend**

* React 19
* Vite
* React Router
* Axios
* Tailwind CSS

**Backend**

* Node.js
* Express 5
* MongoDB
* Mongoose
* JWT
* bcrypt
* dotenv
* cookie-parser

---

## 📁 Project Structure

```text
Nexora/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── axiosCalls/
│       │   └── axios.js
│       ├── components/
│       │   ├── ProtectedRoute.jsx
│       │   ├── PublicRoute.jsx
│       │   └── StatusMessage.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── Pages/
│       │   ├── Home.jsx
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   └── Signup.jsx
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
└── server/
    ├── controllers/
    │   └── customer.controllers.js
    ├── middlewares/
    │   └── authMiddleware.js
    ├── model/
    │   └── customer.model.js
    ├── routes/
    │   └── customer.routes.js
    ├── utils/
    │   └── genToken.js
    └── index.js
```

---

## 🌐 Application Routes

| Route     | Purpose                 |
| --------- | ----------------------- |
| `/`       | Landing page            |
| `/login`  | Login                   |
| `/signup` | Customer registration   |
| `/home`   | Protected customer page |
| `*`       | Redirects to `/`        |

Authentication is managed through `AuthContext`, with `ProtectedRoute` and `PublicRoute` handling access to different pages.

---

## 🔌 API

The backend runs on port `9001` and exposes customer authentication routes under `/customer`.

| Method | Endpoint             | Purpose                    |
| ------ | -------------------- | -------------------------- |
| `POST` | `/customer/register` | Create a customer account  |
| `POST` | `/customer/login`    | Login                      |
| `GET`  | `/customer/me`       | Get the logged-in customer |
| `POST` | `/customer/logout`   | Logout                     |

The frontend communicates with the backend using Axios and sends authentication cookies with requests.

---

## 🔐 Authentication

Nexora uses **JWT-based authentication with HTTP-only cookies**.

```text
Signup / Login
      ↓
JWT generated
      ↓
HTTP-only cookie
      ↓
Authenticated request
      ↓
Protected route / API
```

Passwords are hashed using **bcrypt** and are not returned in customer responses.

---

## 🚧 Future Improvements

* More customer portal functionality
* Automated testing
* Improved validation and error handling
* Production deployment
* Additional security improvements

---

## 👨‍💻 Author

**Prabhat Ranjan Jha**

---

**Nexora — still building. 🚀**
