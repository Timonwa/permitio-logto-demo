import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { usePermissions } from "../hooks/usePermissions";

export default function Dashboard() {
  const router = useRouter();
  const fetcher = url => fetch(url).then(r => r.json());
  const { data, error } = useSWR("/api/logto/user", fetcher);

  // Get permissions for the current user
  const { can, loading: permissionsLoading } = usePermissions(
    data?.claims?.sub
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (data && !data.isAuthenticated && !error) {
      router.push("/login");
    }
  }, [data, error, router]);

  const handleSignOut = () => {
    window.location.assign("/api/logto/sign-out");
  };

  if (error) return <div>Error loading user data</div>;
  if (!data || permissionsLoading) return <div>Loading...</div>;
  if (!data?.isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Reports Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>{data.claims?.email || data.claims?.sub}</span>
            <button
              onClick={handleSignOut}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <h2 className="text-2xl font-bold mb-6">Your Reports</h2>

        {can("view", "Reports") ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Monthly Sales Report</h3>
              <div className="flex space-x-2">
                {can("edit", "Reports") && (
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Edit
                  </button>
                )}

                {can("delete", "Reports") && (
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-600">
              This report shows the monthly sales data for your organization.
            </p>
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-100 rounded-lg">
            You don't have permission to view reports.
          </div>
        )}
      </main>
    </div>
  );
}
