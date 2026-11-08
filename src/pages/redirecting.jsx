import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import React from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";
import { storeClicks } from "@/db/apiClicks";
const RedirectPage = () => {
  const { id } = useParams();
  const { loading, data, fn } = useFetch(getLongUrl, id);

  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn(id);
  }, [fn, id]);

  useEffect(() => {
    if (!loading && data) {
      fnStats({
        id: data.id,
        originalUrl: data.original_url,
      });
    }
  }, [loading, data, fnStats]);

  if(loading || loadingStats){
    return(
      <>
        <BarLoader width={"100%"} color="#36d7d7"/>
        <br/>
        Redirecting...
      </>
    )
  }

  
  return null
};

export default RedirectPage;
