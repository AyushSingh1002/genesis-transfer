import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, TrendingUp, Users, Home, Activity } from "lucide-react";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import IssueCard from "@/components/IssueCard";
import BottomNavigation from "@/components/BottomNavigation";
import AddPropertyModal from "@/components/AddPropertyModal";

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
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Properties</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">12</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Occupied Units</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">10</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">$24,500</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Occupancy Rate</p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">83%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StatsCards />

        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground mb-6 shadow-lg transition-all hover:shadow-xl" 
          size="lg"
          onClick={() => setIsPropertyModalOpen(true)}
        >
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
      <AddPropertyModal 
        isOpen={isPropertyModalOpen} 
        onClose={() => setIsPropertyModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;