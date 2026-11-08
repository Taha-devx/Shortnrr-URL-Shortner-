import { UrlState } from "@/context";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import { getClicksForUrl } from "@/db/apiClicks";
import useFetch from "@/hooks/use-fetch";
import { BarLoader, BeatLoader } from "react-spinners";
import { LinkIcon, Copy, Download, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LocationStats from "@/components/location-stats";
import DeviceStats from "@/components/device-stats";

const LinkPage = () => {
  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();

  // Fetch URL details
  const { loading, data: url, fn, err: error } = useFetch(getUrl);

  // Fetch click statistics
  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl);

  // Delete URL
  const {
    loading: loadingDelete,
    fn: fnDelete,
    data: deleteData,
  } = useFetch(deleteUrl);

  useEffect(() => {
    if (!user?.id || !id) return;

    fn({ id, user_id: user.id });
    fnStats(id);
  }, [id, user?.id, fn, fnStats]);

  // Redirect after URL fetch error
  useEffect(() => {
    if (error) {
      console.error("URL fetching error:", error);
      navigate("/dashboard");
    }
  }, [error, navigate]);

  // Redirect after successful deletion
  useEffect(() => {
    if (deleteData !== null) {
      navigate("/dashboard");
    }
  }, [deleteData, navigate]);

  const link = url?.custom_url || url?.short_url || "";

  const downloadImage = () => {
    if (!url?.qr) return;

    const anchor = document.createElement("a");
    anchor.href = url.qr;
    anchor.download = `${url.title || "qr-code"}.png`;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleDelete = () => {
    if (!url?.id || loadingDelete) return;
    fnDelete(url.id);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://shortnrr.com/${link}`);
  };

  if (loading || loadingStats) {
    return <BarLoader width="100%" color="#36d7d7" />;
  }

  if (!url) {
    return <div>URL not found or unavailable.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">
            {url.title}
          </span>

          <a
            href={`https://shortnrr.com/${link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
          >
            https://shortnrr.com/{link}
          </a>

          <a
            href={url.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline cursor-pointer"
          >
            <LinkIcon className="p-1" />
            {url.original_url}
          </a>

          <span className="flex items-end font-extralight text-sm">
            {new Date(url.created_at).toLocaleString()}
          </span>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={copyLink}>
              <Copy />
            </Button>

            <Button variant="ghost" onClick={downloadImage}>
              <Download />
            </Button>

            <Button
              variant="ghost"
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash />
              )}
            </Button>
          </div>
          <img
            src={url?.qr}
            className="w-64 h-64 max-w-full object-contain self-start rounded-md bg-white p-2"
            alt="QR code"
          />
        </div>

        <Card className="min-w-0 w-full">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Card Title</CardTitle>
          </CardHeader>
          {stats && stats?.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Information</CardTitle>
              <LocationStats stats={stats || []}/>
              <CardTitle>Device Information</CardTitle>
              <DeviceStats stats={stats || []}/>
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics .. "}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default LinkPage;
