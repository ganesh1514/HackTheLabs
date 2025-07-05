import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { getUserProfile, loading } = useAuth();
  const userProfile = getUserProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Dashboard, {userProfile?.name || userProfile?.email}!
      </h1>
      <p className="text-gray-600">Provider: {userProfile?.provider}</p>
      <p className="text-gray-600">Email: {userProfile?.email}</p>
      {/* Add your dashboard content here */}
    </div>
  );
};

export default Dashboard;
