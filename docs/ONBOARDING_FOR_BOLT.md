# Tenant Onboarding UI/UX Optimization

**Project:** Multi-tenant SaaS platform for service businesses  
**Goal:** Optimize the tenant onboarding flow for conversion, mobile UX, and trust

---

## 🎯 CONTEXT & REQUIREMENTS

### **What This Is:**
A 3-step wizard that converts prospects from preview demos into paying customers with live websites.

### **Current Flow:**
1. **Personal Info** → Name, phone, email
2. **Business Info** → Business name, phone, email, address (pre-filled from preview)
3. **Payment** → Card details, billing address, submit

### **Tech Stack:**
- **Framework:** React 18 + TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (dark theme: stone-900 bg, orange-600 accents)
- **Components:** Custom components (no shadcn/ui installed yet)
- **State:** Local React state
- **Validation:** Client-side (needs improvement)

### **Key Constraints:**
- ✅ Must work on mobile (60%+ of traffic)
- ✅ Keep dark theme (stone-900 background, orange-600 primary)
- ✅ Maintain Tailwind-first approach
- ✅ Support pre-fill from preview data (already implemented)
- ✅ Clean, professional, trustworthy feel
- ⚠️ **Payment is NOT implemented yet** - needs Stripe integration

---

## 🚨 CURRENT PROBLEMS TO FIX

### **UX Issues:**
1. **Fixed height container** (700px) breaks on mobile
2. **No validation feedback** until submit
3. **Long forms** feel intimidating
4. **No progress save** (lose data if they leave)
5. **Payment section** collects raw card numbers (should use Stripe Elements)
6. **No trust signals** (SSL badge, security messaging, testimonials)
7. **Dev tools panel** is visible (should only show in dev mode)

### **Mobile Issues:**
8. **Header logo offset** (`ml-[400px]`) breaks on mobile
9. **Grid layouts** don't stack well on small screens
10. **Touch targets** may be too small
11. **Step progress** cramped on mobile

### **Conversion Issues:**
12. **No "why" messaging** (benefits of signing up)
13. **No pricing display** (what are they paying for?)
14. **No social proof** on onboarding page
15. **No exit-intent** handling (catch abandonment)

---

## 📁 CURRENT CODE

### **Main Orchestrator**

