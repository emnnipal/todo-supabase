"use client";

import { ApiRoute, Route } from "@/constants/routes";
import { Database } from "@/types/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Register() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}${ApiRoute.Callback}`,
      },
    });

    console.log("error", error);

    setIsLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="text-center font-semibold text-xl">Create Account</div>
      <div className="mt-6">
        <div className="text-sm font-medium">Email</div>
        <input
          name="email"
          type="email"
          className="w-full border outline-none border-gray-400 rounded-md py-2 px-4 mt-1"
          required
        />
        <div className="text-sm mt-4 font-medium">Password</div>
        <input
          name="password"
          type="password"
          className="w-full border outline-none border-gray-400 rounded-md py-2 px-4 mt-1"
          required
          minLength={6}
          maxLength={20}
        />
      </div>
      <div className="flex justify-between items-center mt-6">
        <Link
          href={Route.Login}
          className={twMerge(
            "text-sky-600 font-medium text-sm outline-none",
            isLoading && "pointer-events-none opacity-40 cursor-not-allowed",
          )}
        >
          Back
        </Link>
        <button
          className="border rounded-lg px-5 py-2 bg-sky-600 text-white outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={isLoading}
          type="submit"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}
