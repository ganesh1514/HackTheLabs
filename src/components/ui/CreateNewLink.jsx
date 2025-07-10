import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "./card";
import z from "zod";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Error from "./Error";

import useFetch from "@/Hooks/useFetch";
import { createUrl } from "@/db/apiUrls";
import { useAuth } from "@/contexts/AuthContext";
import QRCode from "react-qr-code";
import { Loader2 } from "lucide-react";
import { svgToPngBlob } from "@/lib/svgToPngBlob";
import { useSearchParams } from "react-router-dom";
const CreateNewLink = ({ fnUrls }) => {
  const qrRef = useRef();
  const dialogCloseRef = useRef();
  const { getUserProfile } = useAuth();
  const userProfile = getUserProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [formData, setFormData] = useState({
    original_url: longLink || "",
    title: "",
    custom_url: "",
  });

  const [errors, setErrors] = useState({});

  const formSchema = z.object({
    original_url: z
      .string()
      .nonempty("Original URL is required")
      .url("Please enter a valid URL"),
    title: z.string().nonempty("Title is required"),
    custom_url: z.string().optional(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const {
    data: createdLink,
    error: createLinkError,
    loading: createLinkLoading,
    fetchData: fnCreateLink,
  } = useFetch(createUrl, { ...formData, user_id: userProfile?.id });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = formSchema.safeParse(formData);
      if (!result.success) {
        e.preventDefault();
        const result = formSchema.safeParse(formData);
        // Handle validation errors
        const fieldErrors = {};
        result.error.errors.forEach((error) => {
          if (!fieldErrors[error.path[0]]) {
            fieldErrors[error.path[0]] = error.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      setErrors({}); // Clear previous errors
      // Proceed with form submission logic
      const svgElement = qrRef.current; // This is the SVG DOM node
      const pngBlob = await svgToPngBlob(svgElement);

      await fnCreateLink(pngBlob);
    } catch (err) {
      toast.error(err.message);
      return;
    }
  };

  useEffect(() => {
    if (createdLink) {
      toast.success("Short URL created successfully!");
      dialogCloseRef?.current?.click(); // Close the dialog
      setSearchParams({});
      fnUrls(); // Refresh the list of URLs
      return;
    }
    if (createLinkError) {
      toast.error(createLinkError.message);
      return;
    }
  }, [createdLink, createLinkError]);

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) {
          setSearchParams({});
        }
      }}
    >
      <DialogTrigger asChild ref={dialogCloseRef}>
        <Button className={"cursor-pointer"}>Create Link</Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[425px] border-gray-600 bg-gray-900">
        <DialogHeader>
          <DialogTitle className={"text-2xl font-semibold"}>
            Create a new Short Url 🚀
          </DialogTitle>
          <DialogDescription>
            Add the original Url, the short url will be generated automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="lUrl">Original Url</Label>
            <Input
              id="lUrl"
              name="original_url"
              value={formData.original_url}
              onChange={handleChange}
              placeholder="https://www.example.com"
            />
            <QRCode
              ref={qrRef}
              value={formData?.original_url}
              size={256}
              className="hidden"
            />
            {errors.original_url && <Error message={errors.original_url} />}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g: example.com"
            />
            {errors.title && <Error message={errors.title} />}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="customUrl">Custom Url (optional)</Label>
            <div className="flex items-center gap-2">
              <Card className={"p-2 rounded-sm border-gray-500"}>
                laburl.vercel.app/
              </Card>
              <Input
                id="customUrl"
                name="custom_url"
                value={formData.custom_url}
                onChange={handleChange}
                placeholder="E.g: myExample"
              />
            </div>
            {errors.custom_url && <Error message={errors.custom_url} />}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={createLinkLoading}
            className={
              "bg-primary-orange text-white hover:text-primary-orange hover:bg-white"
            }
          >
            {createLinkLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Link...
              </>
            ) : (
              "Create Link"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewLink;
