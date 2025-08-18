import React from 'react';
import { Car, Calendar } from 'lucide-react';
import type { DetailerData } from '../types';

interface DashboardHeaderProps {
  detailerData: DetailerData;
  onBackToForm: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  detailerData, 
  onBackToForm 
}) => {
  return (
    <div className="bg-stone-800 rounded-2xl shadow-lg border border-stone-700 mb-8 overflow-hidden">
      <div className="px-8 py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          {/* Left side - Business Info */}
          <div className="flex items-center space-x-6 mb-6 lg:mb-0">
            {/* Business Avatar/Logo */}
            <div className="relative">
              <div className="h-20 w-20 bg-stone-700 rounded-2xl flex items-center justify-center shadow-sm border border-stone-600">
                <Car className="h-10 w-10 text-orange-500" />
              </div>
              <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-green-500 rounded-full border-2 border-stone-800 shadow-sm"></div>
            </div>
            {/* Business Details */}
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">
                {detailerData?.business_name || "Your Business Name"}
              </h1>
              <p className="text-gray-300 text-lg mb-1">
                {detailerData?.first_name && detailerData?.last_name 
                  ? `${detailerData.first_name} ${detailerData.last_name}` 
                  : "Owner Name"}
              </p>
              <div className="flex items-center text-gray-400 mb-1">
                <Car className="h-4 w-4 mr-2" />
                <span>{detailerData?.location || "Business Location"}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>In business since {detailerData?.memberSince || "2019"}</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full lg:w-auto">
            <div className="bg-stone-700 rounded-xl p-4 text-center border border-stone-600">
              <div className="text-2xl font-bold text-white">$2,450</div>
              <div className="text-gray-300 text-sm">This Week</div>
            </div>
            <div className="bg-stone-700 rounded-xl p-4 text-center border border-stone-600">
              <div className="text-2xl font-bold text-white">23</div>
              <div className="text-gray-300 text-sm">Appointments</div>
            </div>
            <div className="bg-stone-700 rounded-xl p-4 text-center border border-stone-600">
              <div className="text-2xl font-bold text-white">142</div>
              <div className="text-gray-300 text-sm">Customers</div>
            </div>
            <div className="bg-stone-700 rounded-xl p-4 text-center border border-stone-600">
              <div className="text-2xl font-bold text-white">4.9★</div>
              <div className="text-gray-300 text-sm">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};