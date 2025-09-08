import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Sparkles, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isAnimating?: boolean;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant powered by Google Gemini. I'm here to help you with questions, provide information, assist with tasks, and have meaningful conversations. What would you like to know or discuss today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your AI assistant powered by Google Gemini. I'm here to help you with questions, provide information, assist with tasks, and have meaningful conversations. What would you like to know or discuss today?",
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
      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: { message: inputMessage },
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry, I couldn't process that request.",
        sender: "bot",
        timestamp: new Date(),
        isAnimating: true,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Remove animation class after animation completes
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id ? { ...msg, isAnimating: false } : msg
          )
        );
      }, 300);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
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

  const suggestedQuestions = [
    "What can you help me with?",
    "Tell me about the latest technology trends",
    "Help me write a professional email",
    "Explain quantum computing simply"
  ];

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
                <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(question)}
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