import { BarChart3, Users, CreditCard, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: BarChart3, label: "Dashboard", path: "/" },
    { icon: Users, label: "Residents", path: "/residents" },
    { icon: CreditCard, label: "Payments", path: "/payments" },
    { icon: Bot, label: "AI Chat", path: "/chatbot" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`flex flex-col items-center gap-1 py-3 h-auto ${
                location.pathname === item.path ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;