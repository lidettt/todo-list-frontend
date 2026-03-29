import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
      navigate("/todos");
      toast.success("Login Successfully.");
    } catch (error) {
      toast.error("Invalid Email or Password.");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 font-sans">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-6xl font-bold text-white tracking-tight mb-2">
          ToDo List
        </h1>
        <p className="text-muted ">Plan, prioritize, and progress.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-10">
        <h2 className="font-serif text-2xl font-bold text-white mb-1">
          Welcome back
        </h2>
        <p className="text-subtle text-base mb-8">Login to access your tasks</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-dimmed text-base font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-black border border-border rounded-xl px-4 py-3 text-white text-base placeholder-faint outline-none focus:border-hover-border transition-colors duration-200"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-dimmed text-base font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-black border border-border rounded-xl px-4 py-3 text-white text-base placeholder-faint outline-none focus:border-hover-border transition-colors duration-200"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 bg-white font-semibold text-black rounded-xl py-3 hover:bg-text-soft transition-colors duration-200 cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-subtle mt-6">
          Don't have an account?
          <Link
            to="/register"
            className="text-white underline hover:text-dimmed transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
