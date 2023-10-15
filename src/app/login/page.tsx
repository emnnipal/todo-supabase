"use client";

import { supabase } from "@/util/supabase";
import { ChangeEvent, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { CookieName } from "@/constants/auth";

const initialState = {
  email: "",
  password: "",
};
export default function Login() {
  const router = useRouter();

  const [state, setState] = useState(initialState);
  const [isRegistration, setIsRegistration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const signUp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(state.email) === false) {
      alert("Invalid email format");
      return;
    }

    if (!state.password || state.password.length <= 6) {
      alert("Invalid password");

      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp(state);
    console.log("results", { data, error });

    if (error) {
      alert(error.message);
    } else {
      setIsRegistration(false);
    }
    setIsLoading(false);
  };

  const toggleCreateAccount = () => {
    setIsRegistration((prevState) => !prevState);
    setState(initialState);
  };

  const login = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(state);
    setIsLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    const { access_token, expires_in } = data.session;

    Cookies.set(CookieName.AccessToken, access_token, { expires: expires_in });
    router.push("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="border p-8 w-96 rounded-xl">
        <div className="text-center font-semibold text-xl">
          {isRegistration ? "Create account" : "Welcome!"}
        </div>
        <div className="mt-6">
          <div className="text-sm font-medium">Email</div>
          <input
            name="email"
            type="email"
            className="w-full border outline-none border-gray-400 rounded-md py-2 px-4 mt-1"
            value={state.email}
            onChange={handleInput}
          />
          <div className="text-sm mt-4 font-medium">Password</div>
          <input
            name="password"
            type="password"
            className="w-full border outline-none border-gray-400 rounded-md py-2 px-4 mt-1"
            value={state.password}
            onChange={handleInput}
          />
        </div>
        <div className="flex justify-between mt-6">
          {isRegistration ? (
            <button
              className="text-sky-600 font-medium text-sm outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={toggleCreateAccount}
              disabled={isLoading}
            >
              Back
            </button>
          ) : (
            <button
              className="text-sky-600 font-medium text-sm outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={toggleCreateAccount}
              disabled={isLoading}
            >
              Create Account
            </button>
          )}
          {isRegistration ? (
            <button
              className="border rounded-lg px-5 py-2 bg-sky-600 text-white outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={signUp}
              disabled={isLoading}
            >
              Sign Up
            </button>
          ) : (
            <button
              className="border rounded-lg px-5 py-2 bg-sky-600 text-white outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={login}
              disabled={isLoading}
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
