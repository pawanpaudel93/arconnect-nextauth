import RenderButtons from "@/components/RenderButtons";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import User from "@/components/User";
import Head from "next/head";
import NextLink from "next/link";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  return (
    <main
      className={`flex flex-col items-center justify-between p-12 ${inter.className}`}
    >
      <Head>
        <title>ArConnect NextAuth</title>
      </Head>
      <SessionProvider session={session}>
        <div className="max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <div className="fixed left-0 top-0 flex align-middle place-items-center w-full justify-between border-b border-gray-300 bg-gradient-to-b from-zinc-200 py-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit px-12">
            <div className="flex flex-row gap-10">
              <code
                className={`font-mono font-bold cursor-pointer hover:text-blue-30`}
                onClick={() => {
                  router.push("/");
                }}
              >
                ArConnectNextAuth
              </code>
              <div className="flex flex-row gap-6">
                <NextLink
                  href="/"
                  className={`hover:text-blue-300 ${
                    router.pathname === "/" &&
                    "text-blue-500 border-blue-500 border-b"
                  }`}
                >
                  Home
                </NextLink>
                <NextLink
                  href="/protected"
                  className={`hover:text-blue-300 ${
                    router.pathname === "/protected" &&
                    "text-blue-500 border-blue-500 border-b"
                  }`}
                >
                  Protected
                </NextLink>
              </div>
            </div>
            <RenderButtons />
          </div>
        </div>

        <div className="relative flex place-items-center flex-col pt-24">
          <User />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </main>
  );
}
