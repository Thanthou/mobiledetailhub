import React from 'react';
import { Car, Package,Plus, Users } from 'lucide-react';

import { Button } from '@/shared/ui';

export const QuickActions: React.FC = () => (
  <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
    <div className="grid grid-cols-2 gap-3">
      <Button 
        variant="secondary" 
        size="md"
        className="flex items-center justify-center p-4 bg-blue-900 hover:bg-blue-800"
        leftIcon={<Plus className="h-5 w-5 text-blue-400" />}
      >
        <span className="text-sm font-medium text-blue-200 ml-2">New Appointment</span>
      </Button>
      <Button 
        variant="secondary" 
        size="md"
        className="flex items-center justify-center p-4 bg-green-900 hover:bg-green-800"
        leftIcon={<Users className="h-5 w-5 text-green-400" />}
      >
        <span className="text-sm font-medium text-green-200 ml-2">Add Customer</span>
      </Button>
      <Button 
        variant="secondary" 
        size="md"
        className="flex items-center justify-center p-4 bg-purple-900 hover:bg-purple-800"
        leftIcon={<Car className="h-5 w-5 text-purple-400" />}
      >
        <span className="text-sm font-medium text-purple-200 ml-2">Quick Service</span>
      </Button>
      <Button 
        variant="secondary" 
        size="md"
        className="flex items-center justify-center p-4 bg-orange-900 hover:bg-orange-800"
        leftIcon={<Package className="h-5 w-5 text-orange-400" />}
      >
        <span className="text-sm font-medium text-orange-200 ml-2">Check Inventory</span>
      </Button>
    </div>
  </div>
);

export default QuickActions;
