"use client";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  type: "signin" | "signup";
  className?: string;
  onSubmit?: () => void;
  action?: (formData: FormData) => void;
}

export default function AuthForm({
  children,
  type,
  className,
  action,
  onSubmit,
  ...props
}: FormProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className={`p-2 flex flex-col gap-2 items-center ${className}`}
      {...props}
    >
      {children}
      <button
        className="p-3 mt-2 bg-violet-700 hover:bg-violet-800 transition-colors w-full rounded-xl"
        type="submit"
      >
        {type === "signin" ? "Sign in" : "Sign up"}
      </button>
    </form>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  name?: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
}

export function Input({ id, name, placeholder, type, ...props }: InputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      {...props}
      className="py-3 px-6 transition placeholder:text-sm placeholder:text-zinc-500 placeholder:tracking-wider focus:ring-2 focus:bg-zinc-900 ring-violet-700 outline-none hover:bg-zinc-700 w-full bg-zinc-800 rounded-xl"
      placeholder={placeholder}
    />
  );
}
