# 🌍 Xplora - Experience & Product Discovery Platform

A full-stack web application for sharing and discovering authentic experiences and product reviews. Connect with others, find recommendations, and build a community around shared interests.

## ✨ Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Experience Sharing**: Share detailed experiences with images, ratings, and locations
- **Product Reviews**: Post comprehensive product reviews with pros/cons analysis
- **Social Features**: Follow users and categories to stay updated
- **Notifications**: Real-time notifications for new experiences and products from followed users
- **Category System**: Browse and filter content by 20+ predefined categories
- **User Profiles**: Personalized profiles with avatars and user information
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework with hooks
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL 8.0+** - Relational database
- **JWT (JSON Web Tokens)** - Authentication
- **bcryptjs** - Password hashing

### Database
- **MySQL** - With 8 core tables for users, experiences, products, categories, notifications, and follows

## 📋 Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [MySQL Server](https://www.mysql.com/downloads/mysql/)
- [MySQL Workbench](https://www.mysql.com/products/workbench/) (optional but recommended)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Talking-Brothers-main
```

### 2. Set Up the Database

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Open `server/sql/xplora_schema.sql`
4. Execute the script

This will create:
- `xplora_db` database
- All required tables with proper relationships
- 20 default categories (City, Cinema, Theatre, Workshop, etc.)

### 3. Configure Environment Variables

#### Backend Configuration

1. Navigate to the `server` folder
2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Edit `.env` with your local values:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=xplora_db
DB_PORT=3306

# JWT Configuration (generate a secure random string)
JWT_SECRET=your_secure_random_string_minimum_32_characters
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 5. Start Development Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```

Expected output:
```
🚀 SERVER RUNNING: http://localhost:5000
✅ DATABASE CONNECTED! Xplora system ready.
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Expected output:
```
VITE v8.0.5 ready in 566 ms

➜  Local:   http://localhost:5173/
```

3. Open your browser and navigate to the URL shown by Vite

## 📁 Project Structure

```
Talking-Brothers-main/
├── client/                    # React frontend
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── AuthContext.jsx   # Authentication context
│   │   ├── LoginPage.jsx     # Login/Register page
│   │   ├── DashboardPage.jsx # Main dashboard
│   │   ├── ProfilesPage.jsx  # User profiles
│   │   ├── NewExperience.jsx # Experience creation
│   │   ├── NewProduct.jsx    # Product creation
│   │   └── ...               # Other components
│   ├── package.json
│   └── vite.config.js
├── server/                    # Node.js backend
│   ├── index.js              # Express server & routes
│   ├── sql/
│   │   └── xplora_schema.sql # Database schema
│   ├── .env.example          # Environment template
│   ├── package.json
│   ├── SECURITY.md           # Security guidelines
│   └── .gitignore
├── DEPLOYMENT.md             # Production deployment guide
└── README.md                 # This file
```

## 🔐 Security Notes

- **Never commit `.env` files** - They contain sensitive information
- All `.env` files are ignored in `.gitignore`
- Use strong, random JWT secrets in production
- See [SECURITY.md](server/SECURITY.md) for detailed security practices
- Passwords are hashed using bcryptjs before storage
- All sensitive data is excluded from version control

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/users/:id/avatar` - Upload profile picture

### Experiences
- `POST /api/experiences` - Create experience
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get experience details

### Products
- `POST /api/products` - Create product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread/:userId` - Get unread count
- `POST /api/notifications/read-all` - Mark all as read

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/experiences` - Get user's experiences
- `GET /api/users/:id/products` - Get user's products

See [server/index.js](server/index.js) for complete endpoint documentation.

## 🛠️ Available Commands

### Backend
```bash
cd server
node index.js          # Start development server
```

### Frontend
```bash
cd client
npm run dev            # Start development server
npm run build          # Build for production
npm run lint           # Run ESLint
npm run preview        # Preview production build
```

## 📝 Important Notes

- **Default Ports**: Backend runs on `5000`, Frontend on `5173`
- **Port Conflicts**: If Vite detects port `5173` is in use, it will use the next available port
- **Database Schema**: The SQL file is the single source of truth for database structure
- **CORS**: Backend is configured to accept requests from `http://localhost:5173`

## 🚀 Deployment

For production deployment instructions, refer to [DEPLOYMENT.md](DEPLOYMENT.md) which covers:
- Environment configuration for production
- Backend deployment (PM2, Docker, cloud platforms)
- Frontend build and deployment
- Database setup and migration
- SSL/HTTPS configuration
- Security best practices
- Monitoring and logging

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

**Before submitting:**
- Ensure `.env` is not included in commits
- Run linting: `npm run lint`
- Test locally on both frontend and backend
- Update documentation if needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For issues, questions, or feedback, please open an issue on the GitHub repository.

## 🗂️ Key Files

- [Database Schema](server/sql/xplora_schema.sql) - Complete database structure
- [Security Guidelines](server/SECURITY.md) - Security practices and requirements
- [Deployment Guide](DEPLOYMENT.md) - Production setup instructions
- [Backend Configuration](.env.example) - Environment variables template
