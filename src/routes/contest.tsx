import React from "react";
import axios from "axios";

import fetchStatus from "../utils/fetchStatus";

import { TitleContext } from "../contexts/titleContext";
import Input from "../components/Input";

function Contest() {
  const {setTitle} = React.useContext(TitleContext);
  const [task, setTask] = React.useState<Task | null>(null);

  const [emailRef, passwordRef, accountIdRef] = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
  ];
  
  React.useEffect(() => {
    setTitle("Contestar produtos");
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const [email, password, accountId] = [
      emailRef.current?.value,
      passwordRef.current?.value,
      accountIdRef.current?.value,
    ];
    if (!email || !password || !accountId) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:8080/subaccounts", {
        accountId,
        credentials: { email, password },
      }); // Etapa 1, Login e subcontas
      const { taskId } = data;

      const properties = await fetchStatus(taskId);

      setTask({
        id: taskId,
        properties,
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div className="flex w-full justify-center">
      <form
        className="flex flex-col gap-2 items-center justify-center w-4/5 sm:w-1/3 "
        onSubmit={handleSubmit}
      >
        <Input
          title="Email"
          tooltipInfo="Email da conta do Google Merchant"
          placeholder="joao@mirumagency.com"
          label="email"
          type="email"
          ref={emailRef}
        />
        <Input
          title="Senha"
          tooltipInfo="Senha da conta do Google Merchant"
          placeholder="******"
          label="password"
          type="password"
          ref={passwordRef}
        />
        <Input
          title="Id da conta"
          tooltipInfo="Id da conta do Google Merchant"
          placeholder="123123123"
          label="accountId"
          type="text"
          ref={accountIdRef}
        />
        <button
          className="py-2 px-4 border border-gray-700  bg-transparent text-gray-700 hover:text-white hover:bg-gray-700 hover:shadow-md transition-all duration-125 ease-in-out"
          type="submit"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default Contest;
