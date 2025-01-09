import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
      {user ? (
        <div>
          <p>Hello, {user.email}</p>
          <button
            onClick={logout}
            className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p>Please log in to continue.</p>
      )}
    </div>
  );

  
}
