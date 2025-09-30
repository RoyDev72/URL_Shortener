import { useState, useCallback } from "react";

export default function useFetch(cb) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fn = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const res = await cb(...args);
        setData(res);
        return res;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [cb]
  );

  return { loading, error, data, fn };
}