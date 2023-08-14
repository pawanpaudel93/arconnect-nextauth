import { nextAuthSignIn, nextAuthSignOut } from "@/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
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

  if (!session) {
    return (
      <div className="-z-0 my-9">
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Connecting..." : "Connect"}
        </button>
      </div>
    );
  } else {
    return (
      <div className="-z-0">
        <button
          className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? "Disconnecting..." : "Disconnect"}
        </button>
        {session.user && (
          <div className="mt-4 flex flex-row place-items-center">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width="100"
                height="100"
                style={{
                  borderRadius: "50%",
                }}
              />
            )}
            <span>
              <small>Signed in as:</small>
              <br />
              <strong>{session.user.email ?? session.user.name}</strong>
            </span>
          </div>
        )}
      </div>
    );
  }
}
