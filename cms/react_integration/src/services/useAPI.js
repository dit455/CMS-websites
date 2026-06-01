/**
 * Custom React Hook: useAPI
 * 
 * A simple, reusable hook that handles loading/error state
 * for any API call. Use this in your components to avoid
 * repeating the same useState + useEffect pattern.
 * 
 * Place this file in: src/services/useAPI.js
 * 
 * EXAMPLE USAGE:
 * 
 *   import { useAPI } from '../services/useAPI';
 *   import { documentsAPI } from '../services/api';
 * 
 *   function Documents() {
 *     const { data, loading, error } = useAPI(documentsAPI.getAll);
 *     if (loading) return <p>Loading...</p>;
 *     if (error) return <p>Error loading documents</p>;
 *     return data.results.map(doc => <div key={doc.id}>{doc.title}</div>);
 *   }
 */

import { useState, useEffect, useCallback } from 'react';

export function useAPI(apiFunction, params = null, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = params
        ? await apiFunction(params)
        : await apiFunction();
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error('useAPI error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params, ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
