
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { getLongUrl } from "@/db/apiUrls";
import { storeClicks } from "@/db/apiClicks";

const RedirectPage = () => {
  const { id } = useParams();
  const redirected = useRef(false);

  const {
    loading,
    data,
    fn,
    err: error,
  } = useFetch(getLongUrl);

  useEffect(() => {
    if (id) {
      fn(id);
    }
  }, [id]);

  useEffect(() => {
    if (!data?.original_url || redirected.current) return;

    redirected.current = true;

    const redirect = async () => {
      try {
        await storeClicks({ id: data.id });
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        window.location.replace(data.original_url);
      }
    };

    redirect();
  }, [data]);

  if (loading) {
    return (
      <>
        <BarLoader width="100%" color="#36d7d7" />
        <br />
        Redirecting...
      </>
    );
  }

  if (error) {
    return <p>Short link not found or unavailable.</p>;
  }

  return <p>Redirecting...</p>;
};

export default RedirectPage;
