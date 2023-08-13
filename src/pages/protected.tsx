import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProtectedPage() {
  const { data: session } = useSession();
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
