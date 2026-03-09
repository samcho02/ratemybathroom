import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleSuccess = async (credentialResponse) => {
    try {
      // 1. Send the Google token to your backend /auth/google route
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) throw new Error("Backend authentication failed");

      const userData = await res.json();

      // 2. STORE THE TOKEN
      // This makes your localStorage.getItem("googleToken") work in CreateStack.jsx
      localStorage.setItem("googleToken", credentialResponse.credential);

      // Optional: Store user info for the UI
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("Login successful:", userData);
      navigate("/"); // Redirect to home
    } catch (err) {
      console.error("Login Error:", err);
      alert("Failed to log in with Google.");
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome to the Stack App</h1>
      <p>Please sign in to create and remix stacks.</p>

      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
        useOneTap
      />
    </div>
  );
}
