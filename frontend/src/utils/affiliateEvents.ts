// Simple event system for affiliate updates
type AffiliateEventListener = () => void;

class AffiliateEventManager {
  private listeners: AffiliateEventListener[] = [];

  subscribe(listener: AffiliateEventListener) {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const affiliateEventManager = new AffiliateEventManager();

// Event types
export const AFFILIATE_EVENTS = {
  AFFILIATE_DELETED: 'affiliate_deleted',
  AFFILIATE_APPROVED: 'affiliate_approved',
  AFFILIATE_REJECTED: 'affiliate_rejected',
  AFFILIATE_UPDATED: 'affiliate_updated'
} as const;
