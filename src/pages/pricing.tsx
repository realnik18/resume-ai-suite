import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individual job seekers',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: [
      '1 resume',
      '3 AI improvements per month',
      'Basic ATS score',
      'Cover letter generator',
      'Email support'
    ],
    limitations: [
      'No PDF/DOCX export',
      'No job tracker',
      'No team features'
    ],
    cta: 'Start Free',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious job seekers',
    price: {
      monthly: 19,
      yearly: 190
    },
    features: [
      '5 resumes',
      'Unlimited AI improvements',
      'Advanced ATS insights',
      'Multi-language cover letters',
      'Job application tracker',
      'PDF & DOCX export',
      'Priority email support'
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For teams and organizations',
    price: {
      monthly: 49,
      yearly: 490
    },
    features: [
      '20 resumes per user',
      'Team workspace (5 seats)',
      'Shared resume templates',
      'Advanced ATS insights',
      'Team collaboration tools',
      'Custom branding',
      'Priority phone support',
      'Dedicated account manager'
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const handleUpgrade = (planId: string) => {
    // TODO: Integrate with Stripe
    console.log(`Upgrading to ${planId} - ${isYearly ? 'yearly' : 'monthly'}`);
    // For now, show a placeholder modal or redirect to sign up
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Choose your plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free and upgrade as you grow. All plans include our core AI-powered features.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={cn('text-sm', !isYearly ? 'font-medium' : 'text-muted-foreground')}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={cn('text-sm', isYearly ? 'font-medium' : 'text-muted-foreground')}>
              Yearly
            </span>
            <Badge variant="secondary" className="ml-2">
              2 months free
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                'relative',
                plan.popular && 'border-brand shadow-brand scale-105'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-brand text-brand-foreground px-3 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-muted-foreground ml-1">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {isYearly && plan.price.monthly > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ${plan.price.monthly}/month billed annually
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 mb-8">
                  {/* Features */}
                  <div>
                    <h4 className="font-medium mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 text-muted-foreground">Not included:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <X className="h-4 w-4 flex-shrink-0" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* CTA Button */}
                {plan.id === 'starter' ? (
                  <Link to="/auth/sign-up" className="w-full">
                    <Button className="w-full" variant="outline">
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className={cn(
                      'w-full',
                      plan.popular && 'shadow-brand'
                    )}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {plan.cta}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare all features</h2>
            <p className="text-muted-foreground">
              Everything you need to know about what's included in each plan.
            </p>
          </div>
          
          <div className="bg-background rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Features</th>
                    <th className="text-center p-4 font-medium">Starter</th>
                    <th className="text-center p-4 font-medium">Pro</th>
                    <th className="text-center p-4 font-medium">Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-4">Number of resumes</td>
                    <td className="p-4 text-center">1</td>
                    <td className="p-4 text-center">5</td>
                    <td className="p-4 text-center">20 per user</td>
                  </tr>
                  <tr>
                    <td className="p-4">AI improvements</td>
                    <td className="p-4 text-center">3/month</td>
                    <td className="p-4 text-center">Unlimited</td>
                    <td className="p-4 text-center">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4">ATS score & insights</td>
                    <td className="p-4 text-center">Basic</td>
                    <td className="p-4 text-center">Advanced</td>
                    <td className="p-4 text-center">Advanced</td>
                  </tr>
                  <tr>
                    <td className="p-4">Cover letter generator</td>
                    <td className="p-4 text-center"><Check className="h-4 w-4 mx-auto text-green-600" /></td>
                    <td className="p-4 text-center"><Check className="h-4 w-4 mx-auto text-green-600" /></td>
                    <td className="p-4 text-center"><Check className="h-4 w-4 mx-auto text-green-600" /></td>
                  </tr>
                  <tr>
                    <td className="p-4">Job application tracker</td>
                    <td className="p-4 text-center"><X className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                    <td className="p-4 text-center"><Check className="h-4 w-4 mx-auto text-green-600" /></td>
                    <td className="p-4 text-center"><Check className="h-4 w-4 mx-auto text-green-600" /></td>
                  </tr>
                  <tr>
                    <td className="p-4">PDF & DOCX export</td>
                    <td className="p-4 text-center"><X className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                    <td className="p-4 text-center"><Check className="h-4 w-4 mx-auto text-green-600" /></td>
                    <td className="p-4 text-center"><Check className="h-4 w-4 mx-auto text-green-600" /></td>
                  </tr>
                  <tr>
                    <td className="p-4">Team collaboration</td>
                    <td className="p-4 text-center"><X className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                    <td className="p-4 text-center"><X className="h-4 w-4 mx-auto text-muted-foreground" /></td>
                    <td className="p-4 text-center">5 seats</td>
                  </tr>
                  <tr>
                    <td className="p-4">Priority support</td>
                    <td className="p-4 text-center">Email</td>
                    <td className="p-4 text-center">Email</td>
                    <td className="p-4 text-center">Phone + Email</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions about pricing?</h2>
          <p className="text-muted-foreground mb-8">
            We're here to help. Contact our sales team for custom pricing or enterprise solutions.
          </p>
          <Link to="/contact">
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}