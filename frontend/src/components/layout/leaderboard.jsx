import { useEffect, useState } from "react";
import { User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const medalIcons = [
  {
    icon: "🥇",
    label: "Gold Medal",
    badge: "Zen Master",
    classname: "bg-blue-600/20 text-blue-500",
    ring: "border-blue-500",
  },
  {
    icon: "🥈",
    label: "Silver Medal",
    badge: "Zen Sage",
    classname: "bg-rose-600/20 text-rose-500",
    ring: "border-rose-500",
  },
  {
    icon: "🥉",
    label: "Bronze Medal",
    badge: "Zen Sensei",
    classname: "bg-violet-600/20 text-violet-500",
    ring: "border-violet-500",
  },
];

// const Avatar = ({ src, alt }) =>
//   src ? (
//     <img
//       src={src}
//       alt={alt}
//       className="w-10 h-10 rounded-full object-cover theme-transition"
//       loading="lazy"
//     />
//   ) : (
//     <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl text-muted-foreground theme-transition">
//       <User2 className="w-6 h-6" aria-label="User avatar" />
//     </div>
//   );

const LeaderboardRow = ({ user, rank, isTop3 }) => (
  <tr
    tabIndex={0}
    aria-label={`Rank ${rank + 1}, ${user.name}`}
    className={cn(
      "theme-transition focus:outline-none focus:ring-0 hover:bg-accent bg-background"
      // rank % 2 === 1 ? "bg-accent/70" : "bg-background"
    )}
  >
    <Link to={`/profile/${user.handle}`}>
      <td className="pl-4 py-3 flex items-center gap-3 theme-transition">
        <Avatar className="h-10 w-10 theme-transition">
          <AvatarImage
            src={user?.avatar}
            alt={user?.name || user?.email || "User"}
          />
          <AvatarFallback className="text-sm text-foreground border border-border theme-transition">
            {user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5 theme-transition">
          <span className="flex flex-row gap-4 font-medium text-sm text-foreground leading-tight theme-transition">
            {user.name}
            <div
              className={
                rank != null && rank >= 0 && rank < 3
                  ? `${medalIcons[rank].classname} text-xs px-3 py-0.5 rounded-3xl font-normal`
                  : "text-xs px-2 py-0.5 rounded-3xl"
              }
            >
              {rank != null && rank >= 0 && rank < 3 && medalIcons[rank].badge}
            </div>
          </span>
          <span className="text-xs text-muted-foreground leading-tight theme-transition font-normal">
            @{user.handle}
          </span>
        </div>
      </td>
    </Link>
    <td className="px-4 py-3 text-center font-normal text-foreground theme-transition">
      {user.totalSubmissions}
    </td>
    <td className="px-4 py-3 text-center font-normal text-foreground theme-transition">
      {user.totalQuestions}
    </td>
    <td className="px-4 py-3 text-center font-normal min-w-[100px] theme-transition">
      {isTop3 ? (
        <span
          role="img"
          aria-label={
            rank != null && rank >= 0 && rank < 3
              ? medalIcons[rank].label
              : undefined
          }
          className="text-lg align-middle theme-transition"
        >
          {rank != null && rank >= 0 && rank < 3 && medalIcons[rank].icon}
        </span>
      ) : (
        <span className="text-foreground theme-transition">#{rank + 1}</span>
      )}
    </td>
    <td className="px-4 py-3 text-center font-normal text-foreground theme-transition">
      {user.score}
    </td>
  </tr>
);

const PAGE_SIZE = 10;

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeaderboard = async (pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/leaderboard?page=${pageNum}&limit=${PAGE_SIZE}`
      );
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      const json = await res.json();
      setData(json.data || []);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      setError(err.message || "Unknown error");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

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
  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground text-lg theme-transition">
        No leaderboard data found.
      </div>
    );
  }

  return (
    <>
      <h1 className="!text-2xl font-medium text-center mt-8 mb-2 text-foreground theme-transition font-sans px-2 sm:px-4">
        Leaderboard
      </h1>
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-8 theme-transition">
        <div className="bg-background rounded-2xl shadow-none overflow-x-auto border border-border theme-transition">
          <table className="min-w-full text-left text-sm theme-transition">
            <thead className="h-16 theme-transition">
              <tr className="bg-accent/70 text-muted-foreground theme-transition">
                <th className="!px-5 py-3 font-semibold text-sm theme-transition">
                  User Name
                </th>
                <th className="!px-5 py-3 font-semibold text-sm text-center theme-transition">
                  Total Submissions
                </th>
                <th className="!px-5 py-3 font-semibold text-sm text-center theme-transition">
                  Total Problems
                </th>
                <th className="!px-5 py-3 font-semibold text-sm text-center theme-transition">
                  Rank
                </th>
                <th className="!px-5 py-3 font-semibold text-sm text-center theme-transition">
                  Zen Score
                </th>
              </tr>
            </thead>
            <tbody className="theme-transition">
              {data.map((user, idx) => (
                <LeaderboardRow
                  key={user.handle}
                  user={user}
                  rank={idx + (page - 1) * PAGE_SIZE}
                  isTop3={idx + (page - 1) * PAGE_SIZE < 3}
                />
              ))}
            </tbody>
          </table>
        </div>
        <Pagination className="mt-6 text-muted-foreground theme-transition">
          <PaginationContent className="theme-transition">
            <PaginationItem className="theme-transition">
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page - 1);
                }}
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : 0}
                className="theme-transition"
              />
            </PaginationItem>
            {page > 2 && (
              <PaginationItem className="theme-transition">
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(1);
                  }}
                  className="theme-transition !bg-accent"
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {page > 3 && (
              <PaginationItem className="theme-transition">
                <PaginationEllipsis className="theme-transition" />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 1)
              .map((p) => (
                <PaginationItem key={p} className="theme-transition">
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(p);
                    }}
                    className="theme-transition !bg-accent"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
            {page < totalPages - 2 && (
              <PaginationItem className="theme-transition">
                <PaginationEllipsis className="theme-transition" />
              </PaginationItem>
            )}
            {page < totalPages - 1 && (
              <PaginationItem className="theme-transition">
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                  className="theme-transition !bg-accent"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem className="theme-transition">
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page + 1);
                }}
                aria-disabled={page === totalPages}
                tabIndex={page === totalPages ? -1 : 0}
                className="theme-transition"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </>
  );
};

export default Leaderboard;
