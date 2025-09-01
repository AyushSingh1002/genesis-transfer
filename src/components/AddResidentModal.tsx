import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddResidentModal = ({ isOpen, onClose }: AddResidentModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    unit: "",
    leaseStart: "",
    leaseEnd: "",
    monthlyRent: "",
    securityDeposit: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log("New resident:", formData);
    
    toast({
      title: "Resident Added",
      description: "New resident has been successfully added to your property.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      unit: "",
      leaseStart: "",
      leaseEnd: "",
      monthlyRent: "",
      securityDeposit: ""
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Resident</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="John Smith"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit Assignment</Label>
            <Select onValueChange={(value) => handleInputChange("unit", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1A">Unit 1A</SelectItem>
                <SelectItem value="1B">Unit 1B</SelectItem>
                <SelectItem value="2A">Unit 2A</SelectItem>
                <SelectItem value="2B">Unit 2B</SelectItem>
                <SelectItem value="3A">Unit 3A</SelectItem>
                <SelectItem value="3B">Unit 3B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leaseStart">Lease Start Date</Label>
              <Input
                id="leaseStart"
                type="date"
                value={formData.leaseStart}
                onChange={(e) => handleInputChange("leaseStart", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leaseEnd">Lease End Date</Label>
              <Input
                id="leaseEnd"
                type="date"
                value={formData.leaseEnd}
                onChange={(e) => handleInputChange("leaseEnd", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
              <Input
                id="monthlyRent"
                type="number"
                value={formData.monthlyRent}
                onChange={(e) => handleInputChange("monthlyRent", e.target.value)}
                placeholder="2500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
              <Input
                id="securityDeposit"
                type="number"
                value={formData.securityDeposit}
                onChange={(e) => handleInputChange("securityDeposit", e.target.value)}
                placeholder="2500"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Resident
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResidentModal;