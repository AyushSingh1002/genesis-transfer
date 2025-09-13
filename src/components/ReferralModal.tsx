import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Share2, Users, Gift, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReferralData {
  id: string;
  referral_code: string;
  created_at: string;
}

const ReferralModal = ({ isOpen, onClose }: ReferralModalProps) => {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const baseUrl = window.location.origin;
  const referralLink = referralData ? `${baseUrl}/auth?ref=${referralData.referral_code}` : '';

  useEffect(() => {
    if (isOpen && user) {
      fetchOrCreateReferral();
    }
  }, [isOpen, user]);

  const fetchOrCreateReferral = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First try to get existing referral
      const { data: existingReferral, error: fetchError } = await supabase
        .from('referrals')
        .select('*')
        .eq('user_id', user.uid)
        .single();

      if (existingReferral) {
        setReferralData(existingReferral);
      } else if (fetchError?.code === 'PGRST116') {
        // No referral exists, create one
        const { data: newReferral, error: createError } = await supabase.rpc('generate_referral_code');
        
        if (createError) throw createError;

        const { data: insertedReferral, error: insertError } = await supabase
          .from('referrals')
          .insert([{
            user_id: user.uid,
            referral_code: newReferral
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        setReferralData(insertedReferral);
      } else {
        throw fetchError;
      }
    } catch (error) {
      console.error('Error with referral:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      toast({
        title: "Copied!",
        description: `Referral ${type} copied to clipboard`,
      });
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const shareReferral = async () => {
    if (!referralData) return;

    const shareData = {
      title: 'Join CoHub - Property Management Made Easy',
      text: `Hi! I'm using CoHub for property management and loving it. Join using my referral code ${referralData.referral_code} and we both get rewards!`,
      url: referralLink,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers without native sharing
        await copyToClipboard(
          `${shareData.text}\n\n${shareData.url}`,
          'link'
        );
      }
    } catch (err) {
      console.error('Share failed:', err);
      // Fallback to copying
      await copyToClipboard(
        `Join CoHub using my referral: ${referralLink}`,
        'link'
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Refer a Friend
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Referral Info */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-sm">Share & Earn Rewards</h3>
                    <p className="text-xs text-muted-foreground">
                      Invite friends and both get premium benefits!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-primary">
                  <CheckCircle className="h-3 w-3" />
                  <span>Both get 1 month free premium</span>
                </div>
              </CardContent>
            </Card>

            {/* Referral Code */}
            <div className="space-y-2">
              <Label htmlFor="referral-code">Your Referral Code</Label>
              <div className="flex gap-2">
                <Input
                  id="referral-code"
                  value={referralData?.referral_code || ''}
                  readOnly
                  className="font-mono text-center text-lg font-bold bg-muted"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(referralData?.referral_code || '', 'code')}
                  className={`transition-all duration-200 ${
                    copySuccess ? 'bg-green-100 border-green-300' : ''
                  }`}
                >
                  {copySuccess ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Referral Link */}
            <div className="space-y-2">
              <Label htmlFor="referral-link">Referral Link</Label>
              <div className="flex gap-2">
                <Input
                  id="referral-link"
                  value={referralLink}
                  readOnly
                  className="text-sm bg-muted"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(referralLink, 'link')}
                  className={`transition-all duration-200 ${
                    copySuccess ? 'bg-green-100 border-green-300' : ''
                  }`}
                >
                  {copySuccess ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={shareReferral} 
                className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Now
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open(referralLink, '_blank')}
                size="icon"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            {/* Instructions */}
            <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded-lg">
              <p className="font-medium">How it works:</p>
              <ul className="space-y-1 ml-4">
                <li>• Share your code or link with friends</li>
                <li>• They sign up using your referral</li>
                <li>• Both get 1 month of premium features</li>
                <li>• Start earning rewards today!</li>
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReferralModal;