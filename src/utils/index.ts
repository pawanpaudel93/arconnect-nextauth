import Arweave from "arweave";
import { signIn, signOut } from "next-auth/react";

export const arweave = Arweave.init({});

export const uint8ArrayToBase64String = (uint8Array: Uint8Array) => {
  return btoa(String.fromCharCode(...uint8Array));
};

export const base64StringToUint8Array = (base64String: string) => {
  return new Uint8Array(
    atob(base64String)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
};

export async function nextAuthSignIn() {
  try {
    const arweaveWallet = window.arweaveWallet;

    await arweaveWallet.connect(["SIGNATURE", "ACCESS_PUBLIC_KEY"], {
      name: "ArConnect Next Auth",
    });

    const message = new TextEncoder().encode("Sign in with ArConnect.");

    let signature: string;
    let isHashed = false;
    try {
      signature = uint8ArrayToBase64String(
        // @ts-expect-error
        await arweaveWallet.signMessage(message)
      );
      isHashed = true;
    } catch (e) {
      signature = uint8ArrayToBase64String(
        await arweaveWallet.signature(message, {
          name: "RSA-PSS",
          saltLength: 32,
        })
      );
    }

    const publicKey = await arweaveWallet.getActivePublicKey();

    const response = await signIn("credentials", {
      message: uint8ArrayToBase64String(message),
      redirect: false,
      signature,
      publicKey,
      isHashed,
    });

    if (response?.status === 401) {
      console.log("Authentication failed");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function nextAuthSignOut() {
  try {
    await window.arweaveWallet.disconnect();
    signOut();
  } catch (error) {
    console.log(error);
  }
}
