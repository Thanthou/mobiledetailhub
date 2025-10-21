/**
 * React hook for FAQ schema management
 * Provides both runtime generation and pre-built schema loading
 */

import { useMemo } from 'react';

import type { FAQItem } from '@tenant-app/components/faq/types';
import { generateFAQSchema } from '@shared/utils/schemaUtils';

interface UseFAQSchemaResult {
  /** Generated FAQ schema */
  schema: Record<string, unknown> | null;
  /** Whether schema was generated */
  hasSchema: boolean;
  /** Number of FAQs */
  faqCount: number;
  /** Generation method used */
  method: 'runtime' | 'prebuilt' | 'none';
}

/**
 * Hook to generate FAQ schema from FAQ items
 */
export function useFAQSchema(faqs: FAQItem[]): UseFAQSchemaResult {
  return useMemo(() => {
    if (faqs.length === 0) {
      return {
        schema: null,
        hasSchema: false,
        faqCount: 0,
        method: 'none'
      };
    }

    // Convert FAQItem format to schema format
    const convertedFAQs = faqs.map(faq => ({
      id: faq.id,
      q: faq.question,
      a: faq.answer
    }));

    const schema = generateFAQSchema(convertedFAQs);

    return {
      schema,
      hasSchema: true,
      faqCount: faqs.length,
      method: 'runtime'
    };
  }, [faqs]);
}

/**
 * Hook to load pre-built FAQ schema for a location
 */
export function usePrebuiltFAQSchema(locationSlug: string): UseFAQSchemaResult {
  return useMemo(() => {
    if (!locationSlug) {
      return {
        schema: null,
        hasSchema: false,
        faqCount: 0,
        method: 'none'
      };
    }

    // In a real implementation, you would fetch the pre-built schema
    // For now, we'll simulate this with a dynamic import
    // const schemaPath = `/schemas/locations/${locationSlug}-faq.json`;
    
    // This would be replaced with actual fetching in production
    // const schema = await fetch(schemaPath).then(r => r.json());
    
    return {
      schema: null, // Would be the actual schema
      hasSchema: false, // Would be true if schema exists
      faqCount: 0, // Would be parsed from schema
      method: 'prebuilt'
    };
  }, [locationSlug]);
}

/**
 * Hook that tries pre-built schema first, falls back to runtime generation
 */
export function useOptimizedFAQSchema(
  faqs: FAQItem[], 
  locationSlug?: string
): UseFAQSchemaResult {
  const prebuiltResult = usePrebuiltFAQSchema(locationSlug || '');
  const runtimeResult = useFAQSchema(faqs);

  return useMemo(() => {
    // Prefer pre-built schema if available
    if (prebuiltResult.hasSchema) {
      return prebuiltResult;
    }

    // Fall back to runtime generation
    return runtimeResult;
  }, [prebuiltResult, runtimeResult]);
}

/**
 * Hook for FAQ schema statistics
 */
export function useFAQSchemaStats(faqs: FAQItem[]): {
  totalFAQs: number;
  faqsWithIds: number;
  faqsWithoutIds: number;
  averageAnswerLength: number;
  shortAnswers: number;
  longAnswers: number;
  categories: string[];
  recommendations: string[];
} {
  return useMemo(() => {
    if (faqs.length === 0) {
      return {
        totalFAQs: 0,
        faqsWithIds: 0,
        faqsWithoutIds: 0,
        averageAnswerLength: 0,
        shortAnswers: 0,
        longAnswers: 0,
        categories: [],
        recommendations: []
      };
    }

    const faqsWithIds = faqs.filter(faq => faq.id).length;
    const faqsWithoutIds = faqs.length - faqsWithIds;
    
    const answerLengths = faqs.map(faq => faq.answer.length);
    const averageAnswerLength = answerLengths.reduce((sum, len) => sum + len, 0) / faqs.length;
    
    const shortAnswers = answerLengths.filter(len => len < 50).length;
    const longAnswers = answerLengths.filter(len => len > 200).length;
    
    const categories = [...new Set(faqs.map(faq => faq.category).filter(Boolean))];
    
    const recommendations: string[] = [];
    if (faqsWithoutIds > 0) {
      recommendations.push(`Add IDs to ${faqsWithoutIds} FAQs for better analytics`);
    }
    if (shortAnswers > 0) {
      recommendations.push(`${shortAnswers} FAQs have short answers - consider expanding for SEO`);
    }
    if (categories.length === 0) {
      recommendations.push('Consider categorizing FAQs for better organization');
    }

    return {
      totalFAQs: faqs.length,
      faqsWithIds,
      faqsWithoutIds,
      averageAnswerLength: Math.round(averageAnswerLength),
      shortAnswers,
      longAnswers,
      categories,
      recommendations
    };
  }, [faqs]);
}
