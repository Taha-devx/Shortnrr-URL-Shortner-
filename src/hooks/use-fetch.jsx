import { useState } from 'react'
const useFetch = (cb) => {
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState(null);
  const [data, setData] = useState(null);

    const fn = async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const response = await cb(...args);
            setData(response);
            setError(null);
            return response;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    return { data, err, loading, fn };
}

export default useFetch