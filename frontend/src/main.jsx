import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<GoogleOAuthProvider clientId={googleClientId}>
			<AuthProvider>
				<BrowserRouter
					future={{
						v7_startTransition: true,
						v7_relativeSplatPath: true
					}}
				>
					<App />
				</BrowserRouter>
			</AuthProvider>
		</GoogleOAuthProvider>
	</React.StrictMode>
);