\`\`\`tsx
// TenantApplicationPage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

import type { TenantApplication } from '@/features/tenantOnboarding/types';
import { tenantApplicationDefaultValues } from '@/features/tenantOnboarding/types';
import { Button } from '@/shared/ui';

import {
  ApplicationHeader,
  BusinessInformationSection,
  PersonalInformationSection,
  SuccessPage
} from './index';
import PaymentSection from './PaymentSection';

interface PreviewState {
  fromPreview?: boolean;
  businessName?: string;
  phone?: string;
  city?: string;
  state?: string;
  industry?: string;
}

const TenantApplicationPage: React.FC = () => {
  const location = useLocation();
  const previewData = location.state as PreviewState | null;
  
  const [formData, setFormData] = useState<TenantApplication>(tenantApplicationDefaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Pre-fill form if coming from preview
  useEffect(() => {
    if (previewData?.fromPreview) {
      setFormData(prev => ({
        ...prev,
        businessName: previewData.businessName || prev.businessName,
        businessPhone: previewData.phone || prev.businessPhone,
        businessAddress: {
          ...prev.businessAddress,
          city: previewData.city || prev.businessAddress.city,
          state: previewData.state || prev.businessAddress.state,
        },
      }));
    }
  }, [previewData]);

  const steps = ['Personal', 'Business', 'Payment'];

  // Step navigation
  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof TenantApplication, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof TenantApplication['businessAddress'], value: string) => {
    setFormData(prev => ({
      ...prev,
      businessAddress: { ...prev.businessAddress, [field]: value }
    }));
  };

  const handleBillingAddressChange = (field: keyof TenantApplication['billingAddress'], value: string) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Implement actual submission logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (error) {
      setSubmitError('Failed to submit application. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <SuccessPage />;
  }

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      <ApplicationHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-8">
          {/* Fixed height container - PROBLEM: breaks on mobile */}
          <div className="h-[700px] flex flex-col justify-start">
            {/* Step 1: Personal */}
            {currentStep === 1 && (
              <div className="h-full flex flex-col justify-center">
                <PersonalInformationSection 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
              </div>
            )}
            
            {/* Step 2: Business */}
            {currentStep === 2 && (
              <div className="h-full flex flex-col justify-center">
                <BusinessInformationSection 
                  formData={formData} 
                  handleInputChange={handleInputChange}
                  handleAddressChange={handleAddressChange}
                />
              </div>
            )}
            
            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="h-full flex flex-col justify-start">
                <PaymentSection 
                  formData={formData} 
                  handleInputChange={handleInputChange}
                  handleAddressChange={handleBillingAddressChange}
                />
              </div>
            )}
          </div>
          
          {/* Step Indicator */}
          <div className="py-6">
            <div className="flex justify-center items-center mb-6">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                
                return (
                  <React.Fragment key={stepNumber}>
                    <div className="flex flex-col items-center">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full border-2
                        ${isCompleted 
                          ? 'bg-orange-600 border-orange-600 text-white' 
                          : isActive 
                            ? 'bg-orange-600 border-orange-600 text-white' 
                            : 'bg-stone-700 border-stone-600 text-gray-400'
                        }
                      `}>
                        {isCompleted ? <Check className="w-4 h-4" /> : <span>{stepNumber}</span>}
                      </div>
                      <div className="text-xs font-medium mt-1">{step}</div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 mt-4 ${isCompleted ? 'bg-orange-600' : 'bg-stone-600'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                type="button"
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                variant="outline"
                className="px-6 py-2 border border-stone-600 disabled:opacity-50"
              >
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button type="button" onClick={goToNextStep} className="px-6 py-2 bg-orange-600">
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-orange-600">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantApplicationPage;
\`\`\`

---

### **Form Sections**

\`\`\`tsx
// PersonalInformationSection.tsx
import React from 'react';
import { User } from 'lucide-react';
import { Input } from '@/shared/ui';

interface PersonalInformationSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    personalPhone: string;
    personalEmail: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg">
      <div className="p-6 border-b border-stone-700">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <User className="h-5 w-5 mr-2" />
          Personal Information
        </h2>
        <p className="text-gray-400 text-sm mt-1">Tell us about yourself</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) => { handleInputChange('firstName', e.target.value); }}
              placeholder="Enter your first name"
              required
              className="w-full bg-stone-700 border-stone-600 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) => { handleInputChange('lastName', e.target.value); }}
              placeholder="Enter your last name"
              required
              className="w-full bg-stone-700 border-stone-600 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Personal Phone *</label>
            <Input
              type="tel"
              value={formData.personalPhone}
              onChange={(e) => { handleInputChange('personalPhone', e.target.value); }}
              placeholder="(555) 123-4567"
              required
              className="w-full bg-stone-700 border-stone-600 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Personal Email *</label>
            <Input
              type="email"
              value={formData.personalEmail}
              onChange={(e) => { handleInputChange('personalEmail', e.target.value); }}
              placeholder="your.email@example.com"
              required
              className="w-full bg-stone-700 border-stone-600 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationSection;
\`\`\`

\`\`\`tsx
// BusinessInformationSection.tsx - Similar structure, business fields + address
// (See full code above - includes business name, phone, email, full address)
\`\`\`

\`\`\`tsx
// PaymentSection.tsx
// ⚠️ MAJOR ISSUE: Collects raw card data (PCI compliance risk!)
// Should use Stripe Elements instead
// (See full code above)
\`\`\`

---

### **Type Definitions**

\`\`\`typescript
// types/index.ts
export interface TenantApplication {
  firstName: string;
  lastName: string;
  personalPhone: string;
  personalEmail: string;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
  cardNumber: string;  // ⚠️ SECURITY: Should use Stripe token
  expiryDate: string;  // ⚠️ SECURITY: Should use Stripe token
  cvv: string;         // ⚠️ SECURITY: Should use Stripe token
  billingAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}
\`\`\`

---

### **Design System (Tailwind Config)**

\`\`\`javascript
// Current Tailwind usage:
// Backgrounds: bg-stone-900 (main), bg-stone-800 (cards), bg-stone-700 (inputs)
// Text: text-white (primary), text-gray-400 (secondary), text-gray-300 (labels)
// Primary: bg-orange-600, hover:bg-orange-700
// Borders: border-stone-700, border-stone-600
// Focus rings: focus:ring-2 focus:ring-orange-500
\`\`\`

---

## 🎯 OPTIMIZATION GOALS

### **Priority 1: Mobile-First Redesign**
- Remove fixed height containers
- Stack form fields properly on small screens
- Larger touch targets (min 44px)
- Fix header offset issue
- Test on iPhone SE, iPhone 14 Pro, Android

### **Priority 2: Conversion Optimization**
- Add progress auto-save (localStorage)
- Real-time validation with helpful errors
- Show pricing/plan selection before payment
- Trust signals (SSL, testimonials, "100+ businesses trust us")
- Reduce cognitive load (fewer fields per step?)
- Add "exit intent" save prompt

### **Priority 3: Payment Security**
- Integrate Stripe Elements for card input
- Never handle raw card numbers
- PCI compliance
- Show security badges
- Explain what they're paying for

### **Priority 4: UX Polish**
- Smooth transitions between steps
- Loading states
- Success animations
- Error recovery
- Accessibility (WCAG 2.1 AA)

---

## 🚀 SUGGESTED ENHANCEMENTS

### **Step 0: Plan Selection (NEW)**
Before personal info, show:
- **Starter Plan:** $99/mo - Single location, 5 pages
- **Pro Plan:** $199/mo - Multi-location, unlimited pages
- **Enterprise:** Custom pricing

### **Step 1: Personal Info (IMPROVED)**
- Fewer fields (combine into one screen)
- Phone auto-format as they type
- Email validation (check format + suggest corrections)
- Auto-save to localStorage every 2 seconds

### **Step 2: Business Info (IMPROVED)**
- Pre-filled from preview (already done ✅)
- Google Places autocomplete for address
- Show preview thumbnail: "This is the site you'll get"
- Industry selector (if not from preview)

### **Step 3: Payment (COMPLETE REWRITE)**
- **Stripe Elements integration** (secure card input)
- Order summary sidebar (what they're paying for)
- Promo code field
- "Same as business address" checkbox
- Security badges (SSL, PCI, money-back guarantee)

### **Step 4: Success (ENHANCED)**
- Confetti animation
- "Your site is being created..." progress
- Email sent notification
- Next steps (check email, dashboard link)
- Social share buttons ("I just got my website!")

---

## 📊 ANALYTICS TO TRACK

Add these events for conversion optimization:
- Step entered (track drop-off)
- Field blur (validation triggers)
- Step abandoned (exit intent)
- Form auto-saved
- Payment started
- Payment completed
- Conversion time (preview → tenant)

---

## 🎨 DESIGN INSPIRATION

**Similar flows to reference:**
- Stripe onboarding (clean, progressive disclosure)
- Vercel signup (minimal, fast)
- Shopify trial (shows value, low friction)

**Key principles:**
- One thing at a time (reduce cognitive load)
- Show progress (they can see the finish line)
- Instant feedback (validate as they type)
- Build trust (security badges, testimonials, guarantees)

---

## 💳 STRIPE INTEGRATION SPEC

**Payment Flow:**
1. Load Stripe.js
2. Create PaymentIntent on server (amount, metadata)
3. Collect payment with Stripe Elements
4. Confirm payment
5. Create tenant record on success
6. Provision subdomain
7. Send welcome email

**Security:**
- ✅ Never touch card numbers
- ✅ Stripe handles PCI compliance
- ✅ Use Stripe Checkout or Elements
- ✅ 3D Secure (SCA) support
- ✅ Webhooks for async completion

---

## 📱 MOBILE REQUIREMENTS

**Must work perfectly on:**
- iPhone SE (375px wide)
- iPhone 14 Pro (430px)
- Samsung Galaxy S21 (360px)
- iPad (768px)

**Test criteria:**
- No horizontal scroll
- All touch targets ≥44px
- Forms use native inputs (auto-zoom disabled)
- Fast load time (<3s on 3G)
- Works offline (service worker?)

---

## ♿ ACCESSIBILITY REQUIREMENTS

- WCAG 2.1 AA compliant
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader friendly (ARIA labels)
- Focus indicators visible
- Error announcements
- Color contrast ≥4.5:1
- Form labels properly associated

---

## 🔐 SECURITY CONSIDERATIONS

- ✅ HTTPS only (redirect HTTP)
- ✅ CSRF tokens
- ✅ Rate limiting (prevent spam)
- ✅ Email verification
- ✅ Strong password requirements (if adding auth)
- ⚠️ **Replace raw card inputs with Stripe Elements**
- ✅ Sanitize all inputs
- ✅ Validate server-side (don't trust client)

---

## 📦 DELIVERABLES REQUESTED

Please provide optimized versions of:

1. **TenantApplicationPage.tsx** - Main orchestrator
2. **PersonalInformationSection.tsx** - Step 1 (improved)
3. **BusinessInformationSection.tsx** - Step 2 (improved)
4. **PaymentSection.tsx** - Step 3 (Stripe Elements integration)
5. **PlanSelectionSection.tsx** - NEW Step 0 (pricing)
6. **SuccessPage.tsx** - Enhanced with animations
7. **StepProgress.tsx** - Mobile-friendly progress indicator

**Plus:**
8. **Validation rules** (Zod schemas or similar)
9. **Auto-save hook** (useAutoSave)
10. **Stripe integration guide** (setup steps)

---

## 🎯 SUCCESS METRICS

**Before optimization:**
- Form completion: ~40% (guessing)
- Mobile bounce: High
- Average time: Unknown
- Abandonment at payment: High (security concerns?)

**Target after optimization:**
- Form completion: >70%
- Mobile experience: Excellent (Lighthouse >90)
- Average time: <3 minutes
- Abandonment: <20%
- Trust score: High (security badges, testimonials)

---

## 📝 ADDITIONAL CONTEXT

**Preview → Onboarding Flow:**
1. Prospect sees preview site with their business info
2. Clicks "Get This Site" button
3. Lands on onboarding with business info pre-filled ✅
4. Completes personal info
5. Confirms business details
6. Pays with Stripe
7. Tenant created, site activated
8. Welcome email sent

**Current gaps:**
- No pricing shown before onboarding
- No plan selection
- Payment not implemented (Stripe needed)
- No email service connected
- No tenant provisioning automated

---

## 🛠️ TECH PREFERENCES

- ✅ React 18 + TypeScript
- ✅ Tailwind CSS (keep dark theme)
- ✅ React Router v6
- ✅ Zod for validation
- ✅ Stripe for payments
- ✅ Lucide icons (already using)
- ❌ No heavy libraries (keep bundle small)
- ❌ No jQuery or legacy code

---

**Ready for bolt.new to optimize! Copy the prompt below and paste with this document.** 🚀

