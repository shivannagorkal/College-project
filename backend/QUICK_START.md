# Quick Start Guide

## Step 1: Install Dependencies
```bash
cd backend
npm install
```

## Step 2: Configure Environment Variables
Create a `.env` file in the backend directory with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/akrdevi-college
JWT_SECRET=your_jwt_secret_key_change_this_in_production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

## Step 3: Setup MongoDB
- **Option A - Local MongoDB:**
  - Install MongoDB Community Edition
  - Start MongoDB service
  - Database will be created automatically

- **Option B - MongoDB Atlas (Cloud):**
  - Create account at https://mongodb.com/cloud/atlas
  - Create cluster and get connection string
  - Update MONGODB_URI in .env

## Step 4: Setup Cloudinary (Optional for image uploads)
- Sign up at https://cloudinary.com
- Go to Dashboard and copy:
  - Cloud Name
  - API Key
  - API Secret
- Update these in .env

## Step 5: Seed Default Admin User
```bash
npm run seed
```
This creates a default admin user:
- Email: admin@akrdevi.college
- Password: admin123

## Step 6: Start the Server
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

## Step 7: Test the API
Health check:
```bash
curl http://localhost:5000/api/health
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@akrdevi.college",
    "password": "admin123"
  }'
```

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGODB_URI in .env is correct
- Try connecting with MongoDB Compass to verify

### Cloudinary Upload Error
- Verify Cloudinary credentials are correct
- Make sure upload middleware has permission

### CORS Errors
- Frontend must be on http://localhost:5173
- Backend CORS is configured to allow this URL

## API Testing Tools
- Postman: https://www.postman.com/
- Insomnia: https://insomnia.rest/
- Thunder Client (VS Code Extension)

## Next Steps
1. Connect frontend to this API
2. Update JWT_SECRET for production
3. Add rate limiting
4. Setup error logging
5. Add email notifications for admissions

## Support
Refer to README.md for detailed API documentation
