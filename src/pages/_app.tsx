import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import User from "@/components/User";
import Head from "next/head";
import "@/styles/globals.css";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <main className={`${inter.className}`}>
      <Head>
        <title>ArConnect NextAuth</title>
      </Head>
      <SessionProvider session={session}>
        <NavBar />

        <div className="relative flex place-items-center flex-col pt-24">
          <User />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </main>
  );
}
