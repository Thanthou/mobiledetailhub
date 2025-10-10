// Customer OOP class with business logic and state management
import type {
  ContactPreferences,
  CreateCustomerRequest,
  Customer as CustomerData,
  CustomerStatus,
  DEFAULT_CONTACT_PREFERENCES,
  DEFAULT_COUNTRY,
  DEFAULT_CUSTOMER_STATUS,
  DEFAULT_SERVICE_PREFERENCES,
  ServicePreferences,
  UpdateCustomerRequest,
} from '../types';

export class Customer {
  private data: CustomerData;

  constructor(customerData: CustomerData) {
    this.data = { ...customerData };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Getters
  // ─────────────────────────────────────────────────────────────────────────────

  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get email(): string | undefined {
    return this.data.email;
  }

  get phone(): string | undefined {
    return this.data.phone;
  }

  get status(): CustomerStatus {
    return this.data.status;
  }

  get isRegistered(): boolean {
    return !!this.data.user_id;
  }

  get isAnonymous(): boolean {
    return this.data.status === 'anonymous';
  }

  get isVerified(): boolean {
    return this.data.status === 'verified';
  }

  get isActive(): boolean {
    return this.data.status !== 'inactive';
  }

  get lifetimeValue(): number {
    return this.data.lifetime_value_cents;
  }

  get totalBookings(): number {
    return this.data.total_bookings;
  }

  get tags(): string[] {
    return [...this.data.tags];
  }

  get lastActivityAt(): string {
    return this.data.last_activity_at;
  }

  get createdAt(): string {
    return this.data.created_at;
  }

  get updatedAt(): string {
    return this.data.updated_at;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Contact Information
  // ─────────────────────────────────────────────────────────────────────────────

  getDisplayName(): string {
    return this.data.name || 'Guest Customer';
  }

  getContactInfo(): { email?: string; phone?: string } {
    return {
      email: this.data.email,
      phone: this.data.phone,
    };
  }

  getFullAddress(): string {
    const parts = [
      this.data.address,
      this.data.city,
      this.data.state,
      this.data.zip_code,
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  hasEmail(): boolean {
    return !!this.data.email;
  }

  hasPhone(): boolean {
    return !!this.data.phone;
  }

  hasCompleteContactInfo(): boolean {
    return this.hasEmail() && this.hasPhone();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Communication Preferences
  // ─────────────────────────────────────────────────────────────────────────────

  canReceiveEmails(): boolean {
    return this.data.contact_preferences.email && this.hasEmail();
  }

  canReceiveSMS(): boolean {
    return this.data.contact_preferences.sms && this.hasPhone();
  }

  canReceivePhoneCalls(): boolean {
    return this.data.contact_preferences.phone && this.hasPhone();
  }

  canReceiveMarketing(): boolean {
    return this.data.contact_preferences.marketing_emails && this.canReceiveEmails();
  }

  canReceivePromotions(): boolean {
    return this.data.contact_preferences.promotional_offers && this.canReceiveEmails();
  }

  getPreferredCommunicationMethods(): string[] {
    const methods: string[] = [];
    
    if (this.canReceiveEmails()) methods.push('email');
    if (this.canReceiveSMS()) methods.push('sms');
    if (this.canReceivePhoneCalls()) methods.push('phone');
    
    return methods;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Service Preferences
  // ─────────────────────────────────────────────────────────────────────────────

  getPreferredServices(): string[] {
    return [...this.data.service_preferences.preferred_services];
  }

  getPreferredAffiliates(): string[] {
    return [...this.data.service_preferences.preferred_affiliates];
  }

  getVehiclePreferences(): Record<string, unknown> {
    return { ...this.data.service_preferences.vehicle_preferences };
  }

  getServiceNotes(): string {
    return this.data.service_preferences.service_notes || '';
  }

  hasPreferredServices(): boolean {
    return this.data.service_preferences.preferred_services.length > 0;
  }

  hasPreferredAffiliates(): boolean {
    return this.data.service_preferences.preferred_affiliates.length > 0;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Business Logic Methods
  // ─────────────────────────────────────────────────────────────────────────────

  isHighValue(): boolean {
    return this.data.lifetime_value_cents > 100000; // $1000+
  }

  isFrequentCustomer(): boolean {
    return this.data.total_bookings >= 5;
  }

  isNewCustomer(): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(this.data.created_at) > thirtyDaysAgo;
  }

  isInactive(): boolean {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return new Date(this.data.last_activity_at) < ninetyDaysAgo;
  }

  getCustomerTier(): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (this.data.lifetime_value_cents >= 500000) return 'platinum'; // $5000+
    if (this.data.lifetime_value_cents >= 200000) return 'gold'; // $2000+
    if (this.data.lifetime_value_cents >= 50000) return 'silver'; // $500+
    return 'bronze';
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // State Transitions
  // ─────────────────────────────────────────────────────────────────────────────

  register(userId: string): void {
    if (this.isRegistered) {
      throw new Error('Customer is already registered');
    }

    if (!this.hasEmail()) {
      throw new Error('Customer must have an email address to register');
    }

    // This would call your API to update the customer
    // await customerApi.registerCustomer(this.id, userId);
    
    this.data.user_id = userId;
    this.data.status = 'registered';
    this.data.converted_at = new Date().toISOString();
    this.data.last_activity_at = new Date().toISOString();
  }

  verify(): void {
    if (this.data.status !== 'registered') {
      throw new Error('Customer must be registered before verification');
    }

    // await customerApi.verifyCustomer(this.id);
    this.data.status = 'verified';
    this.data.last_activity_at = new Date().toISOString();
  }

  deactivate(): void {
    if (this.data.status === 'inactive') {
      throw new Error('Customer is already inactive');
    }

    // await customerApi.deactivateCustomer(this.id);
    this.data.status = 'inactive';
    this.data.last_activity_at = new Date().toISOString();
  }

  reactivate(): void {
    if (this.data.status !== 'inactive') {
      throw new Error('Customer is not inactive');
    }

    // await customerApi.reactivateCustomer(this.id);
    this.data.status = 'registered';
    this.data.last_activity_at = new Date().toISOString();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Update Methods
  // ─────────────────────────────────────────────────────────────────────────────

  updateContactInfo(contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  }): void {
    if (contactInfo.email !== undefined) this.data.email = contactInfo.email;
    if (contactInfo.phone !== undefined) this.data.phone = contactInfo.phone;
    if (contactInfo.address !== undefined) this.data.address = contactInfo.address;
    if (contactInfo.city !== undefined) this.data.city = contactInfo.city;
    if (contactInfo.state !== undefined) this.data.state = contactInfo.state;
    if (contactInfo.zip_code !== undefined) this.data.zip_code = contactInfo.zip_code;
    if (contactInfo.country !== undefined) this.data.country = contactInfo.country;
    
    this.data.last_activity_at = new Date().toISOString();
  }

  updateContactPreferences(preferences: Partial<ContactPreferences>): void {
    this.data.contact_preferences = {
      ...this.data.contact_preferences,
      ...preferences,
    };
    this.data.last_activity_at = new Date().toISOString();
  }

  updateServicePreferences(preferences: Partial<ServicePreferences>): void {
    this.data.service_preferences = {
      ...this.data.service_preferences,
      ...preferences,
    };
    this.data.last_activity_at = new Date().toISOString();
  }

  addTag(tag: string): void {
    if (!this.data.tags.includes(tag)) {
      this.data.tags.push(tag);
      this.data.last_activity_at = new Date().toISOString();
    }
  }

  removeTag(tag: string): void {
    this.data.tags = this.data.tags.filter(t => t !== tag);
    this.data.last_activity_at = new Date().toISOString();
  }

  updateNotes(notes: string): void {
    this.data.notes = notes;
    this.data.last_activity_at = new Date().toISOString();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Booking and Value Tracking
  // ─────────────────────────────────────────────────────────────────────────────

  recordBooking(bookingValueCents: number): void {
    this.data.total_bookings += 1;
    this.data.lifetime_value_cents += bookingValueCents;
    this.data.last_booking_at = new Date().toISOString();
    this.data.last_activity_at = new Date().toISOString();
  }

  updateLastActivity(): void {
    this.data.last_activity_at = new Date().toISOString();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Static Factory Methods
  // ─────────────────────────────────────────────────────────────────────────────

  static createAnonymous(customerData: CreateCustomerRequest): Customer {
    const now = new Date().toISOString();
    
    const customer: CustomerData = {
      id: `customer_${String(Date.now())}_${Math.random().toString(36).substring(2, 11)}`,
      user_id: undefined,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      zip_code: customerData.zip_code,
      country: customerData.country || DEFAULT_COUNTRY,
      status: DEFAULT_CUSTOMER_STATUS,
      registration_source: customerData.registration_source,
      converted_at: undefined,
      contact_preferences: {
        ...DEFAULT_CONTACT_PREFERENCES,
        ...customerData.contact_preferences,
      },
      service_preferences: {
        ...DEFAULT_SERVICE_PREFERENCES,
        ...customerData.service_preferences,
      },
      notes: customerData.notes,
      tags: customerData.tags || [],
      lifetime_value_cents: 0,
      total_bookings: 0,
      last_booking_at: undefined,
      last_activity_at: now,
      created_at: now,
      updated_at: now,
    };

    return new Customer(customer);
  }

  static fromData(customerData: CustomerData): Customer {
    return new Customer(customerData);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Serialization
  // ─────────────────────────────────────────────────────────────────────────────

  toJSON(): CustomerData {
    return { ...this.data };
  }

  toUpdateRequest(): UpdateCustomerRequest {
    return {
      name: this.data.name,
      email: this.data.email,
      phone: this.data.phone,
      address: this.data.address,
      city: this.data.city,
      state: this.data.state,
      zip_code: this.data.zip_code,
      country: this.data.country,
      contact_preferences: this.data.contact_preferences,
      service_preferences: this.data.service_preferences,
      notes: this.data.notes,
      tags: this.data.tags,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────────────────────────────────────

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.data.name || this.data.name.trim().length === 0) {
      errors.push('Customer name is required');
    }

    if (this.data.email && !this.isValidEmail(this.data.email)) {
      errors.push('Invalid email format');
    }

    if (this.data.phone && !this.isValidPhone(this.data.phone)) {
      errors.push('Invalid phone format');
    }

    if (this.data.status === 'registered' && !this.data.user_id) {
      errors.push('Registered customers must have a user_id');
    }

    // Note: This condition is always false since verified !== registered
    // This check may need to be revised based on actual business logic

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
  }
}
