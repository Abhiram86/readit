// import { signup } from "@/actions/auth";
"use client";
import AuthForm, { Input } from "@/components/Form";
import Link from "next/link";
import axios from "axios";
import { useFormReducer } from "@/hooks/formReducer";

export default function Signup() {
  const { formState, handleChange } = useFormReducer({
    username: "",
    email: "",
    password: "",
  });

  const handleSignup = async () => {
    try {
      const res = await axios.post("/api/signup", formState);
      if (res.status === 200) {
        console.log("success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 font-sans divide-y divide-zinc-700 space-y-2">
      <h1 className="text-lg font-medium text-center">
        Signup to Product<span className="text-violet-600">Hunt</span>
      </h1>
      <AuthForm onSubmit={handleSignup} className="pt-4" type="signup">
        <Input
          id="username"
          name="username"
          placeholder="Username"
          type="text"
          required
          value={formState.username}
          onChange={handleChange}
        />
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
          already have an account?{" "}
          <Link href={"/signin"} className="text-violet-600 cursor-pointer">
            sign in
          </Link>
        </p>
      </AuthForm>
    </div>
  );
}
