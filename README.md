# Moodpin 🧠📌

*A Pinterest-inspired web application to pin your moods visually.*

## 🌟 Overview

**Moodpin** is a full-stack web application inspired by Pinterest, allowing users to upload, save, and explore images or "mood pins." Users can create collections, follow others, and curate a personalized board of aesthetic, emotional, or inspirational content.

This project was built with the MERN stack (MongoDB, Express, React, Node.js), incorporating secure authentication and cloud image storage.

---

## 🔧 Tech Stack

### 🖥️ Frontend
- React.js
- @tanstack/react-query
- Axios
- Tailwind CSS

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- ImageKit + sharp (image optimization and CDN)
- express-fileupload

---

## 🚀 Features

- 🔐 **User Authentication** (Sign up, Login, Logout)
- 📌 **Upload & Pin Images**
- 📁 **Create & Manage Boards**
- ❤️ **Like & Save Pins**
- 🔎 **Search Pins**
- 👤 **Follow Users**
- 📷 **Image Optimization & Cloud Upload** (ImageKit)
- 🌐 **Responsive Design**

---

## 📁 Project Structure

```
moodpin/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── index.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── App.js
│   │   └── index.js
│   └── public/
│
└── README.md
```

---

## ⚙️ Getting Started

### 🔌 Prerequisites

- Node.js and npm
- MongoDB (local or MongoDB Atlas)
- ImageKit account (for cloud image uploads)

### 🔧 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/SivasankariM24/moodpin.git
cd moodpin
```

#### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

Start backend:

```bash
npm run dev
```

#### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

---


## 🌐 Deployment

You can deploy this on:

- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway / Cyclic
- **Database**: MongoDB Atlas
- **CDN**: ImageKit

---


## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🙌 Acknowledgements

- [Pinterest](https://pinterest.com) (for the core idea)
- [TanStack React Query](https://tanstack.com/query) (for smooth data fetching)
- [ImageKit](https://imagekit.io) (for cloud image upload & CDN)
- [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


<div align="center">
  <strong>⭐ Star this repo if you found it helpful! ⭐</strong>
</div>
