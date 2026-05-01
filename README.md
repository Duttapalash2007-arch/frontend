# Frontend - Healthcare Platform

A React-based frontend for the Healthcare Platform, featuring disease assessment forms, health reports, and admin dashboard.

## Features

- **Loading Splash Screen**: Beautiful loading page on app initialization
- **User Authentication**: Secure login and registration with form validation
- **Admin Authentication**: Separate admin login with role-based access
- **Health Assessment Form**: Interactive forms with AI-powered disease detection
- **Health Reports**: Comprehensive health reports with scores, advice, and doctor recommendations
- **Admin Dashboard**: Comprehensive admin management interface
- **Responsive Design**: Mobile-friendly interface with custom color scheme
- **Form Validation**: Client-side validation with error messages
- **Protected Routes**: Private routes for authenticated users, admin routes for admin only

## Color Scheme

- Primary: #42C2FF (Bold Blue)
- Accent: #85F4FF (Bright Aqua)
- Secondary Background: #B8FFF9 (Soft Pastel Aqua)
- White: #FFFFFF (Clean White)
- Dark Text: #1A1A1A (Neutral Dark Gray)
- Light Text: #FFFFFF (For dark backgrounds)

## Project Structure

```
frontend/
├── public/               # Static files
├── src/
│   ├── assets/          # Images, styles
│   │   └── styles/
│   │       └── global.css   # Responsive design utilities
│   ├── components/      # Reusable components
│   │   ├── layout/      # Header, Footer, Layout
│   │   ├── common/      # Button, Input, Loader, Modal, SplashLoader
│   │   ├── form/        # Form inputs and components
│   │   ├── disease/     # Disease-related components
│   │   ├── report/      # Report display components
│   │   ├── admin/       # Admin panel components
│   │   └── chatbot/     # Chatbot components
│   ├── pages/           # Page components
│   │   ├── public/      # Home, About, Contact
│   │   ├── auth/        # Login, Register
│   │   ├── user/        # User dashboard, assessment, reports
│   │   ├── admin/       # Admin dashboard and reports
│   │   └── chatbot/     # Chatbot page
│   ├── routes/          # Route configuration and guards
│   ├── services/        # API service layer
│   │   └── api.js       # Axios instance with auth interceptors
│   ├── context/         # React context (Auth, Chat)
│   ├── hooks/           # Custom hooks (useAuth, useFetch, useChat)
│   ├── utils/           # Utilities and validators
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
├── .env                 # Environment configuration
├── .eslintrc.json       # ESLint configuration
├── .prettierrc           # Prettier configuration
└── .gitignore
```

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   VITE_APP_NAME=Healthcare Platform
   VITE_ENVIRONMENT=development
   ```

   **Important**: Make sure your backend server is running on `http://localhost:5000` or update `VITE_API_BASE_URL` to match your backend URL.

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Backend Connection

### Prerequisites
- Backend server running on `http://localhost:5000`
- Backend has CORS enabled to allow requests from `http://localhost:3000`

### API Endpoints Required

The frontend expects the following API endpoints to be available:

```
POST   /auth/login              - User login
POST   /auth/register           - User registration
GET    /auth/profile            - Get user profile
PUT    /auth/profile            - Update user profile

GET    /reports                 - Get all reports
GET    /reports/:id             - Get single report
POST   /reports                 - Create report
PUT    /reports/:id             - Update report
DELETE /reports/:id             - Delete report
GET    /reports/:id/download    - Download report

GET    /admin/stats             - Get dashboard stats
GET    /admin/users             - Get users list
GET    /admin/reports           - Get reports list
GET    /admin/reports/:id       - Get report details
POST   /admin/users/:id/ban     - Ban user
POST   /admin/users/:id/unban   - Unban user
DELETE /admin/users/:id         - Delete user
POST   /admin/reports/:id/validate - Validate report

POST   /upload                  - Upload file
DELETE /upload/:id              - Delete uploaded file
```

### API Response Format

The backend should return responses in this format:

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Success message"
}
```

For authentication endpoints, include:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@email.com",
    "role": "user" /* or "admin" */
  }
}
```

### Error Handling

The frontend handles errors globally:
- 401 Unauthorized: Clears auth token and redirects to login
- 400 Bad Request: Shows form validation errors
- Other errors: Displays server error message

## Build

Build for production:
```bash
npm run build
```

## Technologies

- **React 18**: UI framework
- **React Router v6**: Client-side routing
- **Axios**: HTTP client with interceptors
- **Vite**: Fast build tool
- **CSS Variables**: Dynamic theme system

## Authentication Flow

1. User opens app → Loading splash screen appears for 1.5 seconds
2. User logs in/registers
3. Backend returns JWT token and user data
4. Frontend stores token in localStorage and user data
5. Token automatically included in all API requests via axios interceptor
6. Protected routes check for token and redirect to login if missing
7. Admin routes check for 'admin' role
8. User can logout to clear token and return to login

## Form Validation

- **Email**: Valid email format required
- **Password**: Minimum 8 characters
- **Name**: Minimum 2 characters
- **Confirm Password**: Must match password field

All errors are displayed inline with helpful messages.

## Responsive Design

The frontend is fully responsive:
- **Desktop**: Full layout optimization (1200px+)
- **Tablet**: Optimized padding and spacing (768px - 1199px)
- **Mobile**: Single column layout, full-width buttons (< 480px)

## Contributing

Please follow the component structure and naming conventions when adding new features.

## Troubleshooting

### Backend Connection Issues
If you see "Network Error" or API calls failing:
1. Ensure backend is running on port 5000
2. Check VITE_API_BASE_URL in .env file
3. Verify backend has CORS enabled for http://localhost:3000
4. Check browser console for detailed error messages

### Login/Register Issues
- Clear browser localStorage: DevTools → Application → Storage → Local Storage → Clear
- Refresh the page
- Check that backend auth endpoints are working
- Verify JWT token format from backend

### Build Issues
```bash
npm install                 # Reinstall dependencies
npm run build              # Try building again
npm run dev                # Or run in dev mode for debugging
```
