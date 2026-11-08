
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import Error from "./error";
import * as yup from "yup";
import { useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const CreateLink = () => {
  const { user } = UrlState();

  const navigate = useNavigate();
  const ref = useRef();

  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [shortUrl] = useState(() =>
    Math.random().toString(36).substring(2, 6)
  );

  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink || "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const {
    loading,
    data,
    err: error,
    fn: fnCreateurl,
  } = useFetch(createUrl);

  useEffect(() => {
    if (data?.[0]?.id) {
      navigate(`/link/${data[0].id}`);
    }
  }, [data, navigate]);

  const createNewLink = async () => {
    setErrors({});

    try {
      if (!user?.id) {
        throw new Error("Please log in first");
      }

      await schema.validate(formValues, { abortEarly: false });

      const canvas = ref.current?.canvasRef?.current;

      if (!canvas) {
        throw new Error("QR code canvas not found");
      }

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob) {
        throw new Error("Failed to generate QR code");
      }

      await fnCreateurl(
        { ...formValues, shortUrl, user_id: user.id },
        blob
      );
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = {};

        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });

        setErrors(newErrors);
      } else {
        console.error("Create URL error:", error);
      }
    }
  };

  return (
    <Dialog
      defaultOpen={Boolean(longLink)}
      onOpenChange={(open) => {
        if (!open) setSearchParams({});
      }}
    >
      <DialogTrigger
        render={
          <Button variant="destructive">
            Create New Links
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            Create New
          </DialogTitle>
        </DialogHeader>

        {formValues.longUrl && (
          <QRCode
            value={`https://shortnrr.com/${formValues.customUrl.trim() || shortUrl}`}
            size={250}
            ref={ref}
          />
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
        />

        {errors.title && <Error message={errors.title} />}

        <Input
          id="longUrl"
          placeholder="Enter your Long URL"
          value={formValues.longUrl}
          onChange={handleChange}
        />

        {errors.longUrl && <Error message={errors.longUrl} />}

        <div className="flex items-center gap-2">
          <Card className="shrink-0 whitespace-nowrap p-2">
            Shortnrr.com
          </Card>

          /

          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>

        {error && <Error message={error.message} />}

        <DialogFooter className="sm:justify-start">
          <Button
            disabled={loading}
            onClick={createNewLink}
            variant="destructive"
          >
            {loading ? (
              <BeatLoader size={10} color="white" />
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
