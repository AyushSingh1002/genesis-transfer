import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2, Search, TrendingUp, TrendingDown, Wallet, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customer_name: string | null;
  created_at: string;
  metadata: any;
}

interface PaymentDisplay {
  id: string;
  type: "sent" | "received";
  amount: number;
  name: string;
  avatar: string;
  date: string;
  time: string;
  currency: string;
  rawDate: Date;
}

interface PaymentStats {
  totalSent: number;
  totalReceived: number;
  balance: number;
  totalTransactions: number;
}

const Payments = () => {
  const [payments, setPayments] = useState<PaymentDisplay[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState<PaymentStats>({ totalSent: 0, totalReceived: 0, balance: 0, totalTransactions: 0 });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, activeTab]);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        return;
      }

      // Transform the data to match the required structure
      const transformedPayments: PaymentDisplay[] = (data || []).map((payment: Payment, index: number) => {
        const createdAt = new Date(payment.created_at);
        const isReceived = index % 2 === 0; // Alternate for demo
        
        return {
          id: payment.id,
          type: isReceived ? "received" : "sent",
          amount: payment.amount / 100, // Convert from cents
          name: payment.customer_name || `Customer ${index + 1}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${payment.customer_name || payment.id}`,
          date: createdAt.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          }),
          time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          currency: payment.currency || 'INR',
          rawDate: createdAt
        };
      });

      setPayments(transformedPayments);
      calculateStats(transformedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (paymentData: PaymentDisplay[]) => {
    const totalSent = paymentData
      .filter(p => p.type === "sent")
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalReceived = paymentData
      .filter(p => p.type === "received")
      .reduce((sum, p) => sum + p.amount, 0);

    setStats({
      totalSent,
      totalReceived,
      balance: totalReceived - totalSent,
      totalTransactions: paymentData.length
    });
  };

  const filterPayments = () => {
    let filtered = payments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm)
      );
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(payment => payment.type === activeTab);
    }

    setFilteredPayments(filtered);
  };

  const groupPaymentsByDate = (payments: PaymentDisplay[]) => {
    const groups: { [key: string]: PaymentDisplay[] } = {};
    
    payments.forEach(payment => {
      const dateKey = payment.rawDate.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(payment);
    });

    return Object.entries(groups).sort((a, b) => 
      new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 animate-fade-in">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg text-muted-foreground">Loading payments...</span>
        </div>
      </div>
    );
  }

  const groupedPayments = groupPaymentsByDate(filteredPayments);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Payments
          </h1>
          <p className="text-muted-foreground text-lg">Track your financial transactions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-success border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">Total Received</p>
                  <p className="text-2xl font-bold text-white">₹{stats.totalReceived.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-warning border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">Total Sent</p>
                  <p className="text-2xl font-bold text-white">₹{stats.totalSent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-primary border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">Balance</p>
                  <p className={`text-2xl font-bold text-white`}>
                    ₹{Math.abs(stats.balance).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-subtle border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ArrowDownLeft className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Transactions</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border focus:ring-primary"
            />
          </div>
          
          <Button variant="outline" className="gap-2 transition-all hover:scale-105">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Payments
            </TabsTrigger>
            <TabsTrigger value="received" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
              Received
            </TabsTrigger>
            <TabsTrigger value="sent" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
              Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 mt-6">
            {filteredPayments.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-subtle border-dashed border-2">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Wallet className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">No payments found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Try adjusting your search terms" : "Your payment history will appear here"}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-8">
                {groupedPayments.map(([dateKey, dayPayments]) => (
                  <div key={dateKey} className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {new Date(dateKey).toLocaleDateString('en-IN', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                      <div className="h-px bg-border flex-1" />
                      <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {dayPayments.length} transaction{dayPayments.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {dayPayments.map((payment) => (
                        <Card 
                          key={payment.id} 
                          className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border bg-card/50 backdrop-blur-sm"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 border-2 border-border group-hover:scale-110 transition-transform">
                                  <AvatarImage src={payment.avatar} alt={payment.name} />
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {payment.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-foreground text-lg">{payment.name}</h3>
                                    <Badge 
                                      variant="outline"
                                      className={`
                                        flex items-center gap-1.5 px-3 py-1 font-medium transition-colors
                                        ${payment.type === "received" 
                                          ? "bg-success/10 text-success border-success/30 hover:bg-success/20" 
                                          : "bg-warning/10 text-warning border-warning/30 hover:bg-warning/20"
                                        }
                                      `}
                                    >
                                      {payment.type === "received" ? (
                                        <ArrowDownLeft className="h-3.5 w-3.5" />
                                      ) : (
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                      )}
                                      {payment.type === "received" ? "Received" : "Sent"}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{payment.time}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className={`text-2xl font-bold transition-colors ${
                                  payment.type === "received" 
                                    ? "text-success" 
                                    : "text-warning"
                                }`}>
                                  {payment.type === "received" ? "+" : "-"}₹{payment.amount.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {payment.currency || 'INR'}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Payments;