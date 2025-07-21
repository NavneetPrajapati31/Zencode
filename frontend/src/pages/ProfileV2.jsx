import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/use-auth";
import ProfileView from "@/components/profile/profile-view";
import {
  leaderboardAPI,
  submissionAPI,
  progressAPI,
  problemsAPI,
  profileAPI,
} from "@/utils/api";

export default function Profile() {
  const { user } = useAuth();

  const [leaderboardRank, setLeaderboardRank] = useState(null);
  const [progressStats, setProgressStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [totalProblems, setTotalProblems] = useState(0);
  const [socialProfiles, setSocialProfiles] = useState({
    github: "",
    linkedin: "",
    twitter: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [isPublicProfileLoading, setIsPublicProfileLoading] = useState(false);
  const [isPublicProfileError, setIsPublicProfileError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.username) return;
      try {
        // Fetch leaderboard rank
        const leaderboardRes = await leaderboardAPI.getRank(user.username);
        setLeaderboardRank(leaderboardRes.rank || null);

        // Fetch progress stats
        try {
          const progressRes = await progressAPI.getUserProgress(user.username);
          setProgressStats(
            progressRes.stats || { easy: 0, medium: 0, hard: 0 }
          );
        } catch {
          // fallback: count from user.solvedProblems if available
          if (user.solvedProblems) {
            const stats = { easy: 0, medium: 0, hard: 0 };
            user.solvedProblems.forEach((p) => {
              if (p.difficulty === "Easy") stats.easy++;
              else if (p.difficulty === "Medium") stats.medium++;
              else if (p.difficulty === "Hard") stats.hard++;
            });
            setProgressStats(stats);
          }
        }

        // Fetch recent submissions
        const submissionsRes = await submissionAPI.getUserSubmissions(
          user.username
        );
        setRecentSubmissions(submissionsRes.submissions?.slice(0, 3) || []);

        // Fetch total problem count
        try {
          const countRes = await problemsAPI.getTotalCount();
          setTotalProblems(countRes.count || 0);
        } catch {
          //
        }

        // Fetch user profile to get social profiles
        try {
          const profileRes = await profileAPI.getProfile(user.username);
          setSocialProfiles({
            github: profileRes.socialProfiles?.github || "",
            linkedin: profileRes.socialProfiles?.linkedin || "",
            twitter: profileRes.socialProfiles?.twitter || "",
          });
        } catch {
          //
        }

        // Fetch heatmap data
        try {
          const heatmapRes = await profileAPI.getHeatmap(user.username);
          setHeatmapData(heatmapRes.heatmap || []);
        } catch {
          //
        }

        // Fetch public profile state
        try {
          const publicProfileRes = await profileAPI.getProfile(user.username);
          setIsPublicProfile(!!publicProfileRes.isPublicProfile);
        } catch {
          setIsPublicProfile(false);
        }
      } catch {
        // handle error (optional: set error state)
      }
    };
    fetchData();
  }, [user]);

  const handleUpdateSocialProfiles = async (profiles) => {
    try {
      await profileAPI.updateSocialProfiles(user.username, profiles);
      // Fetch the latest profile from backend
      const profileRes = await profileAPI.getProfile(user.username);
      setSocialProfiles({
        github: profileRes.socialProfiles?.github || "",
        linkedin: profileRes.socialProfiles?.linkedin || "",
        twitter: profileRes.socialProfiles?.twitter || "",
      });
    } catch (error) {
      console.error("Failed to update social profiles:", error);
      throw error;
    }
  };

  const handleSocialButtonClick = (platform) => {
    const profile = socialProfiles[platform];
    if (profile) {
      window.open(profile, "_blank");
    } else {
      setSelectedPlatform(platform);
      setIsModalOpen(true);
    }
  };

  const handleTogglePublicProfile = async () => {
    setIsPublicProfileLoading(true);
    setIsPublicProfileError("");
    try {
      await profileAPI.patchPublicProfile(!isPublicProfile);
      setIsPublicProfile((prev) => !prev);
    } catch {
      setIsPublicProfileError("Failed to update public profile setting");
    } finally {
      setIsPublicProfileLoading(false);
    }
  };

  if (!user) return null;

  return (
    <ProfileView
      user={user}
      leaderboardRank={leaderboardRank}
      progressStats={progressStats}
      totalProblems={totalProblems}
      recentSubmissions={recentSubmissions}
      socialProfiles={socialProfiles}
      onSocialClick={handleSocialButtonClick}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      selectedPlatform={selectedPlatform}
      setSelectedPlatform={setSelectedPlatform}
      onUpdateSocialProfiles={handleUpdateSocialProfiles}
      heatmapData={heatmapData}
      isPublicProfile={isPublicProfile}
      isPublicProfileLoading={isPublicProfileLoading}
      isPublicProfileError={isPublicProfileError}
      onTogglePublicProfile={handleTogglePublicProfile}
    />
  );
}
