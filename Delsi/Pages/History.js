import React from "react";
import { Session } from "@/entities/Session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageCircle, Mic, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

export default function HistoryPage() {
  const [sessions, setSessions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedSession, setExpandedSession] = React.useState(null);

  React.useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await Session.list("-created_date");
      setSessions(data);
    } catch (error) {
      console.error("Error loading sessions:", error);
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Session History
          </h1>
          <p className="text-lg text-gray-600">
            Review your therapy sessions and track your progress
          </p>
        </div>

        {sessions.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Sessions Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start your first therapy session to begin tracking your mental health journey.
              </p>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                Start Your First Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">
                        {getMoodEmoji(session.mood_after)}
                      </div>
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>
                            {format(new Date(session.created_date), 'MMMM d, yyyy')}
                          </span>
                          <Badge className={`${getMoodColor(session.mood_after)} border text-xs`}>
                            {session.mood_after?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{session.duration_minutes || 0} minutes</span>
                          </div>
                          <Badge 
                            variant="secondary"
                            className={session.session_type === 'guided' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
                          >
                            {session.session_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {session.mode === 'voice' ? (
                              <><Mic className="w-3 h-3 mr-1" /> Voice</>
                            ) : (
                              <><MessageCircle className="w-3 h-3 mr-1" /> Text</>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpandedSession(
                        expandedSession === session.id ? null : session.id
                      )}
                    >
                      {expandedSession === session.id ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {session.summary || "Session completed successfully"}
                    </p>
                  </div>

                  {session.key_topics && session.key_topics.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Topics Discussed:</p>
                      <div className="flex flex-wrap gap-2">
                        {session.key_topics.map((topic, index) => (
                          <Badge 
                            key={index}
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 border border-yellow-200 text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {expandedSession === session.id && (
                    <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                      {session.recommended_activities && session.recommended_activities.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-3">
                            Recommended Activities:
                          </p>
                          <div className="space-y-2">
                            {session.recommended_activities.map((activity, index) => (
                              <div 
                                key={index}
                                className="p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                              >
                                <h4 className="font-medium text-gray-900 text-sm mb-1">
                                  {activity.activity}
                                </h4>
                                <p className="text-gray-700 text-xs">
                                  {activity.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {format(new Date(session.created_date), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}