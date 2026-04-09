import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../api/api";
import { useAuth } from "../auth/AuthContext";

export default function Auth() {
	const { user, login } = useAuth();
	const [error, setError] = useState("");
	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

	const isGoogleConfigured = useMemo(() => Boolean(googleClientId), [googleClientId]);

	if (user) {
		return <Navigate to="/" replace />;
	}

	async function handleGoogleSuccess(response) {
		setError("");
		try {
			const authResponse = await api.googleLogin({ credential: response.credential });
			login(authResponse.user);
		} catch (submitError) {
			setError(submitError.message || "Google authentication failed");
		}
	}

	return (
		<main className="auth-page">
			<section className="auth-card">
				<h1>Continue with Google</h1>
				<p>Sign in to Cerivia using your Google account to access your private wellness dashboard.</p>
				{isGoogleConfigured ? (
					<div className="google-login-wrap">
						<GoogleLogin
							onSuccess={handleGoogleSuccess}
							onError={() => setError("Google sign-in was cancelled or failed")}
							useOneTap
						/>
					</div>
				) : (
					<p className="status-line error">
						Google login is not configured. Add VITE_GOOGLE_CLIENT_ID to frontend env.
					</p>
				)}
				{error ? <p className="status-line error">{error}</p> : null}
			</section>
		</main>
	);
}
