# Nexora

Nexora is a full-stack e-commerce platform built with React, Express, MongoDB, and Mongoose. Customers can create accounts, browse a database-backed product catalogue, search and filter products, view product details, and manage their profile and delivery address.

The project is under active development. Cart, checkout, payment, and order persistence are planned for later iterations.

## Features

- Customer registration and login
- JWT authentication stored in HTTP-only cookies
- Protected and public frontend routes
- Customer profile and shipping address management
- Profile image preview and upload
- Product creation API
- Product listing and product details APIs
- Case-insensitive product search
- Category filtering
- Price sorting
- Dynamic product listing cards
- Product details page with UI-only Add to Cart action
- Loading, error, and empty states
- MongoDB persistence and bcrypt password hashing

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens
- bcrypt
- Multer
- dotenv
- cookie-parser
- cors

## Local URLs

The development setup uses localhost consistently:

| Service | URL |
| --- | --- |
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8084 |

The backend allows credentialed requests from `http://localhost:5173`.

## Project Structure

```text
Nexora/
├── client/
│   ├── public/
│   └── src/
│       ├── axiosCalls/
│       │   └── axios.js
│       ├── components/
│       │   ├── ProductCard.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── PublicRoute.jsx
│       │   └── StatusMessage.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── Pages/
│       │   ├── CustomerProfile.jsx
│       │   ├── Home.jsx
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Logout.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── Products.jsx
│       │   └── Signup.jsx
│       ├── services/
│       │   └── productApi.js
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
└── server/
    ├── controllers/
    │   ├── customer.controllers.js
    │   └── product.controllers.js
    ├── middlewares/
    │   ├── authMiddleware.js
    │   └── upload.middleware.js
    ├── model/
    │   ├── customer.model.js
    │   └── product.model.js
    ├── routes/
    │   ├── customer.routes.js
    │   └── product.routes.js
    ├── utils/
    │   └── genToken.js
    └── index.js
```

## Frontend Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | E-commerce landing page |
| `/login` | Public | Customer login |
| `/signup` | Public | Customer registration |
| `/home` | Protected | Shopping home and catalogue entry point |
| `/products` | Protected | Dynamic product listing, search, filtering, and sorting |
| `/products/:id` | Protected | Individual product details |
| `/profile` | Protected | Customer details, address, and profile image management |
| `/logout` | Public | Clears the session and redirects to login |

`AuthContext` loads the current customer from `/customer/me`. `PublicRoute` redirects authenticated customers away from login and signup, while `ProtectedRoute` redirects unauthenticated customers to login.

## Backend API

### Customer APIs

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/customer/register` | Create a customer account |
| `POST` | `/customer/login` | Authenticate a customer |
| `GET` | `/customer/me` | Return the authenticated customer |
| `PUT` | `/customer/profile` | Update customer and shipping details |
| `POST` | `/customer/profile/image` | Upload a customer profile image |
| `POST` | `/customer/logout` | Clear the authentication cookie |

Customer responses are sanitized so the stored password is never returned. Profile update routes use the authenticated customer from the JWT cookie rather than accepting a customer ID from the browser.

### Product APIs

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/products` | Create a product |
| `GET` | `/products` | Return products |
| `GET` | `/products/:id` | Return one product |

Product listing query parameters:

```text
/products?search=keyboard
/products?category=Electronics
/products?search=keyboard&category=Electronics
/products?sort=price_asc
/products?sort=price_desc
```

Search matches product names case-insensitively. Category matching is case-insensitive. The API returns a count and product array for listing requests.

## Product Schema

Products contain:

| Field | Type | Rules |
| --- | --- | --- |
| `name` | String | Required |
| `description` | String | Required |
| `price` | Number | Required, greater than 0 |
| `category` | String | Required |
| `image` | String | Required image URL |
| `stock` | Number | Required, minimum 0 |
| `createdAt` | Date | Generated automatically |

## Setup

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB database

### Clone the repository

```bash
git clone https://github.com/PrabhatRanjanJha/Nexora.git
cd Nexora
```

### Configure the backend

Create `server/.env`:

```env
dbURL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit `.env` files or real credentials.

### Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Start the backend

From the `server` directory:

```bash
node index.js
```

The API will run at `http://localhost:8084`.

### Start the frontend

In a second terminal, from the `client` directory:

```bash
npm run dev
```

Open `http://localhost:5173` in the browser. Use `localhost` consistently instead of `127.0.0.1` so the configured CORS origin matches.

## Available Scripts

From `client`:

```bash
npm run dev
npm run build
npm run preview
```

From `server`:

```bash
node index.js
```

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWTs are stored in HTTP-only cookies.
- Profile and shipping updates require authentication.
- Profile image uploads accept images up to 2 MB.
- Passwords are removed from all customer API responses.
- MongoDB credentials and JWT secrets must remain in local environment files.

## Current Limitations

- Add to Cart is currently a frontend-only interaction.
- Cart persistence is not implemented yet.
- Checkout, payments, and order history are not implemented yet.
- Product creation is currently an open API and does not yet require admin authorization.
- Automated tests are not currently configured.

## Author

Prabhat Ranjan Jha
