// Simple event system for tenant updates
// Shared utility for cross-feature communication

type TenantEventListener = () => void;

class TenantEventManager {
  private listeners: TenantEventListener[] = [];

  subscribe(listener: TenantEventListener) {
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
    this.listeners.forEach(listener => { listener(); });
  }
}

export const tenantEventManager = new TenantEventManager();

// Event types (currently unused, but defined for future use)
export const TENANT_EVENTS = {
  TENANT_DELETED: 'tenant_deleted',
  TENANT_APPROVED: 'tenant_approved',
  TENANT_REJECTED: 'tenant_rejected',
  TENANT_UPDATED: 'tenant_updated'
} as const;

