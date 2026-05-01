# Quick Start Guide

## Backend Setup
Make sure your backend is running first:

```bash
cd backend
npm install
npm run dev
```

Backend should be running on: `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment (if needed)
Edit `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Healthcare Platform
VITE_ENVIRONMENT=development
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will run on: `http://localhost:3000`

## Features Ready to Use

✅ **Loading Splash Screen** - Beautiful loading page on app start (1.5 seconds)
✅ **Login** - User login with form validation and backend connection
✅ **Register** - New user registration with password confirmation
✅ **Admin Login** - Separate admin login with role verification
✅ **Responsive Forms** - Fully responsive on mobile, tablet, and desktop
✅ **Error Handling** - Inline error messages and server error display
✅ **Protected Routes** - User and admin routes with auth guards
✅ **Header Navigation** - User menu with logout functionality

## Test Credentials

Use any email/password (minimum 8 characters) to test:
- Regular User: Email format must be valid
- Admin: Must have admin role from backend
- Backend should validate credentials and return JWT token

## Troubleshooting

### Port Already in Use
- Frontend: Change `vite.config.js` server port
- Backend: Change backend port and update `VITE_API_BASE_URL`

### CORS Errors
- Ensure backend has CORS enabled
- Verify `VITE_API_BASE_URL` matches backend URL

### Login Issues
1. Check backend is running
2. Clear browser localStorage (DevTools → Application → Storage)
3. Verify backend login endpoint returns token and user data

## Next Steps

1. ✅ Frontend is ready
2. ✅ Login/Register pages connected to backend
3. ✅ Forms are fully responsive
4. ✅ Loading splash screen implemented

What's left:
- [ ] Integrate remaining API endpoints (reports, admin, etc.)
- [ ] Test all features end-to-end
- [ ] Deploy to production

## File Structure
- Route handling: `src/routes/AppRoutes.jsx`
- API calls: `src/services/api.js`, `authService.js`, etc.
- Form validation: `src/utils/validators.js`
- Styling: `src/assets/styles/global.css`
