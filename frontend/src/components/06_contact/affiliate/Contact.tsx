import React, { useEffect, useState } from 'react';
import ContactGrid from './Grid';
import { useSiteContext } from '../../../hooks/useSiteContext';

const Contact: React.FC = () => {
  const { businessSlug } = useSiteContext();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!businessSlug) return;
    setLoading(true);
    fetch(`/api/businesses/${businessSlug}`)
      .then(res => res.json())
      .then(data => {
        setBusiness(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [businessSlug]);

  if (loading) {
    return (
      <section id="contact" className="bg-stone-700 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-white">Loading contact...</div>
        </div>
      </section>
    );
  }

  if (error || !business) {
    return (
      <section id="contact" className="bg-stone-700 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-white">Error loading contact</div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-stone-700 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <ContactGrid config={business} />
      </div>
    </section>
  );
};

export default Contact;