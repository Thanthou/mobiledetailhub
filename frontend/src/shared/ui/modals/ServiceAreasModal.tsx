import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin } from 'lucide-react';

interface ServiceArea {
  city: string;
  state: string;
  zip?: string;
  primary?: boolean;
  minimum?: number;
  multiplier?: number;
}

interface ServiceAreasModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceAreas: ServiceArea[];
  businessName?: string;
}

const ServiceAreasModal: React.FC<ServiceAreasModalProps> = ({
  isOpen,
  onClose,
  serviceAreas,
  businessName = 'Our Business'
}) => {
  // Group service areas by state
  const areasByState = useMemo(() => {
    const grouped: Record<string, ServiceArea[]> = {};
    
    serviceAreas.forEach(area => {
      if (!grouped[area.state]) {
        grouped[area.state] = [];
      }
      grouped[area.state].push(area);
    });
    
    // Sort states alphabetically
    const sortedStates = Object.keys(grouped).sort();
    const result: Record<string, ServiceArea[]> = {};
    sortedStates.forEach(state => {
      // Sort cities within each state, with primary first
      result[state] = grouped[state].sort((a, b) => {
        if (a.primary && !b.primary) return -1;
        if (!a.primary && b.primary) return 1;
        return a.city.localeCompare(b.city);
      });
    });
    
    return result;
  }, [serviceAreas]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-stone-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-stone-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Service Areas</h2>
            <p className="text-gray-400 mt-1">Where {businessName} provides mobile detailing services</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-stone-700 rounded-lg"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {Object.entries(areasByState).map(([state, areas]) => (
            <div key={state} className="mb-8 last:mb-0">
              {/* State Header */}
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-orange-400" />
                <h3 className="text-xl font-semibold text-orange-400">
                  {state}
                </h3>
                <span className="text-gray-400 text-sm">
                  ({areas.length} {areas.length === 1 ? 'city' : 'cities'})
                </span>
              </div>

              {/* Cities Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ml-7">
                {areas.map((area, index) => (
                  <div
                    key={`${area.state}-${area.city}-${index}`}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></div>
                    <span className="text-sm">
                      {area.city}
                      {area.primary && (
                        <span className="ml-2 text-xs text-orange-400 font-medium">
                          Primary
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {serviceAreas.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No service areas configured</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-700 bg-stone-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {serviceAreas.length} total service {serviceAreas.length === 1 ? 'area' : 'areas'}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ServiceAreasModal;

