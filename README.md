# 📚 BookHaven – Modern Online Bookstore

A full-stack online bookstore built with the MERN stack, featuring a modern shopping experience, dynamic book search, and cart management.

## ✨ Features

- Dynamic book search using Open Library API
- Featured books stored in MongoDB Atlas
- Individual book details
- Add, remove, and update cart quantities
- Persistent shopping cart using Local Storage
- Checkout with Card, UPI, and Cash on Delivery demo options
- Responsive desktop and mobile design
- REST API with complete CRUD operations

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|---|---|---|
| React.js | Node.js | MongoDB Atlas |
| JavaScript | Express.js | Mongoose |
| Vite | REST API | |
| HTML & CSS | | |

## 📂 Project Structure

```text
BookHaven/
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/
│   ├── models/
│   ├── server.js
│   └── package.json
└── README.md
```

## 🚀 Run Locally

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd BookHaven
```

**2. Install frontend dependencies**

```bash
cd frontend
npm install
```

**3. Install backend dependencies**

```bash
cd ../backend
npm install
```

**4. Configure MongoDB**

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
```

**5. Start the backend**

```bash
npm run dev
```

**6. Start the frontend**

Open another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL provided by Vite.

## 🔗 API Endpoints

| Method | Endpoint | Function |
|---|---|---|
| GET | `/api/books` | Fetch all books |
| GET | `/api/books/:id` | Fetch one book |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

## 💳 Payment Disclaimer

Payment options are demonstration-only. No real payment gateway or transaction processing is connected.

## 👨‍💻 About

BookHaven is a full-stack bookstore project developed to demonstrate frontend development, backend API integration, database management, and e-commerce functionality.
