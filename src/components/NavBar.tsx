import { nextAuthSignIn, nextAuthSignOut } from "@/utils";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
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
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <NextLink href="/" className="btn btn-ghost normal-case text-xl">
            ArConnectNextAuth
          </NextLink>
        </div>
        <div className="flex-none gap-2">
          <ul className="menu menu-horizontal px-1">
            <li
              className={`${
                session &&
                router.pathname === "/protected" &&
                "border-b border-purple-400"
              }`}
            >
              <NextLink href="/protected">Protected</NextLink>
            </li>
          </ul>
          {session ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <Image
                    src={session.user?.image!}
                    alt=""
                    width={100}
                    height={100}
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a onClick={handleLogout}>Disconnect</a>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="btn btn-outline btn-primary"
              disabled={isLoading}
              onClick={handleLogin}
            >
              {isLoading && <span className="loading loading-spinner"></span>}
              {isLoading ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
