# AKRDevi PU College Backend API

Complete Node.js + Express.js backend for AKRDevi PU College website.

## Features

- ✅ User Authentication (JWT-based)
- ✅ Event Management
- ✅ Results Management
- ✅ Gallery with Image Uploads (Cloudinary)
- ✅ Faculty Management
- ✅ Toppers Management
- ✅ Announcements
- ✅ Admission Enquiries
- ✅ College History/Milestones
- ✅ Input Validation
- ✅ Error Handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary Account (for image uploads)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/akrdevi-college
JWT_SECRET=your_jwt_secret_key_change_this_in_production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

3. Seed the database with default admin user:
```bash
npm run seed
```
Default admin credentials:
- Email: `admin@akrdevi.college`
- Password: `admin123`

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin user
- `POST /api/auth/register` - Register new admin (protected)
- `GET /api/auth/me` - Get current admin (protected)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Results
- `GET /api/results` - Get all results (filter by year/stream)
- `POST /api/results` - Create result (admin only)
- `PUT /api/results/:id` - Update result (admin only)
- `DELETE /api/results/:id` - Delete result (admin only)

### Gallery
- `GET /api/gallery` - Get all gallery items (filter by category/year)
- `POST /api/gallery` - Upload image (admin only)
- `DELETE /api/gallery/:id` - Delete image (admin only)

### Toppers
- `GET /api/toppers` - Get all toppers (filter by year/stream)
- `POST /api/toppers` - Create topper (admin only)
- `PUT /api/toppers/:id` - Update topper (admin only)
- `DELETE /api/toppers/:id` - Delete topper (admin only)

### Faculty
- `GET /api/faculty` - Get all faculty (filter by department)
- `POST /api/faculty` - Create faculty (admin only)
- `PUT /api/faculty/:id` - Update faculty (admin only)
- `DELETE /api/faculty/:id` - Delete faculty (admin only)

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (admin only)
- `PUT /api/announcements/:id` - Update announcement (admin only)
- `DELETE /api/announcements/:id` - Delete announcement (admin only)

### Admissions
- `POST /api/admissions` - Submit admission enquiry (public)
- `GET /api/admissions` - Get all enquiries (admin only)
- `PUT /api/admissions/:id` - Update enquiry status (admin only)

### History
- `GET /api/history` - Get all history milestones
- `POST /api/history` - Create milestone (admin only)
- `PUT /api/history/:id` - Update milestone (admin only)
- `DELETE /api/history/:id` - Delete milestone (admin only)

## Response Format

All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {}
}
```

## Environment Setup

### MongoDB
Install MongoDB Community Edition or use MongoDB Atlas:
- Local: `mongodb://localhost:27017/akrdevi-college`
- Atlas: Your connection string

### Cloudinary
1. Sign up at https://cloudinary.com
2. Get your Cloud Name, API Key, and API Secret from your dashboard
3. Add to `.env` file

## Project Structure

```
backend/
├── config/
│   ├── db.js                (MongoDB connection)
│   └── cloudinary.js        (Cloudinary config)
├── models/                  (Database schemas)
├── controllers/             (Business logic)
├── routes/                  (API routes)
├── middleware/              (Auth, Upload)
├── scripts/
│   └── seed.js             (Database seeding)
├── server.js               (Main server file)
├── package.json
├── .env
└── .gitignore
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload
- **Cloudinary** - Image storage
- **express-validator** - Input validation
- **CORS** - Cross-origin requests

## License

ISC
