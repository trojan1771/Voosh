

# 🎵 Music Library Management API

A comprehensive backend API for managing music libraries, supporting authentication, role-based access control, and CRUD operations for Users, Artists, Albums, Tracks, and Favorites.

---

## **Features**

### **Authentication & Authorization**
- Secure user authentication with **JWT**.
- Role-based access control (RBAC) with three roles:
  - **Admin**: Full access to all resources.
  - **Editor**: Can manage Artists, Albums, Tracks, and update their own details.
  - **Viewer**: Read-only access.

### **Entity Management**
- **Users**: Admins can add, update, or delete users.
- **Artists**: CRUD operations for managing artists.
- **Albums**: CRUD operations with artist association.
- **Tracks**: CRUD operations with album and artist association.
- **Favorites**: Personalized favorites for users by category (Artists, Albums, Tracks).

### **Filtering & Pagination**
- Supports filters (`hidden`, `artist_id`, `album_id`) and pagination (`limit`, `offset`).

### **Robust Error Handling**
- Meaningful HTTP status codes (`200`, `400`, `401`, `403`, `404`) with descriptive error messages.

---

## **Tech Stack**
- **Node.js**: Backend runtime.
- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: Database for storing application data.
- **Mongoose**: Object Data Modeling (ODM) for MongoDB.
- **JWT**: Token-based authentication.
- **Bcrypt.js**: Password hashing for secure authentication.

---

## **Project Structure**

```
project/
│
├── config/              # Database configuration
├── controllers/         # Handlers for API endpoints
├── middleware/          # Authentication and role-based access middleware
├── models/              # Mongoose schemas for database entities
├── routes/              # API endpoint routing
├── .env                 # Environment variables
├── app.js               # Entry point of the application
└── package.json         # Node.js project metadata
```

---

## **Getting Started**

### **Prerequisites**
- Node.js (v14 or later)
- MongoDB (local or cloud-based, e.g., MongoDB Atlas)

### **Setup Instructions**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/music-library-api.git
   cd music-library-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory:
     ```env
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-secret-key>
     PORT=3000
     ```

4. **Start the Server**
   ```bash
   npm start
   ```

---

## **API Documentation**

### **Base URL**
`/api/v1`

### **Authentication**
| Method | Endpoint        | Description             | Roles     |
|--------|------------------|-------------------------|-----------|
| POST   | `/signup`        | Register a new user     | Public    |
| POST   | `/login`         | Login and get a token   | Public    |
| GET    | `/logout`        | Logout a user           | Logged-In |

### **User Management**
| Method | Endpoint              | Description                    | Roles       |
|--------|------------------------|--------------------------------|-------------|
| GET    | `/users`              | Get all users                  | Admin       |
| POST   | `/users/add-user`     | Add a new user                 | Admin       |
| DELETE | `/users/:id`          | Delete a user by ID            | Admin       |
| PUT    | `/users/update-password` | Update user password         | All Roles   |

### **Artists**
| Method | Endpoint               | Description                   | Roles       |
|--------|-------------------------|-------------------------------|-------------|
| GET    | `/artists`             | Get all artists               | Viewer+     |
| GET    | `/artists/:id`         | Get artist by ID              | Viewer+     |
| POST   | `/artists/add-artist`  | Add a new artist              | Editor+     |
| PUT    | `/artists/:id`         | Update an artist              | Editor+     |
| DELETE | `/artists/:id`         | Delete an artist              | Editor+     |

### **Albums**
| Method | Endpoint               | Description                   | Roles       |
|--------|-------------------------|-------------------------------|-------------|
| GET    | `/albums`              | Get all albums                | Viewer+     |
| GET    | `/albums/:id`          | Get album by ID               | Viewer+     |
| POST   | `/albums/add-album`    | Add a new album               | Editor+     |
| PUT    | `/albums/:id`          | Update an album               | Editor+     |
| DELETE | `/albums/:id`          | Delete an album               | Editor+     |

### **Tracks**
| Method | Endpoint               | Description                   | Roles       |
|--------|-------------------------|-------------------------------|-------------|
| GET    | `/tracks`              | Get all tracks                | Viewer+     |
| GET    | `/tracks/:id`          | Get track by ID               | Viewer+     |
| POST   | `/tracks/add-track`    | Add a new track               | Editor+     |
| PUT    | `/tracks/:id`          | Update a track                | Editor+     |
| DELETE | `/tracks/:id`          | Delete a track                | Editor+     |

### **Favorites**
| Method | Endpoint                        | Description                     | Roles       |
|--------|----------------------------------|---------------------------------|-------------|
| GET    | `/favorites/:category`          | Get all favorites by category   | Logged-In   |
| POST   | `/favorites/add-favorite`       | Add a new favorite              | Logged-In   |
| DELETE | `/favorites/remove-favorite/:id`| Remove a favorite               | Logged-In   |

---

## **Contribution**

Contributions are welcome! Feel free to:
- Fork the repository
- Create a branch for your feature
- Submit a pull request with detailed changes

---

## **License**

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

---

## **Contact**

For any queries or feedback, feel free to reach out:
- **Email**: [chetan.amritanshu@gmail.com](mailto:chetan.amritanshu@gmail.com)
- **GitHub**: [trojan1771](https://github.com/trojan1771)

---
