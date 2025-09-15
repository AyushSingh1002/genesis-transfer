import { Clock, Play, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  issues: any[];
  loading?: boolean;
}

const StatsCards = ({ issues, loading = false }: StatsCardsProps) => {
  const stats = [
    {
      title: "Pending Issues",
      value: loading ? null : issues.filter(issue => issue.status === "pending").length.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "In Progress", 
      value: loading ? null : issues.filter(issue => issue.status === "in-progress").length.toString(),
      icon: Play,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Resolved",
      value: loading ? null : issues.filter(issue => issue.status === "resolved").length.toString(), 
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "High Priority",
      value: loading ? null : issues.filter(issue => issue.priority === "high").length.toString(),
      icon: AlertTriangle,
      color: "text-red-600", 
      bgColor: "bg-red-50"
    }
  ];
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
                <p className="text-2xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;