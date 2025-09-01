import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Phone, Mail, MapPin } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";

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
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Total Residents</p>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">10</p>
                <p className="text-sm text-muted-foreground">Active Leases</p>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">1</p>
                <p className="text-sm text-muted-foreground">Notice Given</p>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-sm text-muted-foreground">Rent Overdue</p>
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-6" size="lg">
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
            <Card key={resident.id} className="w-full">
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
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Lease ends: {resident.leaseEnd}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Residents;