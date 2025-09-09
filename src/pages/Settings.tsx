import { CreditCard, User, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";

const Settings = () => {
  const navigate = useNavigate();

  const settingsOptions = [
    {
      icon: CreditCard,
      title: "Subscription",
      description: "Manage your subscription plan and billing",
      onClick: () => navigate('/subscription')
    },
    {
      icon: User,
      title: "Profile",
      description: "Update your personal information",
      onClick: () => {}
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure your notification preferences",
      onClick: () => {}
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Manage your privacy and security settings",
      onClick: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid gap-4">
          {settingsOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={option.onClick}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <option.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Settings;