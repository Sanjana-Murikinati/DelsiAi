import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Heart, Brain, Sparkles } from "lucide-react";

export default function HomePage() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      if (currentUser?.onboarding_completed) {
        window.location.href = createPageUrl("Dashboard");
        return;
      }
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    await User.loginWithRedirect(window.location.origin + createPageUrl("Auth"));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
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

      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl"></span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Dilse</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="text-gray-700 hover:text-gray-900 font-medium">
                Login
              </Button>
              <Button
                onClick={handleLogin}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            
            <div className="w-32 h-32 md:w-40 md:h-40 bg-yellow-400 dark:bg-yellow-500 rounded-full hero-logo-pulse mb-12 mx-auto"></div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Your Personal
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent block">
                AI Therapist
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience professional therapy support anytime, anywhere. 
              Private, secure, and tailored to your unique mental health journey.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                onClick={handleLogin}
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center space-x-2">
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-2 text-gray-500">
                <Shield className="w-5 h-5" />
                <span className="text-sm">100% Private & Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-orange-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Therapy That Adapts to You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI understands your unique needs and provides personalized support 
              through advanced conversational therapy techniques.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligent Conversations</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI is trained on therapeutic techniques to provide meaningful, 
                supportive conversations that help you process emotions and thoughts.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Emotional Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Get immediate emotional support whenever you need it. 
                Our AI provides empathetic responses and coping strategies.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personal Growth</h3>
              <p className="text-gray-600 leading-relaxed">
                Track your progress, identify patterns, and work towards your 
                mental health goals with personalized insights and recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-yellow-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Begin Your Healing Journey?
          </h2>
          <p className="text-xl text-yellow-100 mb-12 max-w-2xl mx-auto">
            Join thousands who have found support, clarity, and growth through our AI therapy platform.
          </p>
          
          <Button
            onClick={handleLogin}
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-50 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
            Start Free Today
          </Button>
          
          <div className="flex items-center justify-center space-x-8 mt-12 text-yellow-100">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-white">Dilse</span>
          </div>
          <p className="text-gray-400 mb-4">
            Your mental health matters. Take the first step towards healing today.
          </p>
          <p className="text-sm text-gray-500">
            © 2024 Dilse. All rights reserved. Your privacy is protected.
          </p>
        </div>
      </footer>
    </div>);
}