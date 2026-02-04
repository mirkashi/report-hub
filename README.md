# ReportHub - Weekly Work Report Management System

A professional, full-stack MERN application for weekly work report submission with a skeuomorphic UI/UX design. Features employee task management and admin oversight capabilities.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/report-hub)

## 🎨 Design Philosophy

This project implements a **fully skeuomorphic design** with:
- **Realistic Textures**: Leather, brushed metal, polished wood, paper, and glass reflections
- **Depth & Shadows**: Realistic shadows, inner/outer bevels, layered panels, and subtle embossing
- **Tactile Controls**: 3D pressable buttons with realistic hover/press animations
- **Professional Color Palette**: Warm, professional tones with metallic and earthy textures
- **Elegant Typography**: Readable fonts with subtle embossed effects

## 📱 Features

### Employee Panel
- **Registration & Login**: Secure JWT-based authentication with embossed input fields
- **Daily Task Input**: Interactive cards with paper-like texture, realistic checkboxes, and file attachments
- **Weekly Submission**: Report submission with 3D submit button and realistic animations
- **Dashboard Overview**: Skeuomorphic panels showing tasks with realistic shadows and depth
- **Draft Reports**: Save and edit reports before submission
- **Notifications**: Real-time updates for announcements and report status

### Admin Panel
- **Dashboard**: High-detail skeuomorphic tables with comprehensive employee metrics
- **Reports Management**: Review, approve, or reject submitted reports with detailed filtering
- **Employee Management**: Add, edit, and manage employee accounts
- **Announcements**: Broadcast messages to all employees with priority levels
- **Analytics**: Track submission rates, performance metrics, and trends

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/report-hub)

**Quick Start:**
1. Click the "Deploy to Vercel" button above
2. Follow the setup instructions in [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. Set up environment variables (see guide below)

**Detailed Guide:** See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

### Required Environment Variables

**Server (.env):**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Client (.env.production):**
```env
VITE_API_URL=https://your-app.vercel.app/api
```

## 🔧 Local Development

### Prerequisites
- Node.js (v18 or higher)
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/report-hub.git
cd report-hub
```

2. **Install all dependencies:**
```bash
npm run install-all
```

Or install separately:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Set up environment variables:**

**Server** - Create `server/.env`:
```bash
cp server/.env.example server/.env
# Edit server/.env with your values
```

**Client** - Already configured for development at `client/.env.development`

4. **Start MongoDB** (if running locally)

5. **Run the application:**
```bash
# From root directory - runs both server and client
npm run dev

# Or run separately:
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

6. **Access the application:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

## 🔐 Authentication

### Default Admin Account
Create an admin account by registering with an email containing "admin":
- Email: `admin@company.com` (or any email with "admin")
- Password: Your choice (minimum 8 characters)

### Employee Account
Register with any other email:
- Email: `john.doe@company.com`
- Password: Your choice (minimum 8 characters)

## 📂 Project Structure

```
report-hub/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Notification.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── shared/        # Sidebar, Footer
│   │   ├── pages/
│   │   │   ├── admin/         # Admin panel pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   ├── Employees.jsx
│   │   │   │   ├── Announcements.jsx
│   │   │   │   └── Settings.jsx
│   │   │   ├── employee/      # Employee panel pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── DailyTaskInput.jsx
│   │   │   │   ├── WeeklySubmission.jsx
│   │   │   │   ├── DraftReports.jsx
│   │   │   │   ├── SubmittedReports.jsx
│   │   │   │   └── Settings.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/          # API services
│   │   │   └── api.js
│   │   ├── styles/            # Global styles
│   │   │   ├── skeuomorphic.css
│   │   │   └── notification.css
│   │   ├── config/            # Configuration
│   │   │   └── api.config.js
│   │   └── main.jsx
│   ├── .env.development       # Dev environment vars
│   ├── .env.production        # Prod environment vars
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── reportController.js
│   │   ├── announcementController.js
│   │   └── notificationController.js
│   ├── models/                # Mongoose models
│   │   ├── User.js
│   │   ├── Report.js
│   │   ├── Announcement.js
│   │   └── Notification.js
│   ├── routes/                # API routes
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/                 # Utility functions
│   ├── .env.example           # Environment template
│   ├── server.js              # Entry point
│   └── package.json
│
├── vercel.json                # Vercel configuration
├── .vercelignore              # Vercel ignore file
├── .gitignore                 # Git ignore file
├── DEPLOYMENT_CHECKLIST.md    # Quick deploy guide
├── VERCEL_DEPLOYMENT_GUIDE.md # Detailed deploy guide
├── package.json               # Root package.json
└── README.md                  # This file
```

## 🎯 Screens Included

1. **Login Page** - Professional skeuomorphic login with embossed inputs
2. **Registration Page** - Multi-field registration form with tactile controls
3. **Employee Dashboard** - Weekly overview with stats, tasks, and announcements
4. **Daily Task Input** - Task management with checkboxes and file attachments
5. **Weekly Submission** - Report review and submission with 3D submit button
6. **Admin Dashboard** - Overview with department stats and top performers
7. **Admin Reports** - Report review and approval workflow
8. **Admin Announcements** - Memo board style announcement management

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Styling**: Custom CSS with skeuomorphic design system

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS, rate limiting, mongo-sanitize

### DevOps
- **Deployment**: Vercel
- **Database Hosting**: MongoDB Atlas (recommended)
- **Version Control**: Git

## 🔒 Security Features

- JWT-based authentication with secure HTTP-only cookies
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Helmet security headers
- MongoDB injection protection
- XSS protection

## 📸 Design Elements

### Textures
- Leather panels with grain texture
- Brushed metal surfaces
- Paper-like cards with subtle noise
- Glass panels with reflections

### Interactive Elements
- 3D buttons with press animations
- Embossed input fields
- Realistic checkboxes
- File attachment clips
- Progress bars with glow effects

### Color Palette
- Gold accents: `#d4a017`, `#b7860b`
- Leather browns: `#3d2b1f`, `#5c4033`
- Metal grays: `#4a5568`, `#718096`
- Paper cream: `#f5f0e6`, `#faf8f2`
- Success green: `#38a169`
- Warning amber: `#ecc94b`
- Danger red: `#e53e3e`

## 📱 Responsive Design

The design is fully responsive and maintains skeuomorphic depth across:
- Desktop (1280px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Reports
- `GET /api/reports` - Get all reports (admin) or user reports
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `PATCH /api/reports/:id/status` - Update report status (admin)

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (admin)
- `PUT /api/announcements/:id` - Update announcement (admin)
- `DELETE /api/announcements/:id` - Delete announcement (admin)

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read

## 🐛 Troubleshooting

### Common Issues

**Cannot connect to MongoDB:**
- Verify your `MONGODB_URI` in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure MongoDB service is running (if local)

**CORS errors:**
- Verify `CLIENT_URL` matches your frontend URL
- Check that credentials are included in API requests

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill
```

**Build fails on Vercel:**
- Check build logs
- Verify all dependencies are in `package.json`
- Ensure Node version compatibility

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@reporthub.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Skeuomorphic design inspired by classic iOS interfaces
- Built with modern web technologies
- Deployed on Vercel's edge network

---

Made with ❤️ for better workplace reporting
