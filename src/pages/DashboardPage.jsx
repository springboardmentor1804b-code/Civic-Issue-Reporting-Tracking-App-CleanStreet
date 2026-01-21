import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, TrendingUp, CheckCircle } from "lucide-react";

import { Header, PageWrapper } from "../components/layout";

import { Loader } from "../components/common";

// Dashboard Feature Components
import {
  StatsCard,
  ActivityList,
  ReportsList,
  QuickActions,
  CommunityImpact,
  TrendingIssues,
  TopContributors,
  WelcomeSection,
} from "../components/features/dashboard";

// Services
import { issueService } from "../services/issueService";


export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [myReports, setMyReports] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [issueStats, setIssueStats] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    inProgressIssues: 0,
    resolvedIssues: 0,
  });
  const [animatedStats, setAnimatedStats] = useState({
    totalIssues: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [progressWidths, setProgressWidths] = useState({
    reported: 0,
    resolved: 0,
    users: 0,
  });

  const notifications = [
    { id: 1, text: "Your report was resolved", time: "2m ago", unread: true },
    { id: 2, text: "New comment on your issue", time: "1h ago", unread: true },
    { id: 3, text: "Weekly summary available", time: "2h ago", unread: false },
  ];

  // Fetch user data and issues from database
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user profile
        const res = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            navigate("/login");
            return;
          }
        }

        try {
          const stats = await issueService.getIssueStats();
          setIssueStats(stats);
        } catch (err) {
          console.error("Error fetching issue stats:", err);
        }

        try {
          if (user?.role === "Volunteer") {
  const assigned = await issueService.getAssignedIssues();
  setMyReports(assigned.issues || []);
} else {
  const userIssues = await issueService.getMyIssues();
  setMyReports(userIssues);
}

        } catch (err) {
          console.error("Error fetching user issues:", err);
        }

        // Fetch all issues for recent activity
        try {
          const allIssuesData = await issueService.getIssues({ limit: 10 });
          setAllIssues(allIssuesData.issues || []);
        } catch (err) {
          console.error("Error fetching all issues:", err);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }

      setTimeout(() => setIsLoading(false), 800);
    };

    fetchData();
  }, [navigate]);

  // Animated counter effect
  useEffect(() => {
    if (isLoading) return;

    const targetStats = {
      totalIssues: issueStats.totalIssues || 0,
      pending: issueStats.pendingIssues || 0,
      inProgress: issueStats.inProgressIssues || 0,
      resolved: issueStats.resolvedIssues || 0,
    };
    const duration = 1500;
    const steps = 30;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = easeOutQuart(step / steps);
      setAnimatedStats({
        totalIssues: Math.round(targetStats.totalIssues * progress),
        pending: Math.round(targetStats.pending * progress),
        inProgress: Math.round(targetStats.inProgress * progress),
        resolved: Math.round(targetStats.resolved * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    // Animate progress bars
    const resolvedPercent =
      targetStats.totalIssues > 0
        ? Math.round((targetStats.resolved / targetStats.totalIssues) * 100)
        : 0;
    setTimeout(() => {
      setProgressWidths({ reported: 100, resolved: resolvedPercent, users: 21 });
    }, 500);

    return () => clearInterval(timer);
  }, [isLoading, issueStats]);

  // Easing function for smoother animation
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  // Helper function to format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Generate recent activity from all issues
  const recentActivity = allIssues.slice(0, 4).map((issue) => ({
    id: issue._id,
    title: issue.issueTitle,
    time: getTimeAgo(issue.createdAt),
    type:
      issue.status === "Resolved"
        ? "Resolved"
        : issue.status === "In Progress"
        ? "Progress"
        : "Reported",
  }));

  // Generate trending issues from all issues
  const trendingIssues = allIssues.slice(0, 4).map((issue, index) => ({
    id: issue._id,
    title: issue.issueTitle,
    location: issue.address || "Location not specified",
    votes: Math.floor(Math.random() * 100) + 50,
    trend: `+${Math.floor(Math.random() * 10) + 1}%`,
    hot: index < 2,
  }));

  const topContributors = [
    { id: 1, name: "Sarah Johnson", reports: 28, points: 450, avatar: "SJ", badge: "gold", level: "Champion" },
    { id: 2, name: "Michael Chen", reports: 22, points: 380, avatar: "MC", badge: "silver", level: "Expert" },
    { id: 3, name: "Emily Davis", reports: 19, points: 320, avatar: "ED", badge: "bronze", level: "Rising Star" },
  ];

  const communityImpact = {
    issuesReported: issueStats.totalIssues || 0,
    resolved: issueStats.resolvedIssues || 0,
    activeUsers: 100,
  };

  // Filter myReports based on active tab
  const filteredReports = myReports.filter((report) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return report.status === "Pending";
    if (activeTab === "progress") return report.status === "In Progress";
    if (activeTab === "resolved") return report.status === "Resolved";
    return true;
  });

  const displayName = user?.name || "User";

  // Stats config
  const statsConfig = [
    { label: "Total Issues", value: animatedStats.totalIssues, icon: FileText, gradient: "from-blue-500 to-indigo-600", bgColor: "bg-blue-50", delay: "delay-100" },
    { label: "Pending", value: animatedStats.pending, icon: Clock, gradient: "from-orange-500 to-amber-600", bgColor: "bg-orange-50", delay: "delay-200" },
    { label: "In Progress", value: animatedStats.inProgress, icon: TrendingUp, gradient: "from-purple-500 to-violet-600", bgColor: "bg-purple-50", delay: "delay-300" },
    { label: "Resolved", value: animatedStats.resolved, icon: CheckCircle, gradient: "from-emerald-500 to-green-600", bgColor: "bg-emerald-50", delay: "delay-400" },
  ];

  if (isLoading) {
    return <Loader message="Loading your dashboard..." />;
  }

  return (
    <PageWrapper>
      {/* Header */}
      <Header
        activeNav="/dashboard"
        showNotifications={true}
        onNotificationClick={() => setShowNotifications(!showNotifications)}
        notifications={notifications}
        showNotificationDropdown={showNotifications}
      />

      {/* MAIN CONTENT */}
      <div className="relative px-4 md:px-6 py-4 md:py-5 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <WelcomeSection userName={displayName} />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statsConfig.map((stat) => (
            <StatsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              gradient={stat.gradient}
              bgColor={stat.bgColor}
              delay={stat.delay}
            />
          ))}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ActivityList activities={recentActivity} />
            <ReportsList
              reports={filteredReports}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              getTimeAgo={getTimeAgo}
            />
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <QuickActions />
            <CommunityImpact stats={communityImpact} progressWidths={progressWidths} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <TrendingIssues issues={trendingIssues} />
            <TopContributors contributors={topContributors} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}





