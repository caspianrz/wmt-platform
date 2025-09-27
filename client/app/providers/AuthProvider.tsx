import React from 'react';
import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
	uid: string | null;
	user: string | null;
	token: string | null;
	login: (uid: string, username: string, token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [uid, setUid] = useState<string|null>(null);
	const [user, setUser] = useState<string|null>(null);
	const [token, setToken] = useState<string|null>(null);

	const login = ( uid: string, username : string, token: string) => {
		setUid(uid);
		setUser(username);
		setToken(token);
		localStorage.setItem('ttt', token);
	};

	const logout = ()=> {
		setUid(null)
		setUser(null)
		setToken(null)
		localStorage.removeItem('ttt');
	}

	return (
		<AuthContext.Provider value={{ uid, user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = ()=> {
	return useContext(AuthContext);
};
