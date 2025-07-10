import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CityStats from "@/components/ui/CityStats";
import DeleteUrl from "@/components/ui/DeleteUrl";
import DeviceStats from "@/components/ui/DeviceStats";
import { useAuth } from "@/contexts/AuthContext";
import { getSpecificUrlClicks } from "@/db/apiClicks";
import { getSpecificUrl } from "@/db/apiUrls";
import useFetch from "@/Hooks/useFetch";
import { downloadQr } from "@/lib/downloadQr";
import { Copy, Download, LinkIcon } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const Link = () => {
  const { id } = useParams();
  const { getUserProfile } = useAuth();
  const userProfile = getUserProfile();
  const navigate = useNavigate();
  const {
    loading: linkLoading,
    data: linkData,
    error: linkError,
    fetchData: refetchLink,
  } = useFetch(getSpecificUrl, { id: id, userId: userProfile?.id });

  const {
    loading: statsLoading,
    data: statsData,
    error: statsError,
    fetchData: refetchStats,
  } = useFetch(getSpecificUrlClicks, { id: id });

  const handleDownload = () => {
    downloadQr(linkData);
  };

  useEffect(() => {
    refetchLink();
  }, []);

  useEffect(() => {
    if (!linkLoading && linkData) {
      refetchStats();
    }
  }, [linkData]);

  if (linkError || statsError) {
    toast.error(
      "Error Fetching the link details. Please try again, redirecting to dashboard."
    );
    navigate("/dashboard");
    return;
  }

  if (linkLoading || statsLoading) {
    return <LoadingSpinner message="Loading link details..." />;
  }

  return (
    <>
      <div className="flex flex-col gap-8 md:flex-row justify-between sm:mt-4">
        <div className=" flex flex-col flex-1 gap-4 items-start rounded-lg p-3 md:w-2/5">
          <div className="flex flex-col gap-3 w-full bg-gray-800 p-4 rounded-lg">
            <span className="text-xl sm:text-2xl md:text-4xl font-semibold hover:underline">
              {linkData?.title}
            </span>
            <a
              href={`https://laburl.in/${
                linkData?.custom_url || linkData?.short_url
              }`}
              target="_blank"
              className="text-2xl sm:text-3xl text-blue-400 font-semibold hover:underline cursor-pointer break-all"
            >
              {`https://laburl.in/${
                linkData?.custom_url || linkData?.short_url
              }`}
            </a>
            <a
              href={linkData?.original_url}
              target="_blank"
              className="flex items-center gap-3 text-sm sm:text-base text-gray-300 hover:underline cursor-pointer break-all"
            >
              <LinkIcon className="h-8 w-8 p-1 flex-shrink-0 bg-gray-600 text-white rounded" />
              {linkData?.original_url}
            </a>
            <span className="text-sm  text-gray-400 flex items-end ">
              {`${new Date(linkData?.created_at).toLocaleDateString()}
              ${new Date(linkData?.created_at).toLocaleTimeString()}`}
            </span>
            <hr />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://laburl.vercel.app/${
                      linkData?.custom_url || linkData?.short_url
                    }`
                  );
                  toast.success("Link copied to clipboard");
                }}
                className="hover:bg-primary-orange hover:text-white cursor-pointer"
              >
                <Copy />
              </Button>

              <Button
                variant="ghost"
                className="hover:bg-primary-orange hover:text-white cursor-pointer"
                onClick={handleDownload}
              >
                <Download />
              </Button>
              <DeleteUrl url={linkData} />
              {/* REPLACE the old Trash button with this AlertDialog */}
            </div>
          </div>
          <img
            src={linkData?.qr}
            className="w-[256px] self-center sm:self-start ring ring-blue-500 p-1 object-contain rounded-xl"
            alt="qr code"
          />
        </div>
        <div className="md:w-3/5 flex flex-1 flex-col gap-4">
          {statsData?.length ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <hr />
                <CardContent>
                  <p>{statsData?.length || 0}</p>
                </CardContent>
              </Card>
              <CityStats stats={statsData} />
              <DeviceStats stats={statsData} />
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Stats Yet</CardTitle>
              </CardHeader>
              <hr />
              <CardContent className="text-center">
                <p className="text-gray-500">
                  This link has not been clicked yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Link;
