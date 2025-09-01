import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, TrendingUp, Users, Home } from "lucide-react";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import IssueCard from "@/components/IssueCard";
import BottomNavigation from "@/components/BottomNavigation";

type Status = "pending" | "in-progress" | "resolved";

const mockIssues = [
  {
    id: "1",
    title: "AC Unit Maintenance", 
    priority: "high" as const,
    reporter: "Property Manager",
    date: "8/27/2025",
    unit: "Unit 3A",
    description: "Annual AC maintenance required",
    category: "Maintenance",
    status: "pending" as Status
  },
  {
    id: "2", 
    title: "Lease Renewal",
    priority: "medium" as const,
    reporter: "John Smith",
    date: "8/26/2025", 
    unit: "Unit 2B",
    description: "Tenant requesting lease renewal",
    category: "Administrative",
    status: "in-progress" as Status
  },
  {
    id: "3",
    title: "Property Inspection",
    priority: "low" as const,
    reporter: "Inspector",
    date: "8/22/2025",
    unit: "Unit 1C", 
    description: "Quarterly property inspection",
    category: "Inspection",
    status: "resolved" as Status
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredIssues = mockIssues.filter(issue => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return issue.status === "pending";
    if (activeTab === "in-progress") return issue.status === "in-progress";
    if (activeTab === "resolved") return issue.status === "resolved";
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Property Dashboard</h1>
          <p className="text-muted-foreground mb-6">Overview of your rental properties</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Properties</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupied Units</p>
                  <p className="text-2xl font-bold text-foreground">10</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-foreground">$24,500</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StatsCards />

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-6" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Add New Property
        </Button>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;