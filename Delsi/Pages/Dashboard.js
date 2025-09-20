import React from "react";
import { User } from "@/entities/User";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mic, BookOpen, BarChart3, Clock, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      if (!currentUser.onboarding_completed) {
        window.location.href = createPageUrl("Onboarding");
        return;
      }
      setUser(currentUser);
    } catch (error) {
      window.location.href = createPageUrl("Home");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>);

  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <style>{`
        .hero-logo-pulse {
          animation: heroLogoPulse 4s ease-in-out infinite;
        }
        @keyframes heroLogoPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0rem rgba(245, 158, 11, 0.4);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 0 1.5rem rgba(245, 158, 11, 0);
          }
        }
      `}</style>

      <div className="bg-[#FF8000] mb-8 w-32 h-32 md:w-40 md:h-40 dark:bg-yellow-500 rounded-full hero-logo-pulse"></div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Welcome to Dilse
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
        Your personal AI therapist, here to support your mental well-being anytime, anywhere.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to={createPageUrl("Chat?mode=classic")}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center space-x-2">

            <span>Start a Session</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <Link to={createPageUrl("Chat?mode=guided")}>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg">

            <span>Start Guided Session</span>
          </Button>
        </Link>
      </div>
    </div>);

}