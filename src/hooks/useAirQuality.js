import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAirQualityData, KOLKATA_COORDS } from '../services/airQualityService';

/**
 * Custom React hook for fetching and managing live Open-Meteo Air Quality telemetry.
 * 
 * Features:
 * - Auto-fetch on mount and coordinate changes.
 * - Loading, error, and lastUpdated states.
 * - AbortController cleanup to cancel inflight requests on unmount.
 * - Manual refetch capability.
 * - Does not invent fallback data if API returns an error or empty payload.
 */
export function useAirQuality({
  latitude = KOLKATA_COORDS.latitude,
  longitude = KOLKATA_COORDS.longitude,
} = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const abortControllerRef = useRef(null);

  const fetchAqi = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchAirQualityData({
        latitude,
        longitude,
        signal: controller.signal,
      });

      setData(result);
      setLastUpdated(result.fetchedAt);
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // aborted intentionally
      }
      setError(err.message || 'Failed to fetch air quality telemetry.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchAqi();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAqi]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchAqi,
  };
}
