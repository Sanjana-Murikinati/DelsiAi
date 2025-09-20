
import React from "react";
import { Session } from "@/entities/Session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip } from "recharts";
import { TrendingUp, Calendar, Clock, Heart } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

const MOOD_COLORS = {
  very_sad: "#EF4444",
  sad: "#F97316", 
  neutral: "#6B7280",
  happy: "#10B981",
  very_happy: "#059669"
};

export default function InsightsPage() {
  const [sessions, setSessions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [weeklyData, setWeeklyData] = React.useState([]);

  const generateWeeklyData = React.useCallback(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        day: format(date, 'EEE'),
        sessions: 0,
        mood_score: 0,
        total_minutes: 0
      };
    });

    sessions.forEach(session => {
      const sessionDate = format(new Date(session.created_date), 'yyyy-MM-dd');
      const dayData = last7Days.find(day => day.date === sessionDate);
      
      if (dayData) {
        dayData.sessions += 1;
        dayData.total_minutes += session.duration_minutes || 0;
        
        // Convert mood to score
        const moodScores = {
          very_sad: 1,
          sad: 2,
          neutral: 3,
          happy: 4,
          very_happy: 5
        };
        dayData.mood_score = moodScores[session.mood_after] || 3;
      }
    });

    setWeeklyData(last7Days);
  }, [sessions]); // `sessions` is a dependency here

  const loadSessions = React.useCallback(async () => {
    try {
      const data = await Session.list("-created_date");
      setSessions(data);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
    setLoading(false);
  }, []); // `setSessions` and `setLoading` are stable, so no other dependencies needed.

  React.useEffect(() => {
    loadSessions();
  }, [loadSessions]); // `loadSessions` is now a stable callback

  React.useEffect(() => {
    if (sessions.length > 0) {
      generateWeeklyData();
    }
  }, [sessions, generateWeeklyData]); // `sessions` and `generateWeeklyData` are dependencies

  const getMoodDistribution = () => {
    const distribution = {
      very_sad: 0,
      sad: 0,
      neutral: 0,
      happy: 0,
      very_happy: 0
    };

    sessions.forEach(session => {
      if (session.mood_after && distribution.hasOwnProperty(session.mood_after)) {
        distribution[session.mood_after]++;
      }
    });

    return Object.entries(distribution).map(([mood, count]) => ({
      name: mood.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
      color: MOOD_COLORS[mood]
    })).filter(item => item.value > 0);
  };

  const getTopTopics = () => {
    const topicCount = {};
    
    sessions.forEach(session => {
      session.key_topics?.forEach(topic => {
        topicCount[topic] = (topicCount[topic] || 0) + 1;
      });
    });

    return Object.entries(topicCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));
  };

  const getTotalMinutes = () => {
    return sessions.reduce((total, session) => total + (session.duration_minutes || 0), 0);
  };

  const getAverageSessionLength = () => {
    const total = getTotalMinutes();
    return sessions.length > 0 ? Math.round(total / sessions.length) : 0;
  };

  const getCurrentStreak = () => {
    if (sessions.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = format(subDays(today, i), 'yyyy-MM-dd');
      const hasSession = sessions.some(session => 
        format(new Date(session.created_date), 'yyyy-MM-dd') === checkDate
      );
      
      if (hasSession) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const moodData = getMoodDistribution();
  const topTopics = getTopTopics();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Insights
          </h1>
          <p className="text-lg text-gray-600">
            Track your mental health progress and patterns
          </p>
        </div>

        {sessions.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Data Available
              </h2>
              <p className="text-gray-600">
                Complete some therapy sessions to see your insights and progress.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Sessions</p>
                      <p className="text-2xl font-bold text-blue-900">{sessions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">Total Time</p>
                      <p className="text-2xl font-bold text-green-900">
                        {Math.floor(getTotalMinutes() / 60)}h {getTotalMinutes() % 60}m
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Avg Session</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {getAverageSessionLength()}m
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Current Streak</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {getCurrentStreak()} days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Weekly Activity */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Last 7 Days Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sessions" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Mood Distribution */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Mood Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={moodData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {moodData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Mood Trend */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Mood Trend (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <XAxis dataKey="day" />
                      <YAxis domain={[1, 5]} />
                      <Tooltip 
                        formatter={(value) => {
                          const moods = ['', 'Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
                          return [moods[value], 'Mood'];
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mood_score" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Discussion Topics */}
            {topTopics.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Most Discussed Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topTopics.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {item.topic}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {item.count} session{item.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
