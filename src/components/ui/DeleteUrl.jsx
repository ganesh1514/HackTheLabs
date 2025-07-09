import { useState } from "react";
import { deleteUrl } from "@/db/apiUrls";
import useFetch from "@/Hooks/useFetch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DeleteUrl = ({ url, fnUrls }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const { loading: deleteLoading, fetchData: fnDeleteUrl } = useFetch(
    deleteUrl,
    url?.id
  );

  const handleDeleteConfirm = async (e) => {
    e.preventDefault(); // Prevent Radix from closing the dialog
    if (deleteLoading) return;
    await fnDeleteUrl();
    toast.success("URL deleted successfully");
    setShowDeleteDialog(false); // Manually close the dialog
    if (fnUrls) {
      fnUrls(); // Refresh the URL list
    } else {
      navigate("/dashboard"); // Fallback to redirect if fnUrls is not provided
    }
  };
  // REMOVE the old handleDelete function and REPLACE with this:
  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-primary-orange hover:text-white cursor-pointer"
          >
            <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the URL
              "{url?.title}" and remove all its data including analytics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="button"
                disabled={deleteLoading}
                onClick={handleDeleteConfirm}
                className={"bg-red-600 hover:bg-red-700 focus:ring-red-500"}
              >
                {deleteLoading ? "Deleting..." : "Delete URL"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteUrl;
