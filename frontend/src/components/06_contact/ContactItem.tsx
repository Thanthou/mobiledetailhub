import React from 'react';

interface ContactItemProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon: Icon, title, children }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="bg-orange-500 p-3 rounded-full">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="text-left w-48">
        <h3 className="font-semibold text-white">{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default ContactItem;