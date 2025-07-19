import { useEffect, useState } from "react";
import { UserCircle, Medal, User2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Medal icons for top 3
const medalIcons = [
  { icon: "🥇", label: "Gold Medal" },
  { icon: "🥈", label: "Silver Medal" },
  { icon: "🥉", label: "Bronze Medal" },
];

// Example avatar fallback
const Avatar = ({ src, alt }) =>
  src ? (
    <img
      src={src}
      alt={alt}
      className="w-10 h-10 rounded-full object-cover"
      loading="lazy"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl text-muted-foreground">
      <User2 className="w-6 h-6" aria-label="User avatar" />
    </div>
  );

// Leaderboard row
const LeaderboardRow = ({ user, rank, isTop3 }) => (
  <tr
    tabIndex={0}
    aria-label={`Rank ${rank + 1}, ${user.name}`}
    className={cn(
      "theme-transition focus:outline-none focus:ring-0 hover:bg-accent",
      rank % 2 === 1 ? "bg-accent/70" : "bg-background"
    )}
  >
    {/* User */}
    <td className="px-4 py-3 flex items-center gap-3 min-w-[220px]">
      <Avatar src={user.avatar} alt={user.name} />
      <div className="flex flex-col">
        <span className="font-semibold text-foreground leading-tight">
          {user.name}
        </span>
        <span className="text-xs text-muted-foreground leading-tight">
          {user.handle}
        </span>
      </div>
    </td>

    {/* Total Questions */}
    <td className="px-4 py-3 text-right font-semibold text-foreground">
      {user.totalQuestions}
    </td>
    {/* Rank */}
    <td className="px-4 py-3 text-center font-bold min-w-[100px]">
      {isTop3 ? (
        <span
          role="img"
          aria-label={medalIcons[rank].label}
          className="text-lg align-middle"
        >
          {medalIcons[rank].icon}
        </span>
      ) : (
        <span className="text-foreground">#{rank + 1}</span>
      )}
    </td>
  </tr>
);

// Main Leaderboard component
const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock fetch (replace with real API if needed)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData([
        {
          name: "anushka",
          handle: "@anu7hka",
          avatar: "https://avatars.githubusercontent.com/u/1?v=4",
          totalQuestions: 7492,
        },
        {
          name: "Rajat Joshi",
          handle: "@Rajat.18",
          avatar: "https://avatars.githubusercontent.com/u/2?v=4",
          totalQuestions: 5889,
        },
        {
          name: "Rameez Parwez",
          handle: "@Sōsuke",
          avatar: "https://avatars.githubusercontent.com/u/3?v=4",
          totalQuestions: 5746,
        },
        {
          name: "Raj Ghosh",
          handle: "@RAJGHOSH",
          avatar: "https://avatars.githubusercontent.com/u/4?v=4",
          totalQuestions: 5684,
        },
        {
          name: "Kunal Shaw",
          handle: "@HAOb2QIr",
          avatar: "https://avatars.githubusercontent.com/u/5?v=4",
          totalQuestions: 4995,
        },
        {
          name: "Abhishek Choudhary",
          handle: "@theabbie",
          avatar: "",
          totalQuestions: 4682,
        },
        {
          name: "Pratham Lashkari",
          handle: "@Pratham",
          avatar: "https://avatars.githubusercontent.com/u/6?v=4",
          totalQuestions: 4506,
        },
        {
          name: "Manikanta Venkateswarlu Oruganti",
          handle: "@manikanta",
          avatar: "",
          totalQuestions: 4373,
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground text-lg theme-transition">
        Loading leaderboard...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-destructive text-lg theme-transition">
        {error}
      </div>
    );
  }

  return (
    <>
      <h1 className="!text-2xl font-bold text-center mt-8 mb-2 text-foreground theme-transition font-sans px-2 sm:px-4">
        Leaderboard
      </h1>
      <section className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-8">
        <div className="bg-background rounded-2xl shadow-lg overflow-x-auto border border-border theme-transition">
          <table className="min-w-full text-left text-sm">
            <thead className="h-16">
              <tr className="bg-accent/70 text-muted-foreground theme-transition">
                <th className="!px-5 py-3 font-semibold text-base">
                  User Name
                </th>
                <th className="!px-5 py-3 font-semibold text-base text-right">
                  Total Questions
                </th>
                <th className="!px-5 py-3 font-semibold text-base text-center">
                  Rank
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((user, idx) => (
                <LeaderboardRow
                  key={user.handle}
                  user={user}
                  rank={idx}
                  isTop3={idx < 3}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Leaderboard;
