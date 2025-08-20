import React from 'react';
import { useNavigate } from 'react-router-dom';

const DevModeDropdown: React.FC = () => {
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'mdh') {
      navigate('/');
    } else if (value === 'affiliate') {
      navigate('/jps'); // Replace 'jps' with any test affiliate slug
    } else if (value === 'dashboard') {
      navigate('/affiliate-dashboard');
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <select
        className="p-1 rounded shadow-lg bg-white text-black border border-gray-300"
        onChange={handleChange}
        defaultValue=""
        aria-label="Dev Mode Navigation"
      >
        <option value="" disabled>
          Dev Mode: Jump to...
        </option>
        <option value="mdh">MDH (Main Site)</option>
        <option value="affiliate">Affiliate (e.g., /jps)</option>
        <option value="dashboard">Detailer Dashboard</option>
      </select>
    </div>
  );
};

export default DevModeDropdown;