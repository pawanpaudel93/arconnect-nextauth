import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session)
    return (
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            router.push("/protected");
          }}
        >
          Go to Protected Page
        </button>
      </div>
    );
  return <></>;
}
