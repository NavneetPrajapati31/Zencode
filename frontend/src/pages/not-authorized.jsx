import { Link } from "react-router-dom";

function NotAuthorized() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[90vh] bg-background text-foreground theme-transition">
      <h1 className="text-lg font-semibold mb-4">Not Authorized</h1>
      <p className="mb-6 text-muted-foreground theme-transition">
        You do not have permission to access this page.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-primary text-foreground rounded hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary theme-transition"
      >
        Go to Home
      </Link>
    </main>
  );
}

export default NotAuthorized;
