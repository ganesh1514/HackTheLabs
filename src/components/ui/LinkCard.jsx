import { Copy, Download, Trash } from "lucide-react";
import { downloadQr } from "@/lib/downloadQr";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import DeleteUrl from "./DeleteUrl";

const LinkCard = ({ url, fnUrls }) => {
  // ADD THIS STATE

  const handleDownload = (url) => {
    downloadQr({ url });
  };

  return (
    <div className="flex flex-col  md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <div className="flex-shrink-0">
        <img
          src={url?.qr}
          alt="qr code"
          className="h-32 object-contain ring ring-blue-500 p-1 self-start rounded-lg"
        />
      </div>

      <Link to={`/link/${url?.id}`} className="flex flex-col  gap-2 flex-1">
        <span className="text-2xl md:text-3xl font-semibold hover:underline cursor-pointer break-words">
          {url?.title}
        </span>
        <span className="text-lg md:text-2xl text-blue-400 font-semibold hover:underline cursor-pointer break-all">
          {`${import.meta.env.VITE_SITE_URL}/${
            url?.custom_url ? url?.custom_url : url?.short_url
          }`}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer text-gray-300 break-all text-sm md:text-base">
          {url?.original_url}
        </span>
        <span className="text-xs md:text-sm font-semibold text-gray-400 mt-auto">
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
              `https://laburl.vercel.app/${url?.custom_url || url?.short_url}`
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
