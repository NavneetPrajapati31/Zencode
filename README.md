# Zencode

A comprehensive full-stack Online Judge system for coding practice and competitive programming. Zencode provides a distraction-free coding environment with real-time code compilation, secure execution, and comprehensive user management features.

![Zencode UI Screenshot](https://github.com/NavneetPrajapati31/Zencode/blob/main/images/Screenshot%202025-07-26%20152236.png)

## 🚀 Project Overview

Zencode is a modern online judge platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to:

- **Practice Coding**: Solve problems with real-time code compilation and execution
- **Track Progress**: Monitor solved problems and coding statistics
- **Compete**: Participate in coding competitions with leaderboards
- **Learn**: Access a curated collection of programming problems
- **Collaborate**: Share profiles and connect with other developers

## 📁 Project Structure

```
Zencode/
├── backend/                 # Node.js/Express API server
│   ├── config/             # Database configuration
│   ├── controllers/        # API route handlers
│   ├── middleware/         # Authentication & validation middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── scripts/           # Database scripts & utilities
│   └── index.js           # Main server file
├── compiler/              # Code execution engine
│   ├── runners/           # Language-specific execution scripts
│   ├── generateFile.js    # File generation utilities
│   └── index.js           # Compiler server
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── lib/           # Third-party library configurations
│   └── public/            # Static assets
└── keys/                  # SSL certificates & keys
```

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens, bcrypt for password hashing
- **OAuth**: Google and GitHub authentication
- **Email**: Nodemailer for email verification
- **File Upload**: UploadThing for file management
- **Validation**: Express-validator for input validation

### Compiler Engine

- **Runtime**: Node.js with child_process
- **Languages**: C++, C, Java, Python, JavaScript
- **Security**: Sandboxed execution environment
- **AI Integration**: Google GenAI for code analysis

### Frontend

- **Framework**: React 19 with Vite
- **Routing**: React Router DOM
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI primitives with custom components
- **Code Editor**: Monaco Editor integration
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Charts**: Recharts for data visualization

## 🎯 Core Features

### 🔐 Authentication & User Management

- **Multi-provider Authentication**: Email/password, Google OAuth, GitHub OAuth
- **Email Verification**: Secure email verification with OTP
- **Password Reset**: Forgot password functionality with email reset
- **Profile Management**: Complete user profiles with social links
- **Role-based Access**: User and admin roles with protected routes

### 💻 Code Execution & Problem Solving

- **Multi-language Support**: C++, C, Java, Python, JavaScript
- **Real-time Compilation**: Instant code compilation and execution
- **Secure Execution**: Sandboxed environment for safe code execution
- **Test Case Validation**: Automated test case checking
- **Code Editor**: Advanced Monaco editor with syntax highlighting
- **AI Code Analysis**: Google GenAI integration for code insights

### 📊 Problem Management

- **Problem Categories**: Easy, Medium, Hard difficulty levels
- **Rich Problem Descriptions**: Markdown support with code examples
- **Test Cases**: Multiple test cases per problem
- **Boilerplate Code**: Language-specific starter code
- **Problem Statistics**: Success rates and submission counts

### 🏆 Competition & Progress Tracking

- **Leaderboard**: Global and problem-specific rankings
- **Progress Tracking**: Solved problems and statistics
- **Profile Heatmaps**: GitHub-style activity visualization
- **Achievement System**: Badges and milestones
- **Social Features**: Public profiles and social connections

### 🎨 Modern UI/UX

- **Responsive Design**: Mobile-first responsive layout
- **Dark/Light Theme**: Theme switching with smooth transitions
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance**: Optimized with code splitting and lazy loading
- **Animations**: Smooth micro-interactions and transitions

## 🔄 Application Flow

### User Journey

1. **Landing Page**: Users discover the platform and its features
2. **Authentication**: Sign up/sign in with multiple options
3. **Problem Discovery**: Browse problems by difficulty and category
4. **Code Solving**: Write, compile, and submit solutions
5. **Progress Tracking**: Monitor solved problems and statistics
6. **Social Features**: Share profiles and connect with others

### Technical Flow

1. **Frontend**: React app serves the user interface
2. **Backend API**: Express.js handles business logic and data
3. **Database**: MongoDB stores users, problems, and submissions
4. **Compiler**: Separate service handles code execution
5. **File Storage**: UploadThing manages file uploads
6. **Email Service**: Nodemailer sends verification emails

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Zencode
   ```

2. **Install dependencies**

   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   Create `.env` files in `backend/` and `compiler/` directories:

   ```env
   # Backend .env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   GITHUB_CLIENT_ID=your_github_oauth_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the services**

   ```bash
   # Start all services concurrently
   npm run dev

   # Or start individually:
   npm run server    # Backend API
   npm run client    # Frontend
   # Start compiler service separately
   cd compiler && npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Compiler: http://localhost:8000

## 📚 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Problems

- `GET /api/problems` - List all problems
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems` - Create new problem (admin)
- `PUT /api/problems/:id` - Update problem (admin)
- `DELETE /api/problems/:id` - Delete problem (admin)

### Submissions

- `POST /api/submission` - Submit solution
- `GET /api/submission/user/:userId` - Get user submissions
- `GET /api/submission/problem/:problemId` - Get problem submissions

### Profile

- `GET /api/profile/:username` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/progress/:userId` - Get user progress

### Leaderboard

- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/problem/:problemId` - Get problem leaderboard

## 🔧 Development Scripts

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Build for production
npm run build

# Database scripts
npm run import-problems          # Import sample problems
npm run check-mongodb           # Check database connection
npm run test-auth               # Test authentication flow
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Express-validator for request validation
- **CORS Protection**: Configured CORS for cross-origin requests
- **Rate Limiting**: API rate limiting for abuse prevention
- **Sandboxed Execution**: Secure code execution environment
- **Email Verification**: Required email verification for new accounts

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Theme System**: Dark/light mode with smooth transitions
- **Accessibility**: WCAG 2.1 AA compliant
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: User-friendly error messages
- **Animations**: Smooth micro-interactions
- **Keyboard Navigation**: Full keyboard accessibility

## 📈 Performance Optimizations

- **Code Splitting**: Lazy-loaded components and routes
- **Image Optimization**: Optimized images and lazy loading
- **Caching**: API response caching and browser caching
- **Bundle Optimization**: Tree shaking and minification
- **Database Indexing**: Optimized MongoDB queries
- **CDN Integration**: Static asset delivery optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [TailwindCSS](https://tailwindcss.com/) for the styling framework
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Framer Motion](https://www.framer.com/motion/) for animations
- [UploadThing](https://uploadthing.com/) for file uploads

---

**Zencode** - Where Code Meets Focus 🚀
