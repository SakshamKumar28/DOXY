import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to ensure user object is valid
  const handleUser = (userData) => {
    if (!userData) return null;
    const cleanUser = { ...userData };
    // Ensure role exists, default to patient if missing
    if (!cleanUser.role) {
        cleanUser.role = 'patient';
    }
    // Normalize casing just in case
    cleanUser.role = cleanUser.role.trim().toLowerCase();
    return cleanUser;
  };

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('doxy_user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                const validatedUser = handleUser(parsed);
                setUser(validatedUser);
                // Update storage with validated user to fix future reads
                localStorage.setItem('doxy_user', JSON.stringify(validatedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
                localStorage.removeItem('doxy_user');
            }
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
        const { data } = await api.post('/auth/login', { email, password, role });
        const validatedUser = handleUser(data.user || data);
        
        setUser(validatedUser); 
        localStorage.setItem('doxy_user', JSON.stringify(validatedUser));
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        toast.success(`Welcome back, ${validatedUser.name || 'User'}!`);
        return validatedUser;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed');
        return null;
    }
  };

  const register = async (userData) => {
      try {
          const endpoint = userData.role === 'doctor' 
            ? '/auth/register-doctor' 
            : '/auth/register-patient';
            
          const { data } = await api.post(endpoint, userData);
          const validatedUser = handleUser(data.user || data);
          
          setUser(validatedUser);
          localStorage.setItem('doxy_user', JSON.stringify(validatedUser));
          if (data.token) {
              localStorage.setItem('token', data.token);
          }
          toast.success('Registration successful!');
          return true;
      } catch (error) {
          toast.error(error.response?.data?.message || 'Registration failed');
          return false;
      }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      localStorage.removeItem('doxy_user');
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const updateUserProfile = (userData) => {
    const validatedUser = handleUser(userData);
    setUser(validatedUser);
    localStorage.setItem('doxy_user', JSON.stringify(validatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
