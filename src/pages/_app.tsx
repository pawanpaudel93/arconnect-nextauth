import RenderButtons from "@/components/RenderButtons";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  return (
    <main
      className={`flex flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <code
            className="font-mono font-bold cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Arweave NextAuth
          </code>
        </p>
      </div>

      <div className="relative flex place-items-center flex-col pt-24">
        <SessionProvider session={session}>
          <RenderButtons />
          <Component {...pageProps} />
        </SessionProvider>
      </div>
    </main>
  );
}
