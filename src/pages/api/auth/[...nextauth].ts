import { arweave, base64StringToUint8Array } from "@/utils";
import { JWKInterface } from "arweave/node/lib/wallet";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: "Arweave",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
        publicKey: {
          label: "Public Key",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          if (
            credentials?.message &&
            credentials?.signature &&
            credentials?.publicKey
          ) {
            const isSignatureValid = await arweave.crypto.verify(
              credentials?.publicKey,
              base64StringToUint8Array(credentials?.message),
              base64StringToUint8Array(credentials?.signature)
            );

            if (isSignatureValid) {
              const address = await arweave.wallets.jwkToAddress({
                n: credentials.publicKey,
              } as JWKInterface);
              return {
                id: address,
              };
            }
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        session.address = token.sub;
        session.user.name = token.sub;
        session.user.image = `https://avatars.dicebear.com/api/bottts/${token.sub}.svg`;
        return session;
      },
    },
  });
}
