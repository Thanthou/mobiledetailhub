// Hero-specific API calls
// This can be used for dynamic hero content, location-based hero data, etc.

export const heroApi = {
  // Example: Get location-based hero content
  getLocationBasedContent: async (location: string) => {
    // Implementation would go here
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async operation
    return {
      title: `Mobile Detailing in ${location}`,
      subtitle: "Professional services near you"
    };
  }
};
