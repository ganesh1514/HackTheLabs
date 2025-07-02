import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container">
        <Header />

        <Outlet />
      </main>
      <footer className="p-10 text-center bg-gray-800 mt-10">
        <p>Made with 💖 by Biradar Ganesh</p>
      </footer>
    </div>
  );
};

export default AppLayout;
