// JSON representation interfaces
interface TierJSON {
  id: string;
  name: string;
  price: number;
  duration: number;
  serviceOptions?: string[];
  enabled: boolean;
  popular: boolean;
}

interface ServiceJSON {
  id: string;
  name: string;
  tiers: TierJSON[];
}

export class Tier {
  id: string;
  name: string;
  price: number;
  duration: number;
  serviceOptions: string[]; // Only service IDs from service.json
  enabled: boolean;
  popular: boolean;

  constructor(id: string, name: string, price: number, duration: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.duration = duration;
    this.serviceOptions = [];
    this.enabled = true;
    this.popular = false;
  }

  // Add a service option (only service IDs from service.json)
  addServiceOption(option: string) {
    if (!this.serviceOptions.includes(option)) {
      this.serviceOptions.push(option);
    }
  }


  // Get all features (just the serviceOptions, no complex logic)
  get all_features(): string[] {
    return [...this.serviceOptions];
  }

  // Get all service IDs (all options are service IDs now)
  getServiceIds(availableServices: Array<{id: string, name: string}>): string[] {
    return this.serviceOptions.filter(option => 
      availableServices.some(service => service.id === option)
    );
  }
}

export class Service {
  id: string;
  name: string;
  tiers: Tier[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.tiers = [];
  }

  addTier(tier: Tier) {
    this.tiers.push(tier);
  }

  getTierById(id: string): Tier | undefined {
    return this.tiers.find(tier => tier.id === id);
  }

  getTierNames(): string[] {
    return this.tiers.map(tier => tier.name);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tiers: this.tiers.map(tier => ({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        duration: tier.duration,
        serviceOptions: tier.serviceOptions,
        enabled: tier.enabled,
        popular: tier.popular
      }))
    };
  }

  static fromJSON(data: ServiceJSON): Service {
    const service = new Service(data.id, data.name);
    service.tiers = data.tiers.map((tierData: TierJSON) => {
      const tier = new Tier(tierData.id, tierData.name, tierData.price, tierData.duration);
      tier.enabled = tierData.enabled;
      tier.popular = tierData.popular;
      tier.serviceOptions = tierData.serviceOptions || [];
      return tier;
    });
    return service;
  }
}