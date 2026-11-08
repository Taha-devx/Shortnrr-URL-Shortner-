
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Copy, Download, Trash } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url, fetchUrls }) => {
  const shortCode = url?.custom_url || url?.short_url;
  const shortUrl = `${window.location.origin}/${shortCode}`;

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

  const {
    loading: loadingDelete,
    fn: fnDelete,
  } = useFetch(deleteUrl);

  const handleDelete = async () => {
    await fnDelete(url?.id);

    await fetchUrls();
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        className="h-32 w-32 object-contain ring ring-blue-500 self-start"
        alt="QR code"
      />

      <Link className="flex flex-col flex-1 min-w-0" to={`/link/${url?.id}`}>
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>

        <span className="text-2xl font-bold text-blue-400 hover:underline break-all">
          {shortUrl}
        </span>

        <span className="flex items-center hover:underline cursor-pointer gap-1 break-all">
          {url?.original_url}
        </span>

        <span className="flex items-end text-sm font-extralight gap-1 flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>

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
    </div>
  );
};

export default LinkCard;
