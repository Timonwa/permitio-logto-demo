import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function Login() {
  const router = useRouter();
  const fetcher = url => fetch(url).then(r => r.json());
  const { data, error } = useSWR("/api/logto/user", fetcher);

  useEffect(() => {
    if (data?.isAuthenticated) {
      router.push("/");
    }
  }, [data, router]);

  const handleSignIn = () => {
    window.location.assign("/api/logto/sign-in");
  };

  if (error) return <div>Error loading user data</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Reports Dashboard</h1>
          <p className="mt-2 text-gray-600">Please sign in to continue</p>
        </div>
        <button
          onClick={handleSignIn}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
          Sign in with Logto
        </button>
      </div>
    </div>
  );
}
