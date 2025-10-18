# Custom Domain Support Issues Report

**Date**: October 18, 2025  
**Priority**: High  
**Status**: Identified - Not Implemented  
**Estimated Effort**: 2-3 days

## 🚨 **Critical Issues When Tenants Switch to Custom Domains**

### 1. **Hardcoded Development URLs in Admin Dashboard**
**File**: `frontend/src/features/adminDashboard/components/tabs/users/UsersTab.tsx`  
**Lines**: 483, 495

```typescript
// PROBLEM: Hardcoded .lvh.me subdomains
href={`http://${user.slug}.lvh.me:${window.location.port}/`}
href={`http://${user.slug}.lvh.me:${window.location.port}/dashboard`}
```

**Impact**: Admin dashboard links will be completely broken for tenants with custom domains like `mydomain.com`.

**Current Behavior**: 
- ✅ Works: `testing-mobile-detail.lvh.me:5175`
- ❌ Breaks: `mydomain.com`

---

### 2. **Static Domain Mappings in Frontend**
**File**: `frontend/src/shared/utils/domainUtils.ts`  
**Lines**: 12-18

```typescript
// PROBLEM: Hardcoded domain mappings
const CUSTOM_DOMAIN_MAPPINGS: Record<string, string> = {
  'jpsdetailing.com': 'jps',
  'example.com': 'example',
  'thatsmartsite.com': 'main-site',
  // This requires code changes for each new tenant!
};
```

**Impact**: 
- Every new tenant domain requires a code deployment
- No dynamic domain management
- Scalability nightmare

---

### 3. **Missing Backend Domain Resolution**
**Current State**: No API endpoint to resolve custom domains to tenant slugs

**Required**: 
- Database field for `custom_domain` in tenants table
- API endpoint: `GET /api/tenants/by-domain/{domain}`
- Domain validation and SSL management

---

### 4. **Environment-Aware URL Generation Missing**
**Current State**: URLs are hardcoded for development environment

**Required**: Dynamic URL generation based on:
- Development: `{slug}.lvh.me:port`
- Production subdomain: `{slug}.thatsmartsite.com`
- Custom domain: `{custom_domain}`

---

## 🔧 **Required Solutions**

### Phase 1: Backend Infrastructure
1. **Database Schema Update**
   ```sql
   ALTER TABLE tenants ADD COLUMN custom_domain VARCHAR(255) UNIQUE;
   ALTER TABLE tenants ADD COLUMN domain_verified BOOLEAN DEFAULT FALSE;
   ALTER TABLE tenants ADD COLUMN ssl_enabled BOOLEAN DEFAULT FALSE;
   ```

2. **API Endpoints**
   ```typescript
   // New endpoints needed:
   GET /api/tenants/by-domain/{domain}     // Resolve domain to tenant
   POST /api/tenants/{id}/domain           // Set custom domain
   PUT /api/tenants/{id}/domain            // Update custom domain
   DELETE /api/tenants/{id}/domain         // Remove custom domain
   ```

3. **Domain Validation Service**
   - DNS verification
   - SSL certificate management
   - Domain ownership verification

### Phase 2: Frontend Updates
1. **Dynamic Domain Resolution**
   ```typescript
   // Replace hardcoded mappings with API calls
   async function getTenantByDomain(domain: string) {
     const response = await fetch(`/api/tenants/by-domain/${domain}`);
     return response.json();
   }
   ```

2. **Environment-Aware URL Generation**
   ```typescript
   function getTenantWebsiteUrl(tenant: Tenant) {
     if (tenant.custom_domain) {
       return `https://${tenant.custom_domain}`;
     }
     if (env.DEV) {
       return `http://${tenant.slug}.lvh.me:${window.location.port}`;
     }
     return `https://${tenant.slug}.thatsmartsite.com`;
   }
   ```

3. **Admin Dashboard Updates**
   - Replace hardcoded URLs with dynamic generation
   - Add domain management interface
   - Show domain status (verified, SSL, etc.)

### Phase 3: Domain Management UI
1. **Tenant Dashboard**
   - Domain setup wizard
   - DNS configuration instructions
   - SSL certificate status

2. **Admin Dashboard**
   - Domain management for all tenants
   - Bulk domain operations
   - Domain health monitoring

---

## 📊 **Impact Assessment**

### Current State
- ✅ Subdomain routing works (`tenant.thatsmartsite.com`)
- ✅ Development environment works (`tenant.lvh.me`)
- ❌ Custom domains completely broken

### After Implementation
- ✅ Subdomain routing continues to work
- ✅ Development environment continues to work
- ✅ Custom domains fully supported
- ✅ Scalable domain management
- ✅ Professional tenant onboarding

---

## 🎯 **Implementation Priority**

### High Priority (Must Fix)
1. **Admin dashboard URL generation** - Breaks immediately
2. **Backend domain resolution API** - Core functionality
3. **Database schema updates** - Foundation

### Medium Priority (Should Fix)
1. **Domain management UI** - User experience
2. **SSL certificate automation** - Security
3. **Domain validation** - Data integrity

### Low Priority (Nice to Have)
1. **Bulk domain operations** - Admin efficiency
2. **Domain health monitoring** - Operations
3. **Advanced DNS management** - Power users

---

## 🚀 **Quick Wins (Can Implement Now)**

1. **Environment-aware URL generation function**
2. **Update admin dashboard to use dynamic URLs**
3. **Add custom_domain field to tenant database**

---

## 📝 **Testing Scenarios**

### Test Cases Needed
1. **Subdomain routing**: `tenant.thatsmartsite.com` → works
2. **Custom domain routing**: `mydomain.com` → works
3. **Admin dashboard links**: Generate correct URLs for both
4. **Domain switching**: Tenant changes from subdomain to custom domain
5. **SSL enforcement**: HTTPS redirects work properly
6. **Domain validation**: Invalid domains are rejected

### Edge Cases
- Domain with/without www
- Domain with subdomains
- International domains
- Domain expiration handling
- SSL certificate expiration

---

## 💰 **Business Impact**

### Revenue Impact
- **High**: Custom domains are often a premium feature
- **High**: Professional appearance for tenants
- **Medium**: Reduced support tickets for domain issues

### Technical Debt
- **High**: Current hardcoded approach doesn't scale
- **Medium**: Missing domain management features
- **Low**: Code maintainability issues

---

## 🔗 **Related Files**

### Frontend Files to Update
- `frontend/src/features/adminDashboard/components/tabs/users/UsersTab.tsx`
- `frontend/src/shared/utils/domainUtils.ts`
- `frontend/src/shared/hooks/useTenantSlug.ts`
- `frontend/src/shared/api/tenantConfig.api.ts`

### Backend Files to Create/Update
- `backend/routes/domains.js` (new)
- `backend/controllers/domainController.js` (new)
- `backend/services/domainService.js` (new)
- `backend/database/migrations/add_custom_domain.sql` (new)

### Database Changes
- Add `custom_domain` field to tenants table
- Add domain verification tracking
- Add SSL certificate management

---

**Next Steps**: Add this to your to-dos and prioritize based on business needs. The admin dashboard URL issue should be fixed first as it's a complete blocker for custom domain tenants.
