import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen my-container sm:mx-auto">
        <Header />
        <Outlet />
      </main>
      <footer className="p-10 text-center bg-gray-800 mt-10">
        <p>Made with 💖 by Biradar Ganesh</p>
      </footer>
      <Toaster position="top-center" />
    </div>
  );
};

export default AppLayout;
