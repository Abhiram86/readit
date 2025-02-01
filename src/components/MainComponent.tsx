import { ReactNode } from "react";
import Navbar from "./Navbar";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/authSession";

export default async function MainComponent({
  children,
}: {
  children: ReactNode;
}) {
  const token = (await cookies()).get("token")?.value;
  const userData = token ? await verifyToken(token) : null;
  return (
    <main>
      <Navbar userData={userData} />
      {children}
    </main>
  );
}
