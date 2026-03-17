# UniVerse GEU 🎓
**Campus Event & Access Management System**
Team ByteForge · FS-VI-T154 · Graphic Era University, Dehradun

---

## 👥 Team
| Name | Roll No | Role |
|------|---------|------|
| Dhruv Rawat | 230211487 | Team Lead |
| Ayush Gupta | 23021152 | Developer |
| Sujal Verma | 230213768 | Developer |
| Sachin Rawat | 230211078 | Developer |

---

## 🚀 Quickstart

### Requirements
- Node.js 18+ → https://nodejs.org
- MongoDB → https://www.mongodb.com/try/download/community

### Run (Windows)
```
Double-click run.bat
```
That's it. It installs, seeds, and opens both servers automatically.

### Run (Manual)
```bash
# Terminal 1 — Backend
cd server
npm install
copy .env.example .env
npm run seed
npm run dev

# Terminal 2 — Frontend
cd client
npm install
npm start
```

Open http://localhost:3000

---

## 🔐 Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@geu.ac.in | admin123 |
| Organizer | sharma@geu.ac.in | organizer123 |
| Student | dhruv@geu.ac.in | student123 |

---

## 🏗️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (role-based: student / organizer / admin) |
| QR | qrcode (gen) + html5-qrcode (scan) |
| Email | Nodemailer |
| PDF | PDFKit |

---

## 📦 Structure
```
universe-geu/
├── server/
│   ├── config/        db.js, seed.js
│   ├── models/        User, Event, Registration, Certificate, Feedback, EntryLog
│   ├── controllers/   auth, event, attendance, analytics
│   ├── routes/        auth, events, attendance, certificates, feedback, analytics, users
│   ├── middlewares/   auth (JWT + RBAC)
│   └── utils/         certificateGenerator (PDFKit), mailer (Nodemailer)
├── client/
│   └── src/
│       ├── pages/     Home, Login, Register, Events, EventDetail, Dashboard,
│       │              Profile, Certificates, ScanQR, CreateEvent, Analytics,
│       │              EntryLogs, VerifyCert
│       ├── components/ Navbar, Footer
│       ├── context/   AuthContext
│       └── api/       Axios instance + all API calls
├── run.bat            One-click launcher
└── README.md
```

---

## 🛣️ Key API Endpoints
```
POST /api/auth/login
POST /api/auth/register
GET  /api/events
POST /api/events/:id/register       → returns QR code
POST /api/attendance/scan           → marks attendance
POST /api/attendance/certificates/:eventId  → bulk issue PDFs
GET  /api/certificates/my           → student's certificates
GET  /api/certificates/check/:eventId       → cert status for event
GET  /api/certificates/verify/:certId       → public verification
GET  /api/analytics/dashboard
GET  /api/analytics/event/:id
```

---

## 🔒 Role Access
| Feature | Student | Organizer | Admin |
|---------|---------|-----------|-------|
| Browse events | ✅ | ✅ | ✅ |
| Register + get QR | ✅ | ❌ | ❌ |
| Scan QR / mark attendance | ❌ | ✅ | ✅ |
| Create events | ❌ | ✅ | ✅ |
| Issue certificates | ❌ | ✅ | ✅ |
| View analytics | ❌ | ✅ | ✅ |
| Submit feedback | ✅ | ❌ | ❌ |
| Check cert status | ✅ | ❌ | ❌ |

---

Graphic Era (Deemed to be University) · NAAC A+ · NIRF Top 50 · geu.ac.in
