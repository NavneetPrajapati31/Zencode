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
} from "./ui/pagination";

const medalIcons = [
  { icon: "🥇", label: "Gold Medal" },
  { icon: "🥈", label: "Silver Medal" },
  { icon: "🥉", label: "Bronze Medal" },
];

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

const LeaderboardRow = ({ user, rank, isTop3 }) => (
  <tr
    tabIndex={0}
    aria-label={`Rank ${rank + 1}, ${user.name}`}
    className={cn(
      "theme-transition focus:outline-none focus:ring-0 hover:bg-accent",
      rank % 2 === 1 ? "bg-accent/70" : "bg-background"
    )}
  >
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
    <td className="px-4 py-3 text-right font-semibold text-foreground">
      {user.totalQuestions}
    </td>
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
                  rank={idx + (page - 1) * PAGE_SIZE}
                  isTop3={idx + (page - 1) * PAGE_SIZE < 3}
                />
              ))}
            </tbody>
          </table>
        </div>
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page - 1);
                }}
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : 0}
              />
            </PaginationItem>
            {page > 2 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 1)
              .map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(p);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
            {page < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {page < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page + 1);
                }}
                aria-disabled={page === totalPages}
                tabIndex={page === totalPages ? -1 : 0}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </>
  );
};

export default Leaderboard;
