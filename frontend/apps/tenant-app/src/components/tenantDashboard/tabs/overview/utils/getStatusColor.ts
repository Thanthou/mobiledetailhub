export const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-900 text-green-300';
    case 'pending': return 'bg-yellow-900 text-yellow-300';
    case 'cancelled': return 'bg-red-900 text-red-300';
    default: return 'bg-gray-700 text-gray-300';
  }
};
