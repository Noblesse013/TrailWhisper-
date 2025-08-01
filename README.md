# TrailWhisper - Travel Story Application

A full-stack travel journaling application where users can document their adventures, upload photos, and share their travel stories.

## Architecture

- **Backend**: Node.js + Express + MongoDB + Cloudinary (for image storage)
- **Frontend**: React + TypeScript + Vite + Tailwind CSS

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   connectionString=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /create-account` - Register a new user
- `POST /login` - Login user
- `GET /get-user` - Get user profile (requires authentication)

### Travel Stories
- `POST /add-travel-story` - Create a new travel story
- `GET /get-all-stories` - Get all user's stories
- `PUT /edit-story/:id` - Update a travel story
- `DELETE /delete-story/:id` - Delete a travel story
- `PUT /update-is-favourite/:id` - Toggle favorite status
- `GET /search` - Search stories by query
- `GET /travel-stories/filter` - Filter stories by date range

### Image Upload
- `POST /image-upload` - Upload image to Cloudinary
- `DELETE /delete-image` - Delete image from Cloudinary

## Features

- User authentication and registration
- Create, read, update, delete travel stories
- Image upload and management via Cloudinary
- Search and filter travel stories
- Responsive design
- Protected routes
- JWT-based authentication

## Development

The project uses:
- TypeScript for type safety
- Tailwind CSS for styling
- Context API for state management
- React Router for navigation
- Lucide React for icons

## Environment Variables

Make sure to set up the following environment variables:

**Backend (.env):**
- `connectionString` - MongoDB connection string
- `ACCESS_TOKEN_SECRET` - JWT secret key
- `CLOUDINARY_*` - Cloudinary configuration
- `PORT` - Server port (default: 5000)

**Frontend (.env):**
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:5000)
