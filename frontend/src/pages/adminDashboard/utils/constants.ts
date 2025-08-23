export const ADMIN_TABS = [
  { id: 'database', label: 'Database', icon: 'Database' },
  { id: 'users', label: 'Users', icon: 'Users' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
] as const;

export const QUERY_TEMPLATES = [
  { value: 'SELECT * FROM users LIMIT 10;', label: 'Show Users' },
  { value: 'SELECT COUNT(*) FROM users;', label: 'Count Users' },
  { value: 'SELECT * FROM affiliates LIMIT 10;', label: 'Show Affiliates' },
  { value: 'SELECT * FROM mdh_config;', label: 'Show MDH Config' },
  { value: 'SELECT * FROM service_areas LIMIT 10;', label: 'Show Service Areas' },
  { value: 'SHOW TABLES;', label: 'Show Tables' },
  { value: 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\';', label: 'List All Tables' },
  { value: 'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\';', label: 'Describe Users Table' },
] as const;
