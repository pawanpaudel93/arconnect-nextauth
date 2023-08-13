import { Inter } from "next/font/google";
import { uint8ArrayToBase64String } from "@/utils";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setIsLoading(true);
    try {
      const arweaveWallet = window.arweaveWallet;

      await arweaveWallet.connect(["SIGNATURE", "ACCESS_PUBLIC_KEY"], {
        name: "ArConnect Next Auth",
      });

      const message = new TextEncoder().encode("Sign in with ArConnect.");

      const signature = uint8ArrayToBase64String(
        await arweaveWallet.signature(message, {
          name: "RSA-PSS",
          saltLength: 32,
        })
      );

      const publicKey = await arweaveWallet.getActivePublicKey();

      const response = await signIn("credentials", {
        message: uint8ArrayToBase64String(message),
        redirect: false,
        signature,
        publicKey,
      });

      if (response?.status === 401) {
        console.log("Authentication failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const renderLoginButton = () => {
    if (!session) {
      return (
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Connecting..." : "Connect"}
        </button>
      );
    } else {
      return (
        <>
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? "Disconnecting..." : "Disconnect"}
          </button>
          {session.user && (
            <div className="mt-4">
              {session.user.image && (
                <img src={session.user.image} alt="Profile" />
              )}
              <span>
                <small>Signed in as:</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
            </div>
          )}
        </>
      );
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await window.arweaveWallet.disconnect();
      signOut();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <code className="font-mono font-bold">Arweave NextAuth</code>
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <div className="-z-0">{renderLoginButton()}</div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"></div>
    </main>
  );
}
