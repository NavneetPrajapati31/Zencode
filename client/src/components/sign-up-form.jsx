import { useState } from "react";
import { signUp } from "../lib/api";

const SignUpForm = () => {
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
      const data = await signUp(email, password);
      localStorage.setItem("token", data.token);
      setSuccess("Sign up successful!");
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
      aria-label="Sign up form"
    >
      <h2 className="text-2xl font-bold mb-2 text-center">Sign Up</h2>
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
        autoComplete="new-password"
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
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      <div className="text-center text-sm mt-2">
        Already have an account?{" "}
        <a href="/signin" className="text-blue-600 underline">
          Sign In
        </a>
      </div>
    </form>
  );
};

export default SignUpForm;
