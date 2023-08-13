import { useState, useEffect } from "react";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function ProtectedPage({
  currentSession: session,
}: {
  currentSession: Session;
}) {
  const [content, setContent] = useState();

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/protected");
      const json = await res.json();
      if (json.content) {
        setContent(json.content);
      }
    };
    fetchData();
  }, [session]);

  // If no session exists, display access denied message
  if (!session) {
    return (
      <div className="p-12">
        <h1>Access Denied</h1>
        <p>You must be signed in to view this page</p>
      </div>
    );
  }

  // If session exists, display content
  return (
    <div className="p-12">
      <h1>Protected Page</h1>
      <p>
        <strong>{content ?? "\u00a0"}</strong>
      </p>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions(context.req)
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      currentSession: JSON.parse(JSON.stringify(session)),
    },
  };
}
