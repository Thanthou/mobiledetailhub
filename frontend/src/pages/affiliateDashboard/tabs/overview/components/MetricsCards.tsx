import React from 'react';
import { TrendingUp, DollarSign, Users, Calendar, Star } from 'lucide-react';

export const MetricsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-stone-800 p-6 rounded-xl border border-stone-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Daily Revenue</p>
            <p className="text-2xl font-bold text-white">$485</p>
            <p className="text-green-400 text-sm flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from yesterday
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-orange-500" />
        </div>
      </div>

      <div className="bg-stone-800 p-6 rounded-xl border border-stone-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Today's Bookings</p>
            <p className="text-2xl font-bold text-white">8</p>
            <p className="text-blue-400 text-sm flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              3 confirmed, 5 pending
            </p>
          </div>
          <Calendar className="h-8 w-8 text-orange-500" />
        </div>
      </div>

      <div className="bg-stone-800 p-6 rounded-xl border border-stone-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">New Customers</p>
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-green-400 text-sm flex items-center mt-1">
              <Users className="h-3 w-3 mr-1" />
              This month
            </p>
          </div>
          <Users className="h-8 w-8 text-orange-500" />
        </div>
      </div>

      <div className="bg-stone-800 p-6 rounded-xl border border-stone-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Average Rating</p>
            <p className="text-2xl font-bold text-white">4.9</p>
            <p className="text-yellow-400 text-sm flex items-center mt-1">
              <Star className="h-3 w-3 mr-1" />
              Based on 89 reviews
            </p>
          </div>
          <Star className="h-8 w-8 text-orange-500" />
        </div>
      </div>
    </div>
  );
};