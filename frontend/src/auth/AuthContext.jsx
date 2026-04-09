import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "cerevia_user";

function readStoredUser() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch (_error) {
		return null;
	}
}

const AuthContext = createContext({
	user: null,
	login: () => {},
	logout: () => {}
});

export function AuthProvider({ children }) {
	const [user, setUser] = useState(readStoredUser);

	const value = useMemo(
		() => ({
			user,
			login(nextUser) {
				setUser(nextUser);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
			},
			logout() {
				setUser(null);
				localStorage.removeItem(STORAGE_KEY);
			}
		}),
		[user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	return useContext(AuthContext);
}
