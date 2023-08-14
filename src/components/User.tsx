import { useSession } from "next-auth/react";
import Image from "next/image";

export default function User() {
  const { data: session } = useSession();
  return (
    <>
      {session && session.user ? (
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
      ) : (
        <>Connect Wallet with ArConnect</>
      )}
    </>
  );
}
