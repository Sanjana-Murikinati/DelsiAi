
import React from "react";
import { Session } from "@/entities/Session";
import { InvokeLLM } from "@/integrations/Core";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  MicOff, 
  Square,
  Phone,
  MessageCircle,
  Volume2
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ChatPage() {
  const [user, setUser] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [inputMessage, setInputMessage] = React.useState("");
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isSessionActive, setIsSessionActive] = React.useState(false);
  const [sessionStartTime, setSessionStartTime] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [voiceMode, setVoiceMode] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");

  // Get mode from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'classic';

  const initializeSession = React.useCallback(() => {
    const welcomeMessage = mode === 'guided' 
      ? "Hello! I'm your AI therapist. I'll guide you through a structured session today. Let's start by understanding how you're feeling right now. On a scale of 1-10, how would you rate your current emotional state?"
      : "Hello! I'm here to listen and support you. Feel free to share whatever is on your mind today. How are you feeling?";

    setMessages([
      {
        id: 1,
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date()
      }
    ]);
  }, [mode]); // setMessages is a stable setter, so no need to include it.

  const loadUser = React.useCallback(async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      initializeSession();
    } catch (error) {
      window.location.href = createPageUrl("Home");
    }
  }, [initializeSession]); // setUser is a stable setter, so no need to include it.

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  const startSession = React.useCallback(() => {
    setIsSessionActive(true);
    setSessionStartTime(new Date());
  }, []); // setIsSessionActive and setSessionStartTime are stable setters.

  const endSession = React.useCallback(async () => {
    if (!isSessionActive || !sessionStartTime) return;

    const duration = Math.round((new Date() - sessionStartTime) / 1000 / 60);
    const conversationText = messages.map(m => 
      `${m.type === 'ai' ? 'AI' : 'User'}: ${m.content}`
    ).join('\n');

    // Generate session summary
    const summaryPrompt = `
    Analyze this therapy session and provide a brief summary and mood assessment:
    
    Session: ${conversationText}
    
    Provide a JSON response with:
    - summary: Brief session summary (2-3 sentences)
    - key_topics: Array of main topics discussed
    - mood_assessment: Estimated user mood after session (very_sad, sad, neutral, happy, very_happy)
    - recommended_activities: Array of 3 mood-boosting activities with descriptions
    `;

    try {
      setIsLoading(true);
      const analysisResult = await InvokeLLM({
        prompt: summaryPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_topics: { type: "array", items: { type: "string" }},
            mood_assessment: { 
              type: "string", 
              enum: ["very_sad", "sad", "neutral", "happy", "very_happy"]
            },
            recommended_activities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  activity: { type: "string" },
                  description: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Save session to database
      await Session.create({
        session_type: mode,
        mode: voiceMode ? 'voice' : 'text',
        duration_minutes: duration,
        mood_after: analysisResult.mood_assessment,
        summary: analysisResult.summary,
        key_topics: analysisResult.key_topics,
        recommended_activities: analysisResult.recommended_activities,
        transcript: conversationText
      });

      // Redirect to session report
      window.location.href = createPageUrl("SessionReport");
    } catch (error) {
      console.error("Error ending session:", error);
    }
    setIsLoading(false);
  }, [isSessionActive, sessionStartTime, messages, mode, voiceMode, setIsLoading]);

  const sendMessage = React.useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Start session on first user message
    if (!isSessionActive) {
      startSession();
    }

    try {
      // Create context for AI response
      const conversationContext = messages
        .slice(-6) // Last 6 messages for context
        .map(m => `${m.type === 'ai' ? 'Therapist' : 'User'}: ${m.content}`)
        .join('\n');

      const therapyPrompt = `
      You are an empathetic AI therapist. Respond to the user's message with professional warmth and therapeutic techniques.
      
      Mode: ${mode === 'guided' ? 'Guided therapy with structured approach' : 'Free-form supportive conversation'}
      User's focus areas: ${user?.expectations?.join(', ') || 'General support'}
      
      Recent conversation:
      ${conversationContext}
      
      User's new message: ${inputMessage}
      
      Provide a helpful, empathetic response (2-3 sentences). Use therapeutic techniques like:
      - Reflective listening
      - Open-ended questions
      - Validation of feelings
      - Gentle guidance toward insight
      `;

      const aiResponse = await InvokeLLM({
        prompt: therapyPrompt
      });

      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // If in voice mode, speak the response
      if (voiceMode && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
    }
    setIsLoading(false);
  }, [inputMessage, isLoading, messages, isSessionActive, voiceMode, user, mode, startSession, setInputMessage, setMessages, setIsLoading, setIsSpeaking]);

  const startVoiceRecording = React.useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition not supported in your browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceMode(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript);
      if (finalTranscript) {
        setInputMessage(prev => prev + finalTranscript);
        setTranscript("");
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    window.currentRecognition = recognition;
  }, [setIsListening, setVoiceMode, setTranscript, setInputMessage]); // All setters are stable.

  const stopVoiceRecording = React.useCallback(() => {
    if (window.currentRecognition) {
      window.currentRecognition.stop();
    }
    setIsListening(false);
  }, [setIsListening]); // setIsListening is a stable setter.

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

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          
          <div>
            <h1 className="text-lg font-semibold">AI Therapy Session</h1>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="secondary"
                className={mode === 'guided' ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}
              >
                {mode === 'guided' ? 'Guided' : 'Classic'} Mode
              </Badge>
              {voiceMode && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Volume2 className="w-3 h-3 mr-1" />
                  Voice
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isSessionActive && (
          <Button
            onClick={endSession}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Phone className="w-4 h-4 mr-2" />
            End Session
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card 
              className={`max-w-[80%] ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-white border-gray-200'
              }`}
            >
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-yellow-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Voice Visual Feedback */}
      {voiceMode && (
        <div className="flex justify-center p-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full border-4 border-purple-500 flex items-center justify-center mb-2 transition-all duration-300 ${
              isListening ? 'animate-pulse scale-110 bg-purple-100' : 'bg-white'
            } ${isSpeaking ? 'animate-bounce scale-105 bg-blue-100 border-blue-500' : ''}`}>
              {isListening ? (
                <Mic className="w-8 h-8 text-purple-500" />
              ) : isSpeaking ? (
                <Volume2 className="w-8 h-8 text-blue-500" />
              ) : (
                <MessageCircle className="w-8 h-8 text-gray-400" />
              )}
            </div>
            {transcript && (
              <p className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                "{transcript}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <Textarea
              placeholder="Share what's on your mind..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="min-h-[50px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={isListening ? stopVoiceRecording : startVoiceRecording}
              className={isListening ? "bg-red-50 border-red-200 text-red-600" : ""}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
