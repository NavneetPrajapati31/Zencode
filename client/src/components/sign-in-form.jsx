import { useState } from "react";
import { signIn } from "../lib/api";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await signIn(email, password);
      localStorage.setItem("token", data.token);
      setSuccess("Sign in successful!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow flex flex-col gap-4"
      onSubmit={handleSubmit}
      aria-label="Sign in form"
    >
      <h2 className="text-2xl font-bold mb-2 text-center">Sign In</h2>
      <label htmlFor="email" className="font-medium">
        Email
      </label>
      <input
        id="email"
        type="email"
        className="border rounded px-3 py-2 focus:outline-none focus:ring"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        aria-required="true"
        aria-label="Email"
      />
      <label htmlFor="password" className="font-medium">
        Password
      </label>
      <input
        id="password"
        type="password"
        className="border rounded px-3 py-2 focus:outline-none focus:ring"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        autoComplete="current-password"
        aria-required="true"
        aria-label="Password"
      />
      {error && (
        <div className="text-red-600" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600" role="status">
          {success}
        </div>
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <div className="text-center text-sm mt-2">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-blue-600 underline">
          Sign Up
        </a>
      </div>
    </form>
  );
};

export default SignInForm;
