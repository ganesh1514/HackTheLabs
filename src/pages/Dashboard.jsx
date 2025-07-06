import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Error from "@/components/ui/Error";
import { Input } from "@/components/ui/input";
import LinkCard from "@/components/ui/LinkCard";
import { useAuth } from "@/contexts/AuthContext";
import { getClicks } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrls";
import useFetch from "@/Hooks/useFetch";
import { FilterIcon } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { getUserProfile, loading } = useAuth();
  const userProfile = getUserProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    loading: urlLoading,
    error: urlError,
    data: urls,
    fetchData: fnUrls,
  } = useFetch(getUrls, userProfile?.id);

  const {
    loading: clicksLoading,
    data: clicksData,
    fetchData: fnClicks,
  } = useFetch(
    getClicks,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    if (userProfile?.id) {
      fnUrls();
    }
  }, [userProfile?.id]);

  useEffect(() => {
    if (urls?.length) {
      fnClicks();
    }
  }, [urls?.length]);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="loading dashboard" />;
  } else if (urlLoading || clicksLoading) {
    // Show loading spinner while fetching URLs and clicks

    return <LoadingSpinner message="loading links & clicks" />;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        {/*render total links and clicks*/}

        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <hr />
          <CardContent>
            <p>{urls?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <hr />
          <CardContent>
            <p>{clicksData?.length || 0}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-semibold">My Links</h1>
        <Button>Create Link</Button>
      </div>
      <div className="relative group">
        <div className="relative">
          <Input
            type="text"
            placeholder="Filter links by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-white rounded-r-md bg-primary-orange hover:bg-white hover:text-primary-orange transition-colors duration-200 ">
            <FilterIcon className="ml-2" />
          </button>
        </div>
      </div>
      {urlError && <Error message={urlError?.message} />}
      {(filteredUrls || []).map((url, idx) => {
        return (
          <LinkCard key={idx} url={url} fnUrls={fnUrls} fnClick={fnClicks} />
        );
      })}
    </div>
  );
};

export default Dashboard;
