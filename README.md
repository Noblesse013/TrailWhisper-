# TrailWhisper – Travel Story Application

A full-stack MERN travel journaling platform that empowers users to document their adventures, upload images, and share unforgettable travel stories.

---

## 🌟 Features

1. **Landing Page** – Engaging and user-friendly entry point.
2. **Create and Publish Travel Stories** – Easily document and share your adventures.
3. **Upload Images per Story** – Add multiple photos to enhance your stories.
4. **Preview Entries with a “Read More” Option** – Quick glimpse before diving into full stories.
5. **Image Carousel in Story View** – Smooth browsing through story images.
6. **Upload Profile Picture During Registration** – Personalize your account from the start.

---

## 🛠 Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Context API, React Router, Lucide React
**Backend:** Node.js, Express.js, MongoDB, Cloudinary
**Hosting:** Vercel (Frontend) & Your preferred backend hosting provider

---

## 🚀 Getting Started

### Prerequisites

* Node.js v16 or later
* MongoDB (local or Atlas)
* Cloudinary account

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```
connectionString=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

Start backend:

```bash
npm start
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file inside the `frontend` folder:

```
VITE_API_BASE_URL=http://localhost:5000
```

---



---

