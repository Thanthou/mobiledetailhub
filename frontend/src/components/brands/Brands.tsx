
   // In src/components/hero/Hero.tsx
   const Brands = () => {
    return <div>Brands Section (placeholder)</div>;
  };
  export default Brands;

// import React from 'react';
// import { useBusinessConfig } from '../../hooks/useBusinessConfig';
// import BrandsGrid from './BrandsGrid';
// import BrandsLoadingState from './BrandsLoadingState';
// import BrandsErrorState from './BrandsErrorState';
// import BrandsEmptyState from './BrandsEmptyState';
// import { getBrands } from '../../config/brands';

// const Brands: React.FC = () => {
//   const { businessConfig, isLoading, error } = useBusinessConfig();
//   console.log('Brands businessConfig:', businessConfig);

//   // Show loading state while waiting for config
//   if (isLoading || !businessConfig) {
//     return <BrandsLoadingState />;
//   }

//   if (error) {
//     return <BrandsErrorState error={error} />;
//   }

//   // Get brands data from business config
//   const { brands } = businessConfig;
  
//   // Handle both old items structure and new keywords structure
//   let brandItems: any[] = [];
  
//   if (brands?.keywords && brands.keywords.length > 0) {
//     // New keyword-based system
//     brandItems = getBrands(brands.keywords);
//   } else if (brands?.items && brands.items.length > 0) {
//     // Old items-based system (for backward compatibility)
//     brandItems = brands.items;
//   }
//   console.log('Brand items to render:', brandItems);
  
//   // If no brands data in config, show empty state
//   if (!brands || brandItems.length === 0) {
//     return <BrandsEmptyState />;
//   }

//   const headline = brands.headline || 'Trusted brands we work with';

//   return (
//     <section className="bg-stone-800 py-10">
//       <div className="w-full">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-white mb-2">
//             {headline}
//           </h2>
//         </div>
       
//         <BrandsGrid brandItems={brandItems} />
//       </div>
//     </section>
//   );
// };

// export default Brands;