import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWeatherData, KOLKATA_COORDS } from '../services/weatherService';

/**
 * Custom React hook for fetching and managing live Open-Meteo weather data.
 * 
 * Features:
 * - Automatic fetch on mount / coordinate changes.
 * - Loading, error, and lastUpdated states.
 * - AbortController cleanup to cancel inflight requests on unmount.
 * - Manual refetch capability.
 * - Strictly nulls out or isolates data on failure so no placeholder/sample data is masked.
 */
export function useWeather({
  latitude = KOLKATA_COORDS.latitude,
  longitude = KOLKATA_COORDS.longitude,
} = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Keep a ref to the active abort controller
  const abortControllerRef = useRef(null);

  const fetchWeather = useCallback(async () => {
    // Cancel any previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchWeatherData({
        latitude,
        longitude,
        signal: controller.signal,
      });

      setData(result);
      setLastUpdated(result.fetchedAt);
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was aborted deliberately; do not set error state
        return;
      }
      // Requirement 10: Do not display sample values when the API fails.
      // We set error and leave data as null (or clear previous invalid data if failed)
      setError(err.message || 'Failed to fetch weather telemetry.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchWeather();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeather]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchWeather,
  };
}
