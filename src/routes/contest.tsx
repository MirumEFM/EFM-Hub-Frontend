import React, { useEffect, useRef, useState } from "react";
import { Question } from "@phosphor-icons/react";

type ProgressData = {
  progress: number; // percantage
  message: string;
  error: boolean;
};

function Contest() {
  const [progress, setProgress] = useState<ProgressData | null>(null);

  const [emailRef, passwordRef] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const [email, password] = [
      emailRef.current?.value,
      passwordRef.current?.value,
    ];
    if (!email || !password) {
      alert("Preencha todos os campos");
      return;
    }
  }

  return (
    <div>
      <form
        className="flex flex-col justify-start items-center"
        onSubmit={handleSubmit}
      >
        <div className="input-group flex flex-col mb-4 ">
          <label
            className="flex items-center text-lg text-gray-700 mb-2"
            htmlFor="email"
          >
            Email
            <span title="Email Google Merchant">
              <Question size={20} />
            </span>
          </label>
          <input
            className="w-full py-2 px-1 outline outline-1 outline-black focus:outline-blue-400 bg-white "
            name="email"
            type="text"
            placeholder="joao@mirumagency.com"
            ref={emailRef}
          ></input>
        </div>
        <div className="input-group flex flex-col mb-4 ">
          <label
            className="flex items-center text-lg text-gray-700 mb-2"
            htmlFor="password"
          >
            Senha
            <span title="Senha Google Merchant">
              <Question size={20} />
            </span>
          </label>
          <input
            className="w-full py-2 px-1 outline outline-1 outline-black focus:outline-blue-400 bg-white "
            name="password"
            type="password"
            placeholder="********"
            ref={passwordRef}
          ></input>
        </div>
        <div className="flex justify-center items-center w-full">
          <button
            className="btn py-2 px-4 border border-gray-700 bg-yellow-300 text-gray-700 hover:text-white hover:bg-gray-700 hover:shadow-md transition-all duration-125 ease-in-out"
            type="submit"
          >
            Enviar
          </button>
        </div>
      </form>

      {progress && (
        <div className="flex flex-col justify-center items-center">
          <p>{progress.message}</p>
          <div className="relative w-full h-4 bg-gray-200 rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-green-400 rounded-full"
              style={{ width: `${progress.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contest;
