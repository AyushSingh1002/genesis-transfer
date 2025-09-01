import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Phone, Mail, MapPin, Calendar } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import AddResidentModal from "@/components/AddResidentModal";

const mockResidents = [
  {
    id: "1",
    name: "John Smith",
    unit: "Unit 3A",
    phone: "+1 (555) 123-4567",
    email: "john.smith@email.com",
    leaseEnd: "Dec 2025",
    status: "active" as const,
    rentPaid: true
  },
  {
    id: "2",
    name: "Sarah Johnson",
    unit: "Unit 2B", 
    phone: "+1 (555) 987-6543",
    email: "sarah.j@email.com",
    leaseEnd: "Mar 2026",
    status: "active" as const,
    rentPaid: false
  },
  {
    id: "3",
    name: "Mike Chen",
    unit: "Unit 1C",
    phone: "+1 (555) 456-7890", 
    email: "mike.chen@email.com",
    leaseEnd: "Aug 2025",
    status: "notice" as const,
    rentPaid: true
  },
  {
    id: "4",
    name: "Emma Wilson",
    unit: "Unit 4D",
    phone: "+1 (555) 321-0987",
    email: "emma.w@email.com", 
    leaseEnd: "Jan 2026",
    status: "active" as const,
    rentPaid: true
  }
];

const Residents = () => {
  const [filter, setFilter] = useState("all");
  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);

  const filteredResidents = mockResidents.filter(resident => {
    if (filter === "all") return true;
    if (filter === "active") return resident.status === "active";
    if (filter === "notice") return resident.status === "notice";
    if (filter === "unpaid") return !resident.rentPaid;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "notice": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Residents</h1>
          <p className="text-muted-foreground mb-6">Manage your property residents</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 transition-all hover:shadow-lg">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">12</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Residents</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800 transition-all hover:shadow-lg">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">10</p>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Active Leases</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 transition-all hover:shadow-lg">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">1</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Notice Given</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-800 transition-all hover:shadow-lg">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">1</p>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">Rent Overdue</p>
              </div>
            </div>
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground mb-6 shadow-lg transition-all hover:shadow-xl" 
          size="lg"
          onClick={() => setIsResidentModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Resident
        </Button>

        <div className="flex gap-2 mb-6 flex-wrap">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All Residents
          </Button>
          <Button 
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
            size="sm"
          >
            Active
          </Button>
          <Button 
            variant={filter === "notice" ? "default" : "outline"}
            onClick={() => setFilter("notice")}
            size="sm"
          >
            Notice Given
          </Button>
          <Button 
            variant={filter === "unpaid" ? "default" : "outline"}
            onClick={() => setFilter("unpaid")}
            size="sm"
          >
            Rent Overdue
          </Button>
        </div>

        <div className="space-y-4">
          {filteredResidents.map((resident) => (
            <Card key={resident.id} className="w-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{resident.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{resident.unit}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(resident.status)}>
                      {resident.status === "active" ? "Active" : "Notice Given"}
                    </Badge>
                    {!resident.rentPaid && (
                      <Badge className="bg-red-100 text-red-800">Rent Overdue</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{resident.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{resident.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Lease ends: {resident.leaseEnd}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNavigation />
      <AddResidentModal 
        isOpen={isResidentModalOpen} 
        onClose={() => setIsResidentModalOpen(false)} 
      />
    </div>
  );
};

export default Residents;