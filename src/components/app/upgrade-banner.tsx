import { useState } from 'react';
import { Crown, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface UpgradeBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export function UpgradeBanner({ onDismiss, className }: UpgradeBannerProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgrade = (plan: 'pro' | 'business') => {
    // TODO: Integrate with Stripe Checkout
    console.log(`Upgrading to ${plan}`);
    setShowUpgradeModal(false);
  };

  return (
    <>
      <Card className={`border-brand/20 bg-brand/5 ${className}`}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center">
              <Crown className="h-4 w-4 text-brand" />
            </div>
            <div>
              <p className="font-medium text-sm">
                Unlock unlimited AI improvements
              </p>
              <p className="text-xs text-muted-foreground">
                Upgrade to Pro for advanced features and exports
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              onClick={() => setShowUpgradeModal(true)}
              className="shadow-brand"
            >
              Upgrade
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
            {onDismiss && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-brand" />
              Choose Your Plan
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Pro Plan */}
            <Card className="border-brand/20 hover:border-brand/40 transition-colors cursor-pointer"
                  onClick={() => handleUpgrade('pro')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Pro</h3>
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$19</div>
                    <div className="text-xs text-muted-foreground">/month</div>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 5 resumes</li>
                  <li>• Unlimited AI improvements</li>
                  <li>• PDF & DOCX export</li>
                  <li>• Job tracker</li>
                </ul>
              </CardContent>
            </Card>

            {/* Business Plan */}
            <Card className="border-muted hover:border-muted-foreground/40 transition-colors cursor-pointer"
                  onClick={() => handleUpgrade('business')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Business</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$49</div>
                    <div className="text-xs text-muted-foreground">/month</div>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 20 resumes per user</li>
                  <li>• Team workspace (5 seats)</li>
                  <li>• Custom branding</li>
                  <li>• Priority support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            TODO: Integrate with Stripe Checkout
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}