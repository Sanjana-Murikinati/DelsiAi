import React from "react";
import { Session } from "@/entities/Session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BookOpen, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SessionReportPage() {
  const [latestSession, setLatestSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadLatestSession();
  }, []);

  const loadLatestSession = async () => {
    try {
      const sessions = await Session.list("-created_date", 1);
      if (sessions.length > 0) {
        setLatestSession(sessions[0]);
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }
    setLoading(false);
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      very_sad: "😢",
      sad: "😔", 
      neutral: "😐",
      happy: "😊",
      very_happy: "😄"
    };
    return emojis[mood] || "😐";
  };

  const getMoodColor = (mood) => {
    const colors = {
      very_sad: "text-red-600 bg-red-50 border-red-200",
      sad: "text-orange-600 bg-orange-50 border-orange-200",
      neutral: "text-gray-600 bg-gray-50 border-gray-200",
      happy: "text-green-600 bg-green-50 border-green-200",
      very_happy: "text-emerald-600 bg-emerald-50 border-emerald-200"
    };
    return colors[mood] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!latestSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Session Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find your latest session report.
            </p>
            <Link to={createPageUrl("Dashboard")}>
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Session Complete</h1>
              <p className="text-gray-600">Here's your session summary and recommendations</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Report */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Assessment */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="text-4xl">
                    {getMoodEmoji(latestSession.mood_after)}
                  </div>
                  <div>
                    <h2 className="text-xl">How You're Feeling</h2>
                    <Badge className={`${getMoodColor(latestSession.mood_after)} border`}>
                      {latestSession.mood_after?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {latestSession.summary || "Thank you for sharing your thoughts and feelings during our session today."}
                </p>
              </CardContent>
            </Card>

            {/* Key Topics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>What We Discussed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {latestSession.key_topics?.map((topic, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 border border-blue-200"
                    >
                      {topic}
                    </Badge>
                  )) || (
                    <p className="text-gray-500 italic">No specific topics recorded</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Activities */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span>Activities to Boost Your Mood</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {latestSession.recommended_activities?.map((activity, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {activity.activity}
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {activity.description}
                      </p>
                    </div>
                  )) || (
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-gray-600">
                        Take some time for self-care today. Consider going for a walk, 
                        practicing deep breathing, or doing something that brings you joy.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Stats */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span>Session Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-lg font-semibold">
                    {latestSession.duration_minutes || 0} minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mode</p>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {latestSession.session_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Communication</p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {latestSession.mode?.replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-sm font-medium">
                    {new Date(latestSession.created_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link to={createPageUrl("Chat?mode=classic")} className="block">
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Start New Session
                </Button>
              </Link>
              
              <Link to={createPageUrl("History")} className="block">
                <Button variant="outline" className="w-full">
                  View Session History
                </Button>
              </Link>
              
              <Link to={createPageUrl("Dashboard")} className="block">
                <Button variant="ghost" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}