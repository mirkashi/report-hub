# ReportHub - Weekly Work Report Management System

A professional, skeuomorphic UI/UX design for a weekly work report submission website. Built with React and ready for MERN stack implementation.

## 🎨 Design Philosophy

This project implements a **fully skeuomorphic design** with:
- **Realistic Textures**: Leather, brushed metal, polished wood, paper, and glass reflections
- **Depth & Shadows**: Realistic shadows, inner/outer bevels, layered panels, and subtle embossing
- **Tactile Controls**: 3D pressable buttons with realistic hover/press animations
- **Professional Color Palette**: Warm, professional tones with metallic and earthy textures
- **Elegant Typography**: Readable fonts with subtle embossed effects

## 📱 Features

### Employee Panel
- **Registration & Login**: Embossed input fields with realistic textures and shadowed buttons
- **Daily Task Input**: Interactive cards with paper-like texture, realistic checkboxes, and file attachment buttons
- **Weekly Submission**: Large 3D submit button with embossed effect and realistic animations
- **Dashboard Overview**: Skeuomorphic panels showing tasks with realistic shadows and depth

### Admin Panel
- **Dashboard**: High-detail skeuomorphic tables with buttons, sliders, and tabs
- **Reports Management**: Interactive cards/panels for submitted reports with file thumbnails
- **Announcements**: Rich-text message area styled like a real memo board/noticeboard

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Next-GenDeveloper/report-hub.git
cd report-hub
```

2. Install dependencies:
```bash
cd client
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔐 Demo Credentials

- **Employee Panel**: Use any email (e.g., `john@example.com`)
- **Admin Panel**: Use an email containing "admin" (e.g., `admin@example.com`)

## 📂 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin-specific components
│   │   ├── employee/       # Employee-specific components
│   │   └── shared/         # Shared components (Sidebar, etc.)
│   ├── pages/
│   │   ├── admin/          # Admin panel pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Announcements.jsx
│   │   ├── employee/       # Employee panel pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DailyTaskInput.jsx
│   │   │   └── WeeklySubmission.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── styles/
│   │   └── skeuomorphic.css  # Complete skeuomorphic design system
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
└── package.json
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

- **Frontend**: React 19 with Vite
- **Routing**: React Router v7
- **Styling**: Custom CSS with skeuomorphic design system
- **Ready for**: MERN stack backend integration

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
