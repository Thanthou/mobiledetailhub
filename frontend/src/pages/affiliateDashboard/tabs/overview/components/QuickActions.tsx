import { Car, Package,Plus, Users } from 'lucide-react';
import React from 'react';

export const QuickActions: React.FC = () => (
  <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
    <div className="grid grid-cols-2 gap-3">
      <button className="flex items-center justify-center p-4 bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors">
        <Plus className="h-5 w-5 text-blue-400 mr-2" />
        <span className="text-sm font-medium text-blue-200">New Appointment</span>
      </button>
      <button className="flex items-center justify-center p-4 bg-green-900 hover:bg-green-800 rounded-lg transition-colors">
        <Users className="h-5 w-5 text-green-400 mr-2" />
        <span className="text-sm font-medium text-green-200">Add Customer</span>
      </button>
      <button className="flex items-center justify-center p-4 bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors">
        <Car className="h-5 w-5 text-purple-400 mr-2" />
        <span className="text-sm font-medium text-purple-200">Quick Service</span>
      </button>
      <button className="flex items-center justify-center p-4 bg-orange-900 hover:bg-orange-800 rounded-lg transition-colors">
        <Package className="h-5 w-5 text-orange-400 mr-2" />
        <span className="text-sm font-medium text-orange-200">Check Inventory</span>
      </button>
    </div>
  </div>
);

export default QuickActions;
