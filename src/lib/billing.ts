// ApplyPro AI Billing & Stripe Integration Layer
// Currently shows modals but ready for Stripe Checkout/Portal integration

import { supabase } from '@/lib/supabase.client';

export interface CheckoutParams {
  plan: 'pro' | 'business';
  interval?: 'monthly' | 'yearly';
  successUrl?: string;
  cancelUrl?: string;
}

export interface PortalParams {
  returnUrl?: string;
}

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

// Plan configurations matching pricing page
export const PLANS = {
  pro: {
    name: 'Pro',
    monthlyPrice: 19,
    yearlyPrice: 190,
    // TODO: Add actual Stripe price IDs when available
    stripePriceIds: {
      monthly: 'price_pro_monthly', // Replace with real Stripe price ID
      yearly: 'price_pro_yearly',   // Replace with real Stripe price ID
    },
    features: [
      '5 resumes',
      'Unlimited AI improvements',
      'Advanced ATS insights',
      'Multi-language cover letters',
      'Job application tracker',
      'PDF & DOCX export',
      'Priority email support'
    ]
  },
  business: {
    name: 'Business',
    monthlyPrice: 49,
    yearlyPrice: 490,
    stripePriceIds: {
      monthly: 'price_business_monthly', // Replace with real Stripe price ID
      yearly: 'price_business_yearly',   // Replace with real Stripe price ID
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
    ]
  }
} as const;

/**
 * Initialize Stripe Checkout session for subscription
 * TODO: Replace with actual Stripe integration
 */
export const openCheckout = async (params: CheckoutParams): Promise<void> => {
  // TODO: Replace with actual Stripe Checkout implementation
  // 
  // Step 1: Initialize Stripe
  // const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
  // if (!stripe) throw new Error('Stripe failed to load');
  // 
  // Step 2: Create checkout session via edge function
  // const { data, error } = await supabase.functions.invoke('create-checkout', {
  //   body: {
  //     priceId: PLANS[params.plan].stripePriceIds[params.interval || 'monthly'],
  //     successUrl: params.successUrl || `${SITE_URL}/billing/success`,
  //     cancelUrl: params.cancelUrl || `${SITE_URL}/pricing`,
  //   }
  // });
  // 
  // if (error) throw new Error(error.message);
  // 
  // Step 3: Redirect to Stripe Checkout
  // const { error: stripeError } = await stripe.redirectToCheckout({
  //   sessionId: data.sessionId,
  // });
  // 
  // if (stripeError) throw new Error(stripeError.message);

  // Mock implementation - show integration modal
  showIntegrationModal('checkout', params);
};

/**
 * Open Stripe Customer Portal for subscription management
 * TODO: Replace with actual Stripe integration
 */
export const openPortal = async (params: PortalParams = {}): Promise<void> => {
  // TODO: Replace with actual Stripe Portal implementation
  // 
  // const { data, error } = await supabase.functions.invoke('customer-portal', {
  //   body: {
  //     returnUrl: params.returnUrl || `${SITE_URL}/app/settings`,
  //   }
  // });
  // 
  // if (error) throw new Error(error.message);
  // 
  // // Redirect to Stripe Customer Portal
  // window.location.href = data.url;

  // Mock implementation - show integration modal
  showIntegrationModal('portal', params);
};

/**
 * Check current subscription status
 * TODO: Replace with Supabase + Stripe integration
 */
export const checkSubscription = async (): Promise<{
  subscribed: boolean;
  plan?: string;
  status?: string;
  currentPeriodEnd?: string;
}> => {
  // TODO: Replace with edge function call
  // const { data, error } = await supabase.functions.invoke('check-subscription');
  // if (error) throw new Error(error.message);
  // return data;

  // Mock implementation
  console.log('TODO: Implement subscription check via Supabase edge function');
  return {
    subscribed: false,
    plan: 'starter',
    status: 'active'
  };
};

/**
 * Get billing history/invoices
 * TODO: Integrate with Stripe billing APIs
 */
export const getBillingHistory = async (): Promise<any[]> => {
  // TODO: Replace with Stripe integration
  // const { data, error } = await supabase.functions.invoke('get-invoices');
  // if (error) throw new Error(error.message);
  // return data.invoices;

  // Mock implementation
  console.log('TODO: Implement billing history via Stripe API');
  return [];
};

/**
 * Temporary modal to show integration instructions
 * Remove this when real Stripe integration is complete
 */
const showIntegrationModal = (type: 'checkout' | 'portal', params: any) => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md mx-4 shadow-xl">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        ${type === 'checkout' ? 'Stripe Checkout' : 'Billing Portal'} Integration
      </h3>
      <div class="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
        <p><strong>Next Steps:</strong></p>
        <ol class="list-decimal list-inside space-y-1">
          <li>Connect your Supabase project</li>
          <li>Add your Stripe secret key to Supabase secrets</li>
          <li>Deploy edge functions for billing</li>
          <li>Update billing.ts to use real Stripe calls</li>
        </ol>
        <div class="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded">
          <p class="font-medium">Current request:</p>
          <pre class="text-xs mt-1">${JSON.stringify(params, null, 2)}</pre>
        </div>
      </div>
      <button 
        onclick="this.closest('.fixed').remove()" 
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
      >
        Got it
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (modal.parentNode) {
      modal.remove();
    }
  }, 10000);
};

// Expected server endpoints (to be implemented as Supabase Edge Functions)
export const BILLING_ENDPOINTS = {
  // POST /api/checkout - Create Stripe checkout session
  checkout: {
    method: 'POST',
    path: 'functions/v1/create-checkout',
    body: {
      priceId: 'string',
      successUrl: 'string',
      cancelUrl: 'string'
    },
    response: {
      sessionId: 'string',
      url: 'string'
    }
  },
  
  // POST /api/portal - Create Stripe customer portal session
  portal: {
    method: 'POST', 
    path: 'functions/v1/customer-portal',
    body: {
      returnUrl: 'string'
    },
    response: {
      url: 'string'
    }
  },

  // GET /api/subscription - Check current subscription status
  subscription: {
    method: 'GET',
    path: 'functions/v1/check-subscription',
    response: {
      subscribed: 'boolean',
      plan: 'string',
      status: 'string',
      currentPeriodEnd: 'string'
    }
  },

  // GET /api/invoices - Get billing history
  invoices: {
    method: 'GET',
    path: 'functions/v1/get-invoices',
    response: {
      invoices: 'array'
    }
  }
};

export default {
  openCheckout,
  openPortal,
  checkSubscription,
  getBillingHistory,
  PLANS,
  BILLING_ENDPOINTS
};