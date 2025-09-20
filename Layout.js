import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Moon, Sun, LogOut, Home, Heart, User as UserIcon, Settings, BarChart3, History } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "Dashboard", icon: Home, label: "Home" },
  { href: "Chat", icon: Heart, label: "Therapy" },
  { href: "History", icon: History, label: "History" },
  { href: "Insights", icon: BarChart3, label: "Insights" },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [theme, setTheme] = React.useState("light");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setTheme(currentUser.theme_preference || "light");
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.href = createPageUrl("Home");
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (user) {
      await User.updateMyUserData({ theme_preference: newTheme });
    }
  };

  const hideNavigation = currentPageName === "Home" || currentPageName === "Auth" || currentPageName === "Onboarding";
  const isChatPage = currentPageName === "Chat";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-gray-900 text-gray-800" 
        : "bg-gradient-to-br from-yellow-50 via-white to-yellow-50 text-gray-800"
    }`}>
      <style>{`
        :root {
          --primary: ${theme === "dark" ? "#FCD34D" : "#F59E0B"};
          --primary-foreground: ${theme === "dark" ? "#1F2937" : "#FFFFFF"};
          --secondary: ${theme === "dark" ? "#374151" : "#F3F4F6"};
          --background: ${theme === "dark" ? "#111827" : "#FFFFFF"};
          --card: ${theme === "dark" ? "#1F2937" : "#FFFFFF"};
          --border: ${theme === "dark" ? "#374151" : "#E5E7EB"};
        }
        .logo-pulse { animation: logoPulse 2s ease-in-out infinite; }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
        }
        .logo-vibrate:hover { animation: logoVibrate 0.3s ease-in-out infinite; }
        @keyframes logoVibrate {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px) rotateZ(-1deg); }
          75% { transform: translateX(1px) rotateZ(1deg); }
        }
      `}</style>

      {/* Desktop Header */}
      {!hideNavigation && user && (
        <header className={`hidden md:block border-b transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white/80 backdrop-blur-lg border-yellow-200"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link to={createPageUrl("Dashboard")} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg logo-pulse logo-vibrate transition-all duration-300">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <span className="text-xl font-semibold">Dilse</span>
                </Link>
                <div className="flex items-center space-x-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={createPageUrl(item.href)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname.includes(createPageUrl(item.href))
                          ? "bg-yellow-100 text-yellow-800 dark:bg-gray-700 dark:text-yellow-400"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full"><Sun className="w-4 h-4 dark:hidden" /><Moon className="w-4 h-4 hidden dark:block" /></Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full"><LogOut className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={`pb-20 md:pb-0 ${hideNavigation ? "" : "pt-0 md:pt-0"}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {!hideNavigation && !isChatPage && user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg z-50">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={createPageUrl(item.href)}
                className={`flex flex-col items-center justify-center space-y-1 w-full transition-colors ${
                  location.pathname.includes(createPageUrl(item.href))
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}