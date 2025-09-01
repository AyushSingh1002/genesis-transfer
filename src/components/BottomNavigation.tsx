import { BarChart3, Plus, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const BottomNavigation = () => {
  const navItems = [
    { icon: BarChart3, label: "Dashboard", active: true },
    { icon: Users, label: "Residents", active: false }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-1">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`flex flex-col items-center gap-1 py-3 h-auto ${
                item.active ? "text-primary" : "text-muted-foreground"
              }`}
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