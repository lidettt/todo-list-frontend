import { useState } from "react";
import authService from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      await authService.register({ email, name, password });

      navigate("/login");
      toast.success("Registration Success! Please login");
    } catch (error) {
      const status = error.response?.status;

      if (status === 409) {
        toast.error("Email already exists. Please login instead.");
        navigate("/login");
      } else if (status === 400) {
        const firstError = error.response?.data?.errors?.[0]?.msg;
        toast.error(firstError || "Please check your inputs.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-4 font-sans">
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
          Create an account
        </h2>
        <p className="text-subtle text-sm mb-8">
          Sign up to start managing your tasks
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-dimmed text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="you@example.com"
              required
              className="bg-base border border-border rounded-xl px-4 py-3 text-white text-sm placeholder-faint outline-none focus:border-hover-border transition-colors duration-200"
            />
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-dimmed text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={({ target }) => setName(target.value)}
              placeholder="John Doe"
              required
              className="bg-base border border-border rounded-xl px-4 py-3 text-white text-sm placeholder-faint outline-none focus:border-hover-border transition-colors duration-200"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-dimmed text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="••••••••"
              required
              className="bg-base border border-border rounded-xl px-4 py-3 text-white text-sm placeholder-faint outline-none focus:border-hover-border transition-colors duration-200"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 bg-white font-semibold text-base rounded-xl py-3 hover:bg-text-soft transition-colors duration-200 cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-subtle mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white underline hover:text- transition-colors"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
