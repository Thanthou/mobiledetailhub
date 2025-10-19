/**
 * JSON-LD Schema Component
 * Renders structured data for SEO
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface JsonLdSchemaProps {
  schema: any | any[];
  id?: string;
}

export const JsonLdSchema: React.FC<JsonLdSchemaProps> = ({ schema, id }) => {
  const schemas = Array.isArray(schema) ? schema : [schema];
  
  return (
    <Helmet>
      {schemas.map((schemaData, index) => (
        <script
          key={id ? `${id}-${index}` : index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData, null, 2),
          }}
        />
      ))}
    </Helmet>
  );
};
