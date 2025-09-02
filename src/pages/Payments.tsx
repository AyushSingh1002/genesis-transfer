import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
}

const Payments = () => {
  const [payments, setPayments] = useState<PaymentDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

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
      const transformedPayments: PaymentDisplay[] = (data || []).map((payment: Payment) => {
        const createdAt = new Date(payment.created_at);
        
        return {
          id: payment.id,
          type: Math.random() > 0.5 ? "received" : "sent", // Random for demo
          amount: payment.amount / 100, // Convert from cents
          name: payment.customer_name || "Unknown Customer",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${payment.customer_name || payment.id}`,
          date: createdAt.toLocaleDateString(),
          time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });

      setPayments(transformedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading payments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Payments</h1>
          <p className="text-muted-foreground">View all your payment transactions</p>
        </div>

        {payments.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-muted-foreground">No payments found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card 
                key={payment.id} 
                className="hover:shadow-md transition-all duration-200 hover:scale-[1.01] border border-border"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={payment.avatar} alt={payment.name} />
                        <AvatarFallback className="bg-muted">
                          {payment.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{payment.name}</h3>
                          <Badge 
                            variant={payment.type === "received" ? "default" : "secondary"}
                            className={`
                              flex items-center gap-1 text-xs
                              ${payment.type === "received" 
                                ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                              }
                            `}
                          >
                            {payment.type === "received" ? (
                              <ArrowDownLeft className="h-3 w-3" />
                            ) : (
                              <ArrowUpRight className="h-3 w-3" />
                            )}
                            {payment.type === "received" ? "Received" : "Sent"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{payment.date}</span>
                          <span>•</span>
                          <span>{payment.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xl font-bold ${
                        payment.type === "received" 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {payment.type === "received" ? "+" : "-"}₹{payment.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Payments;