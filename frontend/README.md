# BookHaven – Modern Online Bookstore

BookHaven is a modern, responsive online bookstore built using React.js and Node.js. It provides a simple and enjoyable shopping experience where users can discover books, explore collections, view book details, and manage their shopping bag.

## Features

- **Book Search:** Search for books dynamically using the Open Library API.
- **Featured Collection:** Display books stored in MongoDB.
- **Book Details:** View book information, author, cover, and price.
- **Shopping Cart:** Add books, remove items, update quantities, and calculate the subtotal.
- **Cart Persistence:** Cart data is saved using Local Storage.
- **Checkout:** Enter contact and delivery details.
- **Payment Options:** Demo checkout options for Card, UPI, and Cash on Delivery.
- **Responsive Design:** Designed for desktop and mobile screens.

## Technologies Used

**Frontend**
- React.js
- JavaScript
- Vite
- HTML5
- CSS3
- Open Library API
- Local Storage

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- REST API

**Tools**
- Visual Studio Code
- Postman
- Git and GitHub

## Project Structure

```text
BookHaven/
├── backend/
│   ├── models/
│   │   └── Book.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    └── package.json
```

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd BookHaven
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
```

### 5. Start the backend

```bash
cd backend
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 6. Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get a book by ID |
| POST | `/api/books` | Add a new book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

## Important Note

The checkout and payment options are for demonstration purposes only. No real payment processing is implemented.

## Author

Developed as a full-stack bookstore project using the MERN stack.

