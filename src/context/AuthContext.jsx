import React, { useContext, createContext } from 'react';
import { useUser } from '@/hooks/useAuth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { data: user, isLoading } = useUser();

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};