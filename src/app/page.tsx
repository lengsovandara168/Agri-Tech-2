import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChatApp from "./components/ChatApp";

export default async function Page() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) {
    redirect("/login");
  }

  return (
    <main>
      <ChatApp />
    </main>
  );
}
