import React, { useEffect, useState } from 'react';
import ContactGrid from './Grid';

const ContactMDH: React.FC = () => {
  const [mdhConfig, setMdhConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/mdh-config')
      .then(res => res.json())
      .then(data => {
        setMdhConfig(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="contact" className="bg-stone-700 py-12">
        <div className="max-w-6xl mx-auto px-2">
          <div className="text-center text-white">Loading contact...</div>
        </div>
      </section>
    );
  }

  if (error || !mdhConfig) {
    return (
      <section id="contact" className="bg-stone-700 py-12">
        <div className="max-w-6xl mx-auto px-2">
          <div className="text-center text-white">Error loading contact</div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-stone-700 py-12">
      <div className="max-w-6xl mx-auto px-2">
        <ContactGrid config={mdhConfig} />
      </div>
    </section>
  );
};

export default ContactMDH;