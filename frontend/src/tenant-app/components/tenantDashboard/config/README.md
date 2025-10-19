# Dashboard Tab Configuration

This system allows you to enable/disable dashboard tabs for different tenants based on their subscription level or preferences.

## Configuration Files

- `tabConfig.ts` - Main configuration file
- `README.md` - This documentation

## How to Use

### 1. Default Configuration

The `DEFAULT_TAB_CONFIG` object controls which tabs are visible by default for all tenants:

```typescript
export const DEFAULT_TAB_CONFIG: TabConfig = {
  schedule: false,
  customers: false,
  performance: true,
  services: false,
  locations: true,
  profile: true,
};
```

### 2. Tenant-Specific Configuration

To customize tabs for specific tenants, add them to the `TENANT_TAB_CONFIGS` object:

```typescript
export const TENANT_TAB_CONFIGS: Record<string, Partial<TabConfig>> = {
  'jps': {
    schedule: true,    // Enable schedule for JPS
    customers: true,   // Enable customers for JPS
    services: false,   // Keep services disabled
  },
  'premium-tenant': {
    schedule: true,
    customers: true,
    services: true,    // Enable all features for premium
  },
  'basic-tenant': {
    schedule: false,
    customers: false,
    services: false,   // Disable most features for basic
  },
};
```

### 3. Available Tabs

- `overview` - Always visible (cannot be disabled)
- `website` - Website content and performance management (with Content, Performance, Health, and Domain sub-tabs)
- `locations` - Service area management
- `profile` - Business profile settings
- `schedule` - Appointment scheduling
- `customers` - Customer management
- `services` - Service management

### 4. How It Works

1. When a tenant accesses the dashboard, the system checks for tenant-specific configuration
2. If found, it merges the tenant config with the default config
3. If not found, it uses the default configuration
4. Tabs are filtered based on the final configuration
5. Disabled tabs show a "Feature Not Available" message

### 5. Adding New Tenants

To add a new tenant configuration:

1. Open `tabConfig.ts`
2. Add a new entry to `TENANT_TAB_CONFIGS` with the tenant's slug as the key
3. Set the desired tab visibility (true/false)
4. Save the file

Example:
```typescript
'new-tenant': {
  schedule: true,
  customers: false,
  performance: true,
  services: true,
  locations: true,
  profile: true,
},
```

### 6. Dynamic Configuration (Future Enhancement)

In the future, this could be enhanced to:
- Load configuration from a database
- Allow real-time updates without code changes
- Support different subscription tiers
- Include feature expiration dates
