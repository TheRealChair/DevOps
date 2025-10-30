import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import type { User, UserCredential } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserData {
  email: string;
  role: 'Teacher' | 'Student';
  name?: string;
  createdAt: any; // Firestore timestamp
}

export class AuthService {
  // Register a new user
  static async register(email: string, password: string, role: 'Teacher' | 'Student' = 'Teacher'): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user data to Firestore
      await this.saveUserToFirestore(userCredential.user, role);
      
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Sign in existing user
  static async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign out current user
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Save user data to Firestore Users collection
  static async saveUserToFirestore(user: User, role: 'Teacher' | 'Student', name?: string): Promise<void> {
    try {
      const userData: UserData = {
        email: user.email || '',
        role: role,
        name: name || user.displayName || '',
        createdAt: serverTimestamp()
      };

      // Save to Users collection with user ID as document ID
      await setDoc(doc(db, 'Users', user.uid), userData);
      
      console.log('User data saved to Firestore:', userData);
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      throw error;
    }
  }

  // Get user data from Firestore
  static async getUserData(userId: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, 'Users', userId));
      
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      } else {
        console.log('No user document found');
        return null;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Send password reset email
  static async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Update user profile (name)
  static async updateUserProfile(user: User, displayName: string): Promise<void> {
    try {
      await updateProfile(user, { displayName });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Update user data in Firestore
  static async updateUserData(userId: string, updates: Partial<UserData>): Promise<void> {
    try {
      await updateDoc(doc(db, 'Users', userId), updates);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }
}
