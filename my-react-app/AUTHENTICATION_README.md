# Underviser Login System

This project now includes a complete authentication system for the "underviser" (teacher) role using Firebase Authentication and Firestore.

## Features

- **User Registration**: Teachers can create new accounts
- **User Login**: Existing teachers can sign in
- **Firestore Integration**: User data is automatically saved to the "Users" collection
- **Role Management**: Users are assigned the "Teacher" role
- **Session Management**: Authentication state is managed globally

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project "devops-escaperoom"
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click "Add app" and select Web app
6. Copy the Firebase configuration object
7. Replace the placeholder values in `src/services/firebase.ts`

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication

### 3. Firestore Database

1. Go to "Firestore Database" in Firebase Console
2. Create database in production mode
3. The app will automatically create documents in the "Users" collection

## User Data Structure

When a teacher registers, their data is saved to Firestore with this structure:

```javascript
{
  email: "teacher@example.com",
  role: "Teacher",
  createdAt: ServerTimestamp
}
```

## Usage

1. Click "Underviser" on the home page
2. You'll be redirected to the login page
3. Create a new account or sign in with existing credentials
4. After successful authentication, you'll see the teacher dashboard with your user information
5. Use the "Logout" button to sign out

## Files Created/Modified

- `src/services/firebase.ts` - Firebase configuration
- `src/services/authService.ts` - Authentication service
- `src/components/UnderviserLogin.tsx` - Login/Register component
- `src/context/AuthContext.tsx` - Authentication context
- `src/App.tsx` - Updated to include login flow
- `src/main.tsx` - Added AuthProvider
- `src/pages/UnderviserPage.tsx` - Added user info and logout

## Security Notes

- Make sure to configure Firestore security rules appropriately
- The current setup saves user data with their Firebase UID as the document ID
- User passwords are handled securely by Firebase Authentication
