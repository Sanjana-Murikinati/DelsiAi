import React from "react";
import { User } from "@/entities/User";
import { createPageUrl } from "@/utils";

export default function AuthPage() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    handleAuth();
  }, []);

  const handleAuth = async () => {
    try {
      const user = await User.me();
      if (user.onboarding_completed) {
        window.location.href = createPageUrl("Dashboard");
      } else {
        window.location.href = createPageUrl("Onboarding");
      }
    } catch (error) {
      // User not authenticated, redirect to login
      await User.login();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up your account...</p>
      </div>
    </div>
  );
}