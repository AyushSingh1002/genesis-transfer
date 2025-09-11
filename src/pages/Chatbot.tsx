import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Sparkles, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isAnimating?: boolean;
}

const Chatbot = () => {
  const { user, userProfile, isGuest } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hi${isGuest ? '' : `, ${userProfile?.fullName || 'there'}`}! I'm your Owners Hub assistant. I can answer questions about your app data (like payments) and help you navigate to sections such as Payments, Residents, or the Dashboard.${isGuest ? ' Note: You\'re browsing as a guest with limited access.' : ''}`,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentsData, setPaymentsData] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsRef = collection(db, "payments");
        const q = query(paymentsRef, orderBy("created_at", "desc"));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
        setPaymentsData(docs);
      } catch (err) {
        console.error("Failed to load payments for chatbot context", err);
      }
    };
    fetchPayments();
  }, []);

  const coerceDate = (value: any): Date => {
    if (!value) return new Date(0);
    if (typeof value === "string") return new Date(value);
    // Firestore Timestamp
    if (value?.toDate) return value.toDate();
    try {
      return new Date(value);
    } catch {
      return new Date(0);
    }
  };

  const answerFromData = (question: string): string | null => {
    const q = question.toLowerCase();

    // Payments intents
    if (q.includes("last payment") || q.includes("recent payment")) {
      if (!paymentsData.length) return "I couldn't find any payments yet.";
      const latest = [...paymentsData].sort((a, b) => coerceDate(b.created_at).getTime() - coerceDate(a.created_at).getTime())[0];
      const dt = coerceDate(latest.created_at);
      const name = latest.customer_name || "Unknown Customer";
      const amount = Number(latest.amount) || 0;
      return `Your most recent payment is ₹${amount.toLocaleString()} from ${name} on ${dt.toLocaleDateString()} at ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
    }

    if (q.includes("how many payments") || q.includes("number of payments") || q.includes("payments count")) {
      return `I found ${paymentsData.length} payment${paymentsData.length === 1 ? '' : 's'}.`;
    }

    if (q.includes("total paid") || q.includes("total amount") || q.includes("sum of payments") || q.includes("total revenue")) {
      const total = paymentsData.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
      return `Your total recorded payments sum to ₹${total.toLocaleString()}.`;
    }

    if (q.includes("status")) {
      const statusMatch = q.match(/status\s+of\s+(.*)/);
      if (statusMatch) {
        const name = statusMatch[1].trim();
        const byName = paymentsData.filter(p => (p.customer_name || "").toLowerCase().includes(name));
        if (!byName.length) return `I couldn't find payments for ${name}.`;
        const statuses = byName.map(p => p.status || "unknown");
        const unique = Array.from(new Set(statuses));
        return `${name} has payment status${unique.length > 1 ? 'es' : ''}: ${unique.join(', ')}.`;
      }
    }

    // Help intent
    if (q.includes("help") || q.includes("what can you do") || q.includes("how do i")) {
      return "I can answer questions about your payments, like: 'last payment', 'how many payments', 'total paid', or 'status of <customer>'.";
    }

    return null;
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content: `Hi${isGuest ? '' : `, ${userProfile?.fullName || 'there'}`}! I'm your Owners Hub assistant. I can answer questions about your app data (like payments) and help you navigate to sections such as Payments, Residents, or the Dashboard.${isGuest ? ' Note: You\'re browsing as a guest with limited access.' : ''}`,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      isAnimating: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Remove animation class after animation completes
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, isAnimating: false } : msg
        )
      );
    }, 300);

    try {
      const dataAnswer = answerFromData(inputMessage);
      const responseText = dataAnswer ?? (isGuest ? 
        "As a guest, you have limited access. For personalized assistance and full features, please create an account!" :
        `I can help with your account data${userProfile?.fullName ? `, ${userProfile.fullName}` : ''}. Try asking: 'last payment', 'how many payments', 'total paid', or 'status of <customer>'.`);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: "bot",
        timestamp: new Date(),
        isAnimating: true,
      };

      setMessages((prev) => [...prev, botMessage]);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === botMessage.id ? { ...msg, isAnimating: false } : msg))
        );
      }, 300);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I hit an unexpected error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQuestions = isGuest ? [
    "What features does CoHub offer?",
    "How do I create an account?",
    "What are the benefits of signing up?",
    "Open Dashboard",
    "Open Residents",
    "Open Payments"
  ] : [
    "Show my latest payment",
    "How many payments are recorded?",
    "What is the total amount collected?",
    "What is the status of John Smith's payment?",
    "Open Payments",
    "Open Residents",
    "Open Dashboard"
  ];

  const maybeNavigate = (text: string): boolean => {
    const q = text.toLowerCase();
    if (q.includes("open payments") || q.includes("go to payments") || q.includes("navigate to payments")) {
      navigate("/payments");
      return true;
    }
    if (q.includes("open residents") || q.includes("go to residents") || q.includes("navigate to residents")) {
      navigate("/residents");
      return true;
    }
    if (q.includes("open dashboard") || q.includes("go to dashboard") || q.includes("navigate to dashboard")) {
      navigate("/");
      return true;
    }
    return false;
  };

  const handleSuggestionClick = (text: string) => {
    if (!maybeNavigate(text)) {
      setInputMessage(text);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-6 h-[calc(100vh-180px)] flex flex-col">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-8 w-8 text-primary" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Powered by Gemini
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {messages.length - 1} messages
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        <Card className="flex-1 mb-4 overflow-hidden shadow-lg border-border/50">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 ${
                    message.sender === "user" ? "flex-row-reverse" : ""
                  } ${
                    message.isAnimating ? "animate-fade-in" : ""
                  }`}
                >
                  <Avatar className={`h-10 w-10 flex-shrink-0 ring-2 ring-offset-2 ${
                    message.sender === "user" 
                      ? "ring-primary/20 ring-offset-background" 
                      : "ring-muted ring-offset-background"
                  }`}>
                    <AvatarFallback className={`${
                      message.sender === "user"
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                        : "bg-gradient-to-br from-muted to-muted/80"
                    }`}>
                      {message.sender === "user" ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5 text-primary" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 max-w-[85%] ${
                    message.sender === "user" ? "text-right" : ""
                  }`}>
                    <div className={`group relative ${
                      message.sender === "user" ? "ml-auto" : ""
                    }`}>
                      <div className={`
                        relative rounded-2xl px-4 py-3 text-sm shadow-sm
                        ${message.sender === "user"
                          ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto"
                          : "bg-gradient-to-br from-muted/50 to-muted text-foreground border border-border/50"
                        }
                        hover:shadow-md transition-all duration-200
                      `}>
                        <p className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </p>
                        
                        {/* Message tail */}
                        <div className={`absolute top-4 w-3 h-3 rotate-45 ${
                          message.sender === "user"
                            ? "-right-1 bg-gradient-to-br from-primary to-primary/90"
                            : "-left-1 bg-gradient-to-br from-muted/50 to-muted border-l border-t border-border/50"
                        }`} />
                      </div>
                      
                      <div className={`flex items-center gap-2 mt-2 text-xs text-muted-foreground ${
                        message.sender === "user" ? "justify-end" : ""
                      }`}>
                        <MessageCircle className="h-3 w-3" />
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-4 animate-fade-in">
                  <Avatar className="h-10 w-10 ring-2 ring-muted ring-offset-2 ring-offset-background">
                    <AvatarFallback className="bg-gradient-to-br from-muted to-muted/80">
                      <Bot className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gradient-to-br from-muted/50 to-muted rounded-2xl px-4 py-3 border border-border/50 relative">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                    <div className="absolute top-4 -left-1 w-3 h-3 rotate-45 bg-gradient-to-br from-muted/50 to-muted border-l border-t border-border/50" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions (show when chat is empty) */}
            {messages.length === 1 && !isLoading && (
              <div className="p-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-3">Try these app-specific prompts or quick actions:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(question)}
                      className="justify-start h-auto py-2 px-3 text-left whitespace-normal hover:bg-muted/50"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Input Container */}
        <Card className="shadow-lg border-border/50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Shift + Enter for new line)"
                  disabled={isLoading}
                  className="min-h-[44px] max-h-32 resize-none pr-12 bg-background border-border/50 focus:border-primary/50 transition-colors"
                  rows={1}
                />
                <div className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                  {inputMessage.length}/2000
                </div>
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading || inputMessage.length > 2000}
                size="icon"
                className="flex-shrink-0 h-11 w-11 rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Chatbot;