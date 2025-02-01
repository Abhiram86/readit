"use client";

import AuthForm, { Input } from "@/components/Form";
import Link from "next/link";
import axios from "axios";
import { useFormReducer } from "@/hooks/formReducer";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";

export default function Signin() {
  const { formState, handleChange } = useFormReducer({
    email: "",
    password: "",
  });

  const { login } = useUserStore();
  const router = useRouter();

  const handleSignin = async () => {
    try {
      const res = await axios.post("/api/signin", formState);
      if (res.status === 200) {
        login(res.data.token);
        router.push("/");
      } else {
        console.log("error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 font-sans divide-y divide-zinc-700 space-y-2">
      <h1 className="text-lg font-medium text-center">
        Login to Product<span className="text-violet-600">Hunt</span>
      </h1>
      <AuthForm onSubmit={handleSignin} className="pt-4" type="signin">
        <Input
          id="email"
          name="email"
          placeholder="Email"
          type="email"
          required
          value={formState.email}
          onChange={handleChange}
        />
        <Input
          id="password"
          name="password"
          placeholder="Password"
          type="password"
          required
          value={formState.password}
          onChange={handleChange}
        />
        <p className="w-full text-zinc-400">
          dont have an account?{" "}
          <Link href={"/signup"} className="text-violet-600 cursor-pointer">
            sign up
          </Link>
        </p>
      </AuthForm>
    </div>
  );
}
