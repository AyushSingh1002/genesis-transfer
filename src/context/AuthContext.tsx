import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  sendPasswordResetEmail,
  deleteUser
} from 'firebase/auth';
import { auth, db } from '@/integrations/firebase/client';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role?: 'owner' | 'resident', referralCode?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  userProfile: UserProfile | null;
}

interface UserProfile {
  fullName: string;
  email: string;
  createdAt: string;
  role?: 'owner' | 'resident' | 'guest';
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Add error boundary for auth state
  const [authError, setAuthError] = useState<string | null>(null);

  const isGuest = user?.isAnonymous || false;

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        
        if (user && !user.isAnonymous) {
          // Fetch user profile for registered users
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as UserProfile);
          }
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError('Authentication failed to initialize');
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'owner' | 'resident' = 'resident', referralCode?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore
    const userProfile = {
      fullName,
      email,
      role,
      createdAt: new Date().toISOString(),
      ...(referralCode && { referralCode }),
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    setUserProfile(userProfile);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInAsGuest = async () => {
    await signInAnonymously(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const deleteAccount = async () => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      // Delete user document from Firestore if not anonymous
      if (!user.isAnonymous && user.uid) {
        await deleteDoc(doc(db, 'users', user.uid));
      }

      // Delete user from Firebase Auth
      await deleteUser(user);
      
      // Clear user profile state
      setUserProfile(null);
    } catch (error: any) {
      // If re-authentication is required, throw a specific error
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('For security reasons, please log out and log back in before deleting your account.');
      }
      throw error;
    }
  };

  // If there's an auth error, show a fallback
  if (authError) {
    return <div>Authentication Error: {authError}</div>;
  }

  const value = {
    user,
    isGuest,
    loading,
    signUp,
    signIn,
    signInAsGuest,
    resetPassword,
    logout,
    deleteAccount,
    userProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};