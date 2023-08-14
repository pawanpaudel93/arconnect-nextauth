import { arweave, base64StringToUint8Array } from "@/utils";
import { JWKInterface } from "arweave/node/lib/wallet";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions = (req: NextApiRequest): AuthOptions => {
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
            const message = base64StringToUint8Array(credentials?.message);
            const signature = base64StringToUint8Array(credentials?.signature);
            const publicJWK: JsonWebKey = {
              e: "AQAB",
              ext: true,
              kty: "RSA",
              n: credentials.publicKey,
            };

            // import public jwk for verification
            const verificationKey = await crypto.subtle.importKey(
              "jwk",
              publicJWK,
              {
                name: "RSA-PSS",
                hash: "SHA-256",
              },
              false,
              ["verify"]
            );

            // verify the signature by matching it with the message
            const isValidSignature = await crypto.subtle.verify(
              { name: "RSA-PSS", saltLength: 32 },
              verificationKey,
              signature,
              message
            );

            if (isValidSignature) {
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
    req.method === "GET" &&
    req.query?.nextauth &&
    req.query.nextauth.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return {
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
  };
};

const Auth = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, authOptions(req));
};

export default Auth;
