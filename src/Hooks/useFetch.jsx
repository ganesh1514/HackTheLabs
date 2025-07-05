import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cb(options, ...args);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, fetchData };
};
export default useFetch;
