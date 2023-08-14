import { nextAuthSignIn, nextAuthSignOut } from "@/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function RenderButtons() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setIsLoading(true);
    await nextAuthSignIn();
    setIsLoading(false);
  }

  const handleLogout = async () => {
    setIsLoading(true);
    await nextAuthSignOut();
    setIsLoading(false);
  };

  return (
    <div className="-z-0">
      {session ? (
        <button
          className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? "Disconnecting..." : "Disconnect"}
        </button>
      ) : (
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Connecting..." : "Connect"}
        </button>
      )}
    </div>
  );
}
