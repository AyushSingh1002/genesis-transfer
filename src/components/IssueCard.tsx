import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User, Calendar, MapPin, CheckCircle, Clock, Play } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  reporter: string;
  date: string;
  unit: string;
  description: string;
  category: string;
  status: "pending" | "in-progress" | "resolved";
}

interface IssueCardProps {
  issue: Issue;
  onStatusChange?: (issueId: string, newStatus: "pending" | "in-progress" | "resolved") => void;
}

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  low: "bg-green-100 text-green-800 border-green-200"
};

const statusColors = {
  pending: "bg-gray-100 text-gray-800 border-gray-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200"
};

const IssueCard = ({ issue, onStatusChange }: IssueCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Play className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'in-progress';
      case 'in-progress': return 'resolved';
      default: return 'pending';
    }
  };

  const getStatusActionText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'Start Work';
      case 'in-progress': return 'Mark Resolved';
      case 'resolved': return 'Reopen';
      default: return 'Update Status';
    }
  };
  return (
    <Card className="border border-border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">{issue.title}</h3>
          </div>
          <Badge className={priorityColors[issue.priority]}>
            {issue.priority}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{issue.reporter}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{issue.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{issue.unit}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {issue.category}
          </Badge>
          <div className="flex items-center gap-2">
            <Badge className={statusColors[issue.status || 'pending']}>
              <div className="flex items-center gap-1">
                {getStatusIcon(issue.status || 'pending')}
                {issue.status ? issue.status.charAt(0).toUpperCase() + issue.status.slice(1) : 'Pending'}
              </div>
            </Badge>
            {onStatusChange && issue.status !== 'resolved' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(issue.id, getNextStatus(issue.status || 'pending') as "pending" | "in-progress" | "resolved")}
              >
                {getStatusActionText(issue.status || 'pending')}
              </Button>
            )}
            {onStatusChange && issue.status === 'resolved' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(issue.id, 'pending')}
              >
                Reopen
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;