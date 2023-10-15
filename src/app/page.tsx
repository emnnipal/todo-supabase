"use client";

import { Tables } from "@/types/supabase-type-helpers";
import { supabase } from "@/util/supabase";
import { useCallback, useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import { twJoin } from "tailwind-merge";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { CookieName } from "@/constants/auth";

export default function Home() {
  const [list, setList] = useState<Tables<"todos">[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const fetchTodos = useCallback(async () => {
    const { data, error } = await supabase.from("todos").select();

    if (error) {
      return;
    }

    setList(data);
  }, []);

  const fetchUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();

    if (data) {
      setUser(data.user);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
    fetchUser();
  }, [fetchTodos, fetchUser]);

  useEffectOnce(() => {
    supabase
      .channel("any")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setList((prevState) => [
              ...prevState,
              payload.new as Tables<"todos">,
            ]);
          }
          if (payload.eventType === "DELETE") {
            setList((prevState) =>
              prevState.filter(({ id }) => id !== payload.old.id)
            );
          }

          if (payload.eventType === "UPDATE") {
            setList((prevState) => {
              const newState = [...prevState];
              const index = prevState.findIndex(
                (todo) => todo.id === payload.new.id
              );
              newState[index] = payload.new as Tables<"todos">;
              return newState;
            });
          }
          console.log("Change received!", payload);
        }
      )
      .subscribe();
  });

  const add = async () => {
    setInputValue("");
    if (user?.id) {
      await supabase
        .from("todos")
        .insert({ value: inputValue, is_done: false, user_id: user?.id });
    }
  };

  const remove = async (id: number) => {
    await supabase.from("todos").delete().eq("id", id);
  };

  const done = async (id: number, state: boolean) => {
    const { error, data } = await supabase
      .from("todos")
      .update({ is_done: state })
      .eq("id", id);
    console.log("error", { error, data });
    if (error) {
      alert(error.message);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }
    Cookies.remove(CookieName.AccessToken);
    router.refresh();
  };

  return (
    <main className="min-h-screen">
      <div className="p-6 shadow flex justify-between">
        <div className="font-bold">To-do App</div>

        <div className="flex flex-row gap-8 items-center">
          <div className="font-semibold">Hi {user?.email || "unknown"}!</div>
          <div className="text-sm font-semibold" onClick={logout}>
            Logout
          </div>
        </div>
      </div>
      <div className="flex justify-center p-6">
        <div className="flex flex-col gap-4 min-w-[360px]">
          <div className="font-semibold text-center">To-do list</div>
          <div className="flex gap-4">
            <input
              type="text"
              className="rounded border-gray-600 border bg-gray-100 px-2 outline-none w-full"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="py-1 px-2 rounded border-gray-600 border hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
              onClick={add}
              disabled={!inputValue || !user?.id}
            >
              +
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {list.map((todo, index) => (
              <div key={todo.id} className="flex justify-between">
                <span className={twJoin(todo.is_done && "line-through")}>
                  {index + 1}. {todo.value}
                </span>
                <div className="flex gap-2">
                  <button
                    className="py-[1px] px-2 rounded border-gray-600 border hover:bg-gray-100 outline-none"
                    onClick={() => done(todo.id, !todo.is_done)}
                  >
                    {todo.is_done ? "Undo" : "Done"}
                  </button>
                  <button
                    className="py-[1px] px-2 rounded border-gray-600 border hover:bg-gray-100 outline-none"
                    onClick={() => remove(todo.id)}
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
