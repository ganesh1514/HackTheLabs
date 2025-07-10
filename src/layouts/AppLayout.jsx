import Header from "@/components/ui/Header";
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
        <p>Made with 💖 by <a href="https://github.com/ganesh1514" className = "text-primary-orange cursor-pointer hover:underline-primary-orange hover:underline-offset-4">Biradar Ganesh</a></p>
      </footer>
      <Toaster position="top-center" />
    </div>
  );
};

export default AppLayout;
