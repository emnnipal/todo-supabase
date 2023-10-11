"use client";

import { useState } from "react";
import { twJoin } from "tailwind-merge";

export default function Home() {
  const [list, setList] = useState([{ value: "work", isDone: false }]);
  const [inputValue, setInputValue] = useState("");

  const add = () => {
    setList((prevState) => [
      ...prevState,
      { value: inputValue, isDone: false },
    ]);
    setInputValue("");
  };

  const remove = (selectedIndex: number) => {
    setList((prevState) =>
      prevState.filter((_, index) => index !== selectedIndex)
    );
  };

  const done = (selectedIndex: number) => {
    setList((prevState) =>
      prevState.map((todo, index) =>
        index === selectedIndex ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

  return (
    <main className="min-h-screen">
      <div className="flex justify-center p-6 shadow font-bold">To-do App</div>
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
              disabled={!inputValue}
            >
              +
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {list.map((todo, index) => (
              <div key={index} className="flex justify-between">
                <span className={twJoin(todo.isDone && "line-through")}>
                  {index + 1}. {todo.value}
                </span>
                <div className="flex gap-2">
                  <button
                    className="py-[1px] px-2 rounded border-gray-600 border hover:bg-gray-100 outline-none"
                    onClick={() => done(index)}
                  >
                    {todo.isDone ? "Undo" : "Done"}
                  </button>
                  <button
                    className="py-[1px] px-2 rounded border-gray-600 border hover:bg-gray-100 outline-none"
                    onClick={() => remove(index)}
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
