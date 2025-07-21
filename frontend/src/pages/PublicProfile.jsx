import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  profileAPI,
  problemsAPI,
  progressAPI,
  leaderboardAPI,
  submissionAPI,
} from "@/utils/api";
import ProfileView from "@/components/profile-view";

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heatmapData, setHeatmapData] = useState([]);
  const [progressStats, setProgressStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [totalProblems, setTotalProblems] = useState(0);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [leaderboardRank, setLeaderboardRank] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await profileAPI.getPublicProfile(username);
        setProfile(data);
        // Fetch heatmap
        try {
          const heatmapRes = await profileAPI.getHeatmap(username);
          setHeatmapData(heatmapRes.heatmap || []);
        } catch {
          setHeatmapData([]);
        }
        // Fetch progress stats
        try {
          console.log("Calling progressAPI.getUserProgress()");
          const progressRes = await progressAPI.getUserProgress(username);
          console.log("PROGRESS RESPONSE", progressRes);
          setProgressStats(
            progressRes.stats || { easy: 0, medium: 0, hard: 0 }
          );
        } catch {
          setProgressStats({ easy: 0, medium: 0, hard: 0 });
        }
        // Fetch total problem count
        try {
          console.log("Calling problemsAPI.getTotalCount()");
          const countRes = await problemsAPI.getTotalCount();
          console.log("PROBLEMS COUNT RESPONSE", countRes);
          setTotalProblems(countRes.count || 0);
        } catch {
          setTotalProblems(0);
        }
        // Fetch leaderboard rank
        try {
          console.log("Calling leaderboardAPI.getRank()");
          const leaderboardRes = await leaderboardAPI.getRank(username);
          console.log("LEADERBOARD RESPONSE", leaderboardRes);
          setLeaderboardRank(leaderboardRes.rank || null);
        } catch {
          setLeaderboardRank(null);
        }
        // Fetch recent submissions
        try {
          console.log("Calling submissionAPI.getUserSubmissions()");
          const submissionsRes =
            await submissionAPI.getUserSubmissions(username);
          console.log("SUBMISSIONS RESPONSE", submissionsRes);
          setRecentSubmissions(submissionsRes.submissions?.slice(0, 3) || []);
        } catch {
          setRecentSubmissions([]);
        }
      } catch {
        setError("This profile is not public or does not exist.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleSocialButtonClick = (platform) => {
    const link = profile.socialProfiles[platform];
    if (link) {
      window.open(link, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <span className="text-muted-foreground text-sm">
          Loading profile...
        </span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <span className="text-red-500 text-sm">{error}</span>
      </div>
    );
  }

  return (
    <ProfileView
      user={profile}
      leaderboardRank={leaderboardRank}
      progressStats={progressStats}
      totalProblems={totalProblems}
      recentSubmissions={recentSubmissions}
      socialProfiles={profile.socialProfiles}
      onSocialClick={handleSocialButtonClick}
      isModalOpen={false}
      setIsModalOpen={undefined}
      onUpdateSocialProfiles={undefined}
      heatmapData={heatmapData}
      isPublicProfile={undefined}
      isPublicProfileLoading={undefined}
      isPublicProfileError={undefined}
      onTogglePublicProfile={undefined}
      isPublicView={true}
    />
  );
};

export default PublicProfile;
