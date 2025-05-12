import { useAuth } from "../../auth/useAuth";
import Button from "../../components/Button";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Button onClick={logout} variant="danger">
              Logout
            </Button>
          </div>

          {user && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p>{user.sub}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p>{user.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Roles</p>
                  <p>{user.roles.join(", ")}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
