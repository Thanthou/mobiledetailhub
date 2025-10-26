# Tenant Signup Flow - Complete Test Guide

**Date:** 2025-10-25  
**Purpose:** Test end-to-end tenant onboarding with Stripe payment  
**Status:** 📋 Ready to Test  

---

## 🔧 Prerequisites

### 1. Stripe Configuration

**Backend:** Need `STRIPE_SECRET_KEY` in `.env` (root level)
**Frontend:** Need `VITE_STRIPE_PUBLISHABLE_KEY` in frontend env

**Get Stripe Test Keys:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (starts with `sk_test_`)

**Add to `.env` (root):**
```env
# Stripe Test Mode Keys
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

**Restart backend and frontend** after adding keys.

---

### 2. Email Configuration (Optional)

**For welcome emails:** Add SendGrid key (optional for testing)
```env
SENDGRID_API_KEY=SG.YOUR_KEY_HERE
FROM_EMAIL=hello@thatsmartsite.com
```

**Without email:** Signup still works, just no welcome email sent.

---

### 3. Database Ready

Ensure PostgreSQL is running and migrations applied.

---

## 🧪 Complete Signup Flow Test

### Step 1: Navigate to Signup (30 sec)

**URL:** `http://localhost:5175/signup`

**Expected:**
- ✅ Multi-step form loads
- ✅ Step progress bar visible (Plan → Personal → Business → Payment)
- ✅ Currently on "Plan" step

---

### Step 2: Select Plan (1 min)

**Action:**
1. Review the plan options
2. **Select** a plan (Starter, Professional, or Premium)
3. **Click** "Continue" or "Next"

**Expected:**
- ✅ Plan highlights when selected
- ✅ Advances to "Personal" step
- ✅ Progress bar updates

---

### Step 3: Personal Information (2 min)

**Action:**
Fill out personal info:
- **First Name:** TestUser
- **Last Name:** Demo
- **Personal Email:** test@example.com
- **Personal Phone:** (555) 123-4567

**Click** "Continue"

**Expected:**
- ✅ Form validation passes
- ✅ Advances to "Business" step
- ✅ Auto-save saves draft (check localStorage)

---

### Step 4: Business Information (2 min)

**Action:**
Fill out business info:
- **Business Name:** Test Mobile Detailing
- **Business Email:** business@test.com
- **Business Phone:** (555) 987-6543
- **Business Address:** 123 Main St, Los Angeles, CA 90001
- **Industry:** Mobile Detailing (or your choice)

**Optional Fields:**
- Upload logo (test file upload)
- Add social media URLs
- Add business hours

**Click** "Continue"

**Expected:**
- ✅ Validation passes
- ✅ File upload works (if tested)
- ✅ Advances to "Payment" step

---

### Step 5: Payment with Test Card (3 min) 🔴 CRITICAL

**Action:**

1. **Billing Address Section:**
   - Fill in billing address OR
   - Check "Use same as business address"

2. **Card Details (Stripe Test Card):**
   
   **Test Card Numbers:**
   ```
   Success: 4242 4242 4242 4242
   Decline: 4000 0000 0000 0002
   Requires Auth: 4000 0025 0000 3155
   ```
   
   **Other Details:**
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

3. **Review Summary:**
   - Verify plan pricing shows
   - Verify business name shows
   - Verify total amount

4. **Click** "Complete Payment" or "Submit Application"

**Expected:**
- ✅ "Processing..." state
- ✅ Stripe processes payment (2-3 seconds)
- ✅ Success! Redirect to success page

**If Stripe not configured:**
- ❌ Error: "Stripe not configured"
- Need to add Stripe keys (see Prerequisites)

---

### Step 6: Success Page (30 sec)

**Expected:**
- ✅ Success message: "Welcome! Your account has been created"
- ✅ Shows your website URL: `test-mobile-detailing.thatsmartsite.com`
- ✅ Shows dashboard URL: `test-mobile-detailing.thatsmartsite.com/admin`
- ✅ "Go to Dashboard" button

**Check Database:**
```sql
SELECT * FROM tenants.business 
WHERE business_email = 'business@test.com';
```
- ✅ Tenant record created
- ✅ Slug generated
- ✅ Status = 'pending' (awaits admin approval)

---

## 🧪 Edge Cases to Test

### Test 1: Form Validation

**Action:** Try to skip required fields

**Expected:**
- ❌ Can't advance without required fields
- ❌ Red error messages appear
- ❌ Form highlights invalid fields

---

### Test 2: Duplicate Email

**Action:** Sign up with same email twice

**Expected:**
- ❌ Error: "Email already exists"
- ❌ Can't create duplicate account

---

### Test 3: Card Decline

**Action:** Use decline test card: `4000 0000 0000 0002`

**Expected:**
- ❌ Payment fails
- ❌ Error message: "Your card was declined"
- ✅ User can retry with different card
- ✅ Form data preserved (don't lose progress)

---

### Test 4: Draft Saving (Auto-save)

**Action:**
1. Fill out Personal step
2. **Close browser tab** (without submitting)
3. **Reopen** `http://localhost:5175/signup`

**Expected:**
- ✅ Form data restored from localStorage
- ✅ Can continue where you left off

---

### Test 5: File Upload

**Action:**
1. In Business step, upload logo image
2. Select a PNG or JPG file
3. Continue to next step

**Expected:**
- ✅ File uploads successfully
- ✅ Preview shown
- ✅ File saved to backend

---

## 🚨 Common Issues & Fixes

### Issue: "Stripe not configured"

**Fix:**
```env
# Add to root .env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
```

Restart backend and frontend.

---

### Issue: "Payment failed - Network error"

**Check:**
1. Backend running on port 3000?
2. Stripe keys valid?
3. Check backend logs for errors

---

### Issue: "Database error"

**Check:**
1. PostgreSQL running?
2. Migrations applied?
3. Table `tenants.business` exists?

---

## ✅ Success Criteria

**Minimum (Quick Test):**
- [ ] Form loads
- [ ] Can fill all steps
- [ ] Payment processes (even if Stripe not configured, should show error gracefully)
- [ ] No crashes or console errors

**Full Test (Production Ready):**
- [ ] End-to-end signup works with test card
- [ ] Database record created
- [ ] Success page shows correct URLs
- [ ] Auto-save works (draft recovery)
- [ ] File upload works
- [ ] Form validation works
- [ ] Duplicate email blocked
- [ ] Card decline handled gracefully

---

## 🎯 Quick Test Plan (15 min)

If you want to test quickly without full Stripe setup:

1. **Navigate** to `/signup`
2. **Fill** all 4 steps (use any data)
3. **Payment step:**
   - If Stripe configured → Use test card `4242...`
   - If not configured → Should show error gracefully
4. **Verify** no crashes

**Goal:** Prove the form works, even if payment doesn't process

---

## 📝 Test Data Template

Use this for consistent testing:

```
=== PERSONAL INFO ===
First Name: Test
Last Name: User
Email: test-tenant-[timestamp]@example.com
Phone: (555) 123-4567

=== BUSINESS INFO ===
Business Name: Test Mobile Detailing
Business Email: business-[timestamp]@test.com
Business Phone: (555) 987-6543
Address: 123 Main St
City: Los Angeles
State: CA
ZIP: 90001
Industry: Mobile Detailing

=== PAYMENT (Stripe Test) ===
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
ZIP: 12345

=== EXPECTED RESULT ===
Slug: test-mobile-detailing (auto-generated)
Website: test-mobile-detailing.thatsmartsite.com
Status: pending (needs admin approval)
```

---

**Ready to test the full flow?** Let me know if you need help setting up Stripe keys or if you want to proceed! 🚀

