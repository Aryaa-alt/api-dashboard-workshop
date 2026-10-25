import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchExchangeRates } from '../services/currencyService';

const DEFAULT_QUOTES = ['INR', 'EUR', 'GBP', 'JPY'];

/**
 * Custom React hook for Frankfurter v2 Exchange Rates
 */
export function useCurrency({
  base = 'USD',
  quotes = DEFAULT_QUOTES,
} = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const abortControllerRef = useRef(null);
  const quotesKey = Array.isArray(quotes) ? quotes.join(',') : String(quotes);

  const fetchRates = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchExchangeRates({
        base,
        quotes: quotesKey.split(','),
        signal: controller.signal,
      });

      setData(result);
      setLastUpdated(result.fetchedAt);
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Failed to fetch currency rates.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [base, quotesKey]);

  useEffect(() => {
    fetchRates();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchRates]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    rateDate: data?.rateDate || null,
    refetch: fetchRates,
  };
}
