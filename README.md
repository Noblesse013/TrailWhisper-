# TrailWhisper – CSE470 Project

A full-stack MERN travel journaling platform that empowers users to document their adventures, upload images, and create personal travel story collections.

---

## 🌟 Features

### Core Functionality
1. **Landing Page** – Engaging and user-friendly entry point.
2. **Create and Save Travel Stories** – Easily document and save your adventures in your personal collection.
3. **Upload Images per Story** – Add multiple photos to enhance your stories.
4. **Preview Entries with a "Read More" Option** – Quick glimpse before diving into full stories.
5. **Image Carousel in Story View** – Smooth browsing through story images.
6. **Upload Profile Picture During Registration** – Personalize your account from the start.

### Advanced Features
7. **Whispy AI Chatbot** – Intelligent travel assistant powered by AI to help plan trips, answer travel questions, and provide recommendations.
8. **Wishlist Management** – Create and manage your travel bucket list with destinations you want to visit.
9. **Favorite Stories** – Save and organize your favorite travel stories for easy access.
10. **Search Functionality** – Find stories, destinations, or content quickly with the integrated search bar.
11. **Location Tags** – Tag your travel stories with specific locations, cities, countries, or landmarks for better organization and discovery.
12. **Delete Travel Stories** – Full control over your content with the ability to remove stories you no longer want to keep.
13. **Admin Dashboard** – Administrative interface for managing users and content.

---

## 🎯 User Experience

### For Travel Enthusiasts
- **Document Your Journey**: Create detailed travel stories with photos and descriptions
- **Organize Your Adventures**: Use favorites and wishlist features to keep track of your travel goals
- **Location-Based Organization**: Tag stories with specific locations for easy filtering and discovery
- **Get AI Assistance**: Chat with Whispy for travel tips, recommendations, and trip planning
- **Search & Discover**: Find specific stories or explore content through the search functionality

### For Content Management
- **Full Control**: Edit, delete, or manage your travel stories as needed
- **Profile Customization**: Upload profile pictures and personalize your account
- **Story Organization**: Categorize stories with favorites and maintain a wishlist of destinations

---

## 🛠 Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS
**Backend:** Node.js, Express.js, MongoDB, Cloudinary


---

## 🚀 Getting Started

### Prerequisites

* Node.js v16 or later
* MongoDB 
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

