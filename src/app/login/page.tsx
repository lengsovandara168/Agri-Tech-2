import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (userId) {
    // If already authenticated, redirect to home (middleware had same behavior)
    redirect("/");
  }

  return <LoginClient />;
}
