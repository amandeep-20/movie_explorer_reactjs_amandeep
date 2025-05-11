import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getSubscriptionStatus } from '../../utils/API';

type SubscriptionPlan = 'premium' | 'none';
interface SubscriptionStatusResponse {
  plan_type: SubscriptionPlan;
}

export const useSubscriptionStatus = () => {
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('none');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      const token = user?.token;

      if (!token) {
        setSubscriptionPlan('none');
        setLoading(false);
        return;
      }

      try {
        const status: SubscriptionStatusResponse = await getSubscriptionStatus(token);
        setSubscriptionPlan(status.plan_type);
      } catch (err: any) {
        console.error('Error fetching subscription status:', err.message);
        setError('Failed to load subscription status');
        toast.error('Failed to load subscription status');
        setSubscriptionPlan('none');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  return { subscriptionPlan, loading, error };
};