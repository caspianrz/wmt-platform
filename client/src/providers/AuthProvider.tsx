import { createContext, useState, useContext, type ReactNode, useEffect, useCallback } from 'react';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router';

interface AuthContextType {
	uid: string | null;
	user: string | null;
	token: string | null;
	login: (token: string) => void;
	logout: () => void;
	is_valid: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const initialToken = () => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("ttt");
		}
		return null;
	};

	const [uid, setUid] = useState<string | null>(null);
	const [user, setUser] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(initialToken);
	const navigate = useNavigate();

	useEffect(() => {
		if (!is_valid()) {
			logout();
			navigate('/login');
		}
	}, []);

	useEffect(() => {
		if (token) {
			const decoded_token = jwtDecode<{ userId: string, user: string }>(token);
			setUid(decoded_token.userId);
			setUser(decoded_token.user);
		} else {
			navigate('/login');
		}
	}, [token]);

	const login = (t: string) => {
		setToken(t);
		localStorage.setItem('ttt', t);
	};

	const logout = () => {
		setUid(null)
		setUser(null)
		setToken(null)
		localStorage.removeItem('ttt');
	}

	const is_valid = () => {
		if (!token) {
			return false;
		}
		const exp = jwtDecode<JwtPayload>(token!).exp! * 1000;
		if (exp == undefined || Date.now() >= exp) {
			console.log(Date.now() >= exp);
			return false;
		}
		return true;
	}

	return (
		<AuthContext.Provider value={{ uid, user, token, login, logout, is_valid }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider.");
	}
	return context;
};
