import { Copy, Download, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import DeleteUrl from "./DeleteUrl";

const LinkCard = ({ url, fnUrls }) => {
  // ADD THIS STATE

  const downloadImage = async () => {
    try {
      const imgUrl = url?.qr;
      const fileName = `${url?.title || "qr-code"}.jpeg`;

      // Fetch the image as a blob to bypass CORS
      const response = await fetch(imgUrl);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create and trigger download
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = fileName;
      anchor.style.display = "none";

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Initiated download of QR code");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        alt="qr code"
        className="h-32 object-contain ring ring-blue-500 self-start"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
        <span className="text-3xl font-semibold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-2xl text-blue-400 font-semibold hover:underline cursor-pointer">
          {`${import.meta.env.VITE_SITE_URL}/${
            url?.custom_url ? url?.custom_url : url?.short_url
          }`}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer">
          {url?.original_url}
        </span>
        <span className="flex items-end font-semibold text-sm flex-1">
          {new Date(url?.created_at).toLocaleDateString() +
            " " +
            new Date(url?.created_at).toLocaleTimeString()}
        </span>
      </Link>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(
              `https://laburl.in/${url?.custom_url || url?.short_url}`
            );
            toast.success("Link copied to clipboard");
          }}
          className="hover:bg-gray-400 cursor-pointer"
        >
          <Copy />
        </Button>

        <Button
          variant="ghost"
          className="hover:bg-gray-400 cursor-pointer"
          onClick={downloadImage}
        >
          <Download />
        </Button>
        <DeleteUrl url={url} fnUrls={fnUrls} />
        {/* REPLACE the old Trash button with this AlertDialog */}
      </div>
    </div>
  );
};

export default LinkCard;

{
  /*
  // import { deleteUrl } from "@/db/apiUrls";
// import useFetch from "@/Hooks/useFetch";
// import { Copy, Download, Trash } from "lucide-react";
// import toast from "react-hot-toast";
// import { Link } from "react-router-dom";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";

// const LinkCard = ({ url, fnUrls }) => {
//   const downloadImage = () => {
//     const imgUrl = url?.qr;
//     const fileName = url?.title;

//     const anchor = document.createElement("a");
//     anchor.href = imgUrl;
//     anchor.download = fileName;

//     document.body.appendChild(anchor);
//     anchor.click();
//     document.body.removeChild(anchor);
//   };

//   const { loading: deleteLoading, fetchData: fnDeleteUrl } = useFetch(
//     deleteUrl,
//     url?.id
//   );

//   const handleDelete = async () => {
//     if (deleteLoading) return;
//     // const confirmDelete = window.confirm(
//     //   "Are you sure you want to delete this URL?"
//     // );

//     // confirm from the user where they wont to delete the URL
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button variant="outline">Show Dialog</Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete your
//             account and remove your data from our servers.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction>Continue</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>;
//     if (confirmDelete) {
//       await fnDeleteUrl();
//       toast.success("URL deleted successfully");
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg ">
//       <img
//         src={url?.qr}
//         alt="qr code"
//         className="h-32 object-contain ring ring-blue-500 self-start"
//       />
//       <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
//         <span className="text-3xl font-semibold hover:underline cursor-pointer">
//           {url?.title}
//         </span>
//         <span className="text-2xl text-blue-400 font-semibold hover:underline cursor-pointer">
//           {`${import.meta.env.VITE_SITE_URL}${
//             url?.custom_url ? url?.custom_url : url?.short_url
//           }`}
//         </span>
//         <span className="flex items-center gap-1 hover:underline cursor-pointer">
//           {url?.original_url}
//         </span>
//         <span className="flex items-end font-semibold tex-sm flex-1">
//           {new Date(url?.created_at).toLocaleDateString() +
//             " " +
//             new Date(url?.created_at).toLocaleTimeString()}
//         </span>
//       </Link>
//       <div className="flex gap-2">
//         <Button
//           variant="ghost"
//           onClick={() =>
//             navigator.clipboard.writeText(
//               `https://LabUrl.in/${url?.short_url || url?.custom_url}`
//             ) && toast.success("Link copied to clipboard")
//           }
//         >
//           <Copy />
//         </Button>

//         <Button variant="ghost">
//           <Download />
//         </Button>
//         <Button variant="ghost">
//           <Trash />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default LinkCard;
*/
}
