import { storeClicks } from '@/db/apiClicks';
import useFetch from '@/hooks/use-fetch';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { getLongUrl } from '@/db/apiUrls';

const RedirectPage = () => {
  const { id } = useParams();

  const { loading, data, fn } = useFetch(getLongUrl);
  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks);

  // Fetch the long URL when id changes
  useEffect(() => {
    if (id) fn(id);
  }, [fn, id]);

  // Store click and redirect when data is loaded
  useEffect(() => {
    if (!loading && data) {
      fnStats({ id: data.id, originalUrl: data.original_url });
      // Do NOT redirect here; storeClicks will handle it
    }
  }, [loading, data, fnStats]);

  if (loading || loadingStats) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }

  if (!data) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Link not found.
      </>
    );
  }

  return null;
};

export default RedirectPage;