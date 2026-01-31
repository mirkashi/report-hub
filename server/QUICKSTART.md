# Report Hub Backend - Quick Start Guide

## Prerequisites

Before running the backend, ensure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** installed and running locally
   - Windows: [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud): [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Quick Start (3 Steps)

### 1. Install Dependencies (Already Done!)
```bash
cd server
npm install
```

### 2. Start MongoDB

**Option A: Local MongoDB**
```bash
# If MongoDB is installed locally, start it:
mongod

# Or if using MongoDB as a Windows service:
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Update `MONGODB_URI` in `.env` file

### 3. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

The server will start on: **http://localhost:5000**

## Test the API

### Check if server is running:
```bash
curl http://localhost:5000/api/health
```

Or open in browser: `http://localhost:5000/api/health`

### Create your first admin user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "department": "Management",
    "position": "Administrator"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Copy the `token` from the response and use it for authenticated requests.

## Set User as Admin (MongoDB Compass or CLI)

After creating your first user, you'll want to make them an admin:

**Using MongoDB Compass (GUI):**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Navigate to `report-hub` database → `users` collection
4. Find your user and edit the document
5. Change `role` field from `"employee"` to `"admin"`
6. Save

**Using MongoDB Shell:**
```bash
mongosh
use report-hub
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Next Steps

1. **Connect Frontend**: Update your React app to use `http://localhost:5000/api`
2. **Test APIs**: Use Postman, Thunder Client, or the examples in README.md
3. **Customize**: Modify models, add new endpoints as needed

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or `net start MongoDB`
- Check MongoDB URI in `.env` file
- Try connecting to MongoDB using MongoDB Compass

### Port Already in Use
- Change `PORT` in `.env` to a different number (e.g., 5001)
- Or kill the process using port 5000

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

⚠️ **Important**: Before deploying to production:

1. Change JWT secrets to strong, random values
2. Set `NODE_ENV=production`
3. Use a production MongoDB instance (MongoDB Atlas recommended)
4. Enable HTTPS
5. Set up proper environment variables
6. Review security settings

## Support

- Check [README.md](README.md) for full API documentation
- Review code comments for implementation details
