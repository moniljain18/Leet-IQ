# 🚀 LeetIQ - AI-Powered Coding Interview Platform

LeetIQ is a modern, full-stack coding interview preparation platform that combines LeetCode-style problem solving with AI assistance, real-time collaboration, and comprehensive analytics.

## ✨ Key Features

- **🎯 Problem Solving**: Extensive library of coding problems with multiple difficulty levels
- **🤖 AI Hints**: Intelligent hints powered by Google's Gemini AI (3 hints per problem for premium users)
- **⚡ Real-time Execution**: Run and test code with instant feedback using Docker containers
- **🌐 Multi-language Support**: JavaScript, Python, Java, C++, and more
- **🏢 Company Tags**: Filter problems by top tech companies (Google, Meta, Amazon, etc.)
- **👥 Live Sessions**: Real-time collaborative coding with friends
- **🏆 Contests**: Create and participate in timed coding contests
- **📊 Analytics**: Comprehensive dashboard tracking your progress
- **🔒 Proctoring**: AI-powered cheating detection for contests
- **💎 Premium Features**: Unlimited access, video solutions, advanced analytics

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS + DaisyUI
- Clerk (Authentication)
- Monaco Editor
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Docker (Code execution)
- Google Gemini API
- Clerk webhooks

## 📋 Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Docker
- Clerk account
- Google AI API key

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd "Leet iq"
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leetiq
CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
GEMINI_API_KEY=your_google_ai_key
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_CLERK_PLAN_ID=your_plan_id
VITE_PREMIUM_MONTHLY_PRICE=14.92
VITE_PREMIUM_YEARLY_PRICE=99.99
```

### 3. Run Development Servers

From project root:
```bash
npm run dev
```

Or separately:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

Access at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
Leet iq/
├── frontend/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── api/          # API clients
│   │   └── lib/          # Utilities
│   └── public/
├── backend/
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Middleware
│   │   └── lib/          # Utilities
│   └── server.js
└── README.md
```

## 🎮 Usage

1. **Sign Up**: Create account via Clerk
2. **Browse Problems**: Explore problem library
3. **Start Coding**: Select and solve problems
4. **Get Hints**: Use AI hints when stuck (premium)
5. **Submit**: Test and submit solutions
6. **Track Progress**: Monitor stats on dashboard

## 🔧 Configuration

### Clerk Setup
1. Create app at [clerk.com](https://clerk.com)
2. Enable email/password + OAuth
3. Set up webhooks
4. Configure billing plans (optional)

### Google AI Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `backend/.env`

### Docker Setup
Ensure Docker is running:
```bash
docker --version
```

## 🔒 Security

- Input validation & sanitization
- Rate limiting
- Docker-isolated code execution
- AI-based proctoring
- Automated moderation

## 📝 License

MIT License

## 🙏 Acknowledgments

- Monaco Editor
- Google Gemini
- Clerk
- Docker
- Open-source community

---

Built with ❤️ by the LeetIQ Team
