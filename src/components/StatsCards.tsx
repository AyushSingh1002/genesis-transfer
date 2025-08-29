import { Clock, Play, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Pending Issues",
    value: "5",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    title: "In Progress", 
    value: "0",
    icon: Play,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Resolved",
    value: "0", 
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "High Priority",
    value: "2",
    icon: AlertTriangle,
    color: "text-red-600", 
    bgColor: "bg-red-50"
  }
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;