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
        <p>
          Made with 💖 by{" "}
          <a
            href="https://github.com/ganesh1514"
            className="relative text-primary-orange cursor-pointer before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-primary-orange before:transition-all before:duration-300 hover:before:w-full"
          >
            Biradar Ganesh
          </a>
        </p>
      </footer>
      <Toaster position="top-center" />
    </div>
  );
};

export default AppLayout;
