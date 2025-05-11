import { loadStripe } from '@stripe/stripe-js';

// Ensure the environment variable is defined
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  throw new Error('Stripe Publishable Key is not defined in environment variables');
}

// Initialize Stripe
export const stripePromise = loadStripe(stripeKey);