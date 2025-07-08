import LoadingSpinner from "@/components/LoadingSpinner";
import { getLongUrl, storeClicks } from "@/db/apiUrls";
import useFetch from "@/Hooks/useFetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const RedirectLink = () => {
  const { id } = useParams();
  const {
    loading: longUrltLoading,
    data: longUrlData,
    fetchData: fnGetLongUrl, //* gets the long URL data
  } = useFetch(getLongUrl, { url_id: id });

  const {
    loading: clickLoading,
    fetchData: fnClickStats /*stores the clcks stats*/,
  } = useFetch(storeClicks, {
    id: longUrlData?.id,
    originalUrl: longUrlData?.original_url,
  });

  useEffect(() => {
    fnGetLongUrl();
  }, []);

  useEffect(() => {
    if (!longUrltLoading && longUrlData) {
      fnClickStats();
    }
  }, [longUrltLoading]);

  return (
    <>
      {(longUrltLoading || clickLoading) && (
        <LoadingSpinner message="Redirecting..." />
      )}
    </>
  );
};

export default RedirectLink;
