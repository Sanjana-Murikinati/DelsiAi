import React from "react";
import { User } from "@/entities/User";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const STEPS = [
  { id: "name", title: "What's your name?", subtitle: "Help us personalize your experience" },
  { id: "age", title: "What's your age range?", subtitle: "This helps us tailor our approach" },
  { id: "gender", title: "How do you identify?", subtitle: "Optional - helps us understand you better" },
  { id: "relationship", title: "Relationship status?", subtitle: "Understanding your social context" },
  { id: "expectations", title: "What brings you here?", subtitle: "Select all that apply to you" },
  { id: "complete", title: "You're all set!", subtitle: "Let's begin your healing journey" }
];

const AGE_OPTIONS = [
  { value: "under_18", label: "Under 18" },
  { value: "18_24", label: "18-24" },
  { value: "25_40", label: "25-40" },
  { value: "41_60", label: "41-60" },
  { value: "over_60", label: "Over 60" }
];

const GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" }
];

const RELATIONSHIP_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "in_relationship", label: "In a relationship" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "complicated", label: "It's complicated" }
];

const EXPECTATION_OPTIONS = [
  { value: "depression", label: "Depression", emoji: "😔" },
  { value: "anxiety", label: "Anxiety", emoji: "😰" },
  { value: "stress", label: "Stress Management", emoji: "😤" },
  { value: "motivation", label: "Motivation", emoji: "🚀" },
  { value: "relationships", label: "Relationships", emoji: "💝" },
  { value: "self_esteem", label: "Self Esteem", emoji: "💪" },
  { value: "sleep", label: "Sleep Issues", emoji: "😴" },
  { value: "other", label: "Other", emoji: "🤔" }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    full_name: "",
    age_range: "",
    gender: "",
    relationship_status: "",
    expectations: []
  });
  const [loading, setLoading] = React.useState(false);

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const step = STEPS[currentStep];

  const handleNext = async () => {
    if (currentStep === STEPS.length - 2) {
      // Last data step - save and complete onboarding
      setLoading(true);
      try {
        await User.updateMyUserData({
          ...formData,
          onboarding_completed: true
        });
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error("Error saving data:", error);
      }
      setLoading(false);
    } else if (currentStep === STEPS.length - 1) {
      // Complete step - redirect to dashboard
      window.location.href = createPageUrl("Dashboard");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExpectationToggle = (value) => {
    setFormData(prev => ({
      ...prev,
      expectations: prev.expectations.includes(value)
        ? prev.expectations.filter(e => e !== value)
        : [...prev.expectations, value]
    }));
  };

  const canProceed = () => {
    switch (step.id) {
      case "name": return formData.full_name.trim().length > 0;
      case "age": return formData.age_range;
      case "gender": return formData.gender;
      case "relationship": return formData.relationship_status;
      case "expectations": return formData.expectations.length > 0;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {step.title}
              </h1>
              <p className="text-gray-600">
                {step.subtitle}
              </p>
            </div>

            <div className="space-y-6">
              {step.id === "name" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="text-lg p-4 h-14"
                    autoFocus
                  />
                </div>
              )}

              {step.id === "age" && (
                <div className="grid grid-cols-1 gap-3">
                  {AGE_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={formData.age_range === option.value ? "default" : "outline"}
                      className={`h-14 text-left justify-start ${
                        formData.age_range === option.value 
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white" 
                          : "hover:bg-yellow-50"
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, age_range: option.value }))}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}

              {step.id === "gender" && (
                <div className="grid grid-cols-1 gap-3">
                  {GENDER_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={formData.gender === option.value ? "default" : "outline"}
                      className={`h-14 text-left justify-start ${
                        formData.gender === option.value 
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white" 
                          : "hover:bg-yellow-50"
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, gender: option.value }))}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}

              {step.id === "relationship" && (
                <div className="grid grid-cols-1 gap-3">
                  {RELATIONSHIP_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={formData.relationship_status === option.value ? "default" : "outline"}
                      className={`h-14 text-left justify-start ${
                        formData.relationship_status === option.value 
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white" 
                          : "hover:bg-yellow-50"
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, relationship_status: option.value }))}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}

              {step.id === "expectations" && (
                <div className="grid grid-cols-2 gap-3">
                  {EXPECTATION_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={formData.expectations.includes(option.value) ? "default" : "outline"}
                      className={`h-20 flex-col space-y-1 ${
                        formData.expectations.includes(option.value) 
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white" 
                          : "hover:bg-yellow-50"
                      }`}
                      onClick={() => handleExpectationToggle(option.value)}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </Button>
                  ))}
                </div>
              )}

              {step.id === "complete" && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Welcome to Dilse, {formData.full_name}!
                  </h2>
                  <p className="text-gray-600">
                    Your personalized therapy experience is ready. 
                    Let's start your journey towards better mental health.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || loading}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center space-x-2"
              >
                <span>
                  {step.id === "complete" ? "Enter Dilse" : "Continue"}
                </span>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            🔒 Your information is private and secure. 
            We never use your data to train our models.
          </p>
        </div>
      </div>
    </div>
  );
}