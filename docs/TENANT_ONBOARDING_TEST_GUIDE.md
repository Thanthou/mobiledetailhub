# Tenant Onboarding - End-to-End Testing Guide

This guide walks through the complete tenant onboarding flow from signup to viewing the new website.

## Prerequisites

1. **Database Setup**: Ensure PostgreSQL is running and the database is initialized
2. **Environment Variables**: Both backend and frontend `.env` files are configured
3. **Servers Running**: 
   - Backend: `cd backend && npm run dev` (runs on port 3001)
   - Frontend: `cd frontend && npm run dev` (runs on port 5173)

## Complete Flow Test

### Step 1: Navigate to Onboarding Page

1. Open browser to: `http://localhost:5173/tenant-onboarding`
2. You should see the Plan Selection page

### Step 2: Plan Selection

1. Review the three pricing tiers:
   - **Starter**: $15/month
   - **Pro**: $25/month (marked as popular)
   - **Enterprise**: $35/month

2. Click "Get Started" on any plan
3. The form should advance to Step 1: Personal Information

### Step 3: Personal Information

Fill in your personal details:

- **First Name**: John
- **Last Name**: Doe
- **Personal Phone**: (555) 123-4567
- **Personal Email**: john.doe@example.com

Click "Continue" to proceed to Step 2.

### Step 4: Business Information

Fill in your business details:

- **Business Name**: Doe's Mobile Detailing
- **Industry**: Mobile Detailing (or select any other)
- **Business Phone**: (555) 987-6543
- **Business Email**: contact@doesmobiledetailing.com

**Business Address**:
- **Street Address**: 123 Main Street
- **City**: Phoenix
- **State**: AZ
- **ZIP Code**: 85001

Click "Continue" to proceed to Step 3.

### Step 5: Payment Section

1. The billing address defaults to your business address
2. You can toggle "Use business address as billing address" to enter a different billing address
3. Enter payment details (Note: This is currently a UI placeholder - Stripe integration pending)
4. Click "Complete Purchase"

### Step 6: Processing

1. The submit button should show "Processing..." while the request is being sent
2. The backend will:
   - Create a user account in `auth.users`
   - Create a tenant record in `tenants.business`
   - Generate a unique slug from the business name
   - Create default website content in `website.content`
   - Return the new tenant's information

### Step 7: Success Page

After successful submission, you should see:

1. ✅ Success message with confetti icon
2. 🌐 **"Your Website is Live!"** section with:
   - The website URL (e.g., `http://localhost:5173/does-mobile-detailing`)
   - A blue "View My Website" button
3. **"What's Next?"** section with next steps
4. Contact information

### Step 8: View Your New Website

1. Click the "View My Website" button
2. You should be redirected to your new website at `/{slug}`
3. The website should display:
   - Your business name
   - Hero title: "Welcome to [Business Name]"
   - Hero subtitle based on your industry and location
   - Default industry template

### Step 9: Verify Backend Console

Check the backend terminal. You should see:

```
=== NEW TENANT SIGNUP ===
Business: Doe's Mobile Detailing
Owner: John Doe
Email: john.doe@example.com
Slug: does-mobile-detailing
Website URL: http://localhost:5173/does-mobile-detailing
Dashboard URL: http://localhost:5173/does-mobile-detailing/dashboard
Plan: pro ($25/month)
========================
```

### Step 10: Verify Database

Connect to your PostgreSQL database and verify:

1. **New user in `auth.users`**:
```sql
SELECT id, email, name, phone, is_admin 
FROM auth.users 
WHERE email = 'john.doe@example.com';
```

2. **New tenant in `tenants.business`**:
```sql
SELECT id, slug, business_name, first_name, last_name, 
       business_email, application_status, industry
FROM tenants.business 
WHERE slug = 'does-mobile-detailing';
```

3. **Default content in `website.content`**:
```sql
SELECT c.id, c.business_id, c.hero_title, c.hero_subtitle
FROM website.content c
JOIN tenants.business b ON c.business_id = b.id
WHERE b.slug = 'does-mobile-detailing';
```

## Auto-Save Feature Test

The form automatically saves progress to `localStorage`:

1. Start filling out the form (get to Step 2 or 3)
2. Refresh the page
3. You should see a browser prompt: "We found a saved draft. Would you like to continue where you left off?"
4. Click "OK" to restore your progress

## Edge Cases to Test

### 1. Duplicate Email
- Try signing up with the same email twice
- Should receive error: "An account with this email already exists"

### 2. Duplicate Business Name
- Sign up two businesses with the same name
- The second should get a slug like `business-name-1`

### 3. Validation Errors
Test form validation by:
- Leaving required fields empty
- Entering invalid email formats
- Entering invalid phone numbers
- Entering ZIP codes with wrong format

### 4. Navigation
- Use the "Back" button to go to previous steps
- Ensure data persists when navigating back and forth

## Industry Templates

Test different industries to verify templates:

1. **Mobile Detailing**: `mobile-detailing`
2. **Maid Service**: `maid-service`
3. **Lawn Care**: `lawncare`
4. **Pet Grooming**: `pet-grooming`
5. **Barber Shop**: `barber`

Each industry should load its specific template with appropriate imagery and content.

## Known Limitations

1. **Payment Processing**: Stripe integration is UI-only; no actual charges are processed
2. **Email Notifications**: Currently logs to console instead of sending actual emails
3. **Password Reset**: Users need to contact support to set their password
4. **Dashboard Access**: Requires authentication (currently bypassed in DEV mode)

## Troubleshooting

### Form won't submit
- Check browser console for errors
- Verify backend is running on port 3001
- Check backend console for error messages

### Website doesn't load after signup
- Verify the slug was generated correctly
- Check that tenant status is 'approved' in database
- Ensure website.content record was created

### Validation errors won't clear
- Try refreshing the page
- Check browser console for JavaScript errors

## Success Criteria

✅ User can complete all steps without errors  
✅ Backend creates user, tenant, and content records  
✅ Unique slug is generated from business name  
✅ Success page displays with website link  
✅ New website loads with correct content  
✅ Auto-save works on page refresh  
✅ Validation prevents invalid submissions  
✅ Backend logs new signup information  

## Next Steps

After successful testing, consider:

1. Implementing Stripe payment processing
2. Setting up email service (SendGrid, AWS SES, etc.)
3. Adding password reset functionality
4. Creating tenant dashboard for content management
5. Adding onboarding email sequence
6. Implementing admin approval workflow (if not auto-approving)

---

**Last Updated**: October 13, 2025  
**Version**: 1.0

