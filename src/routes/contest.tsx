import React from "react";
import axios from "axios";

import fetchStatus from "../utils/fetchStatus";

import { TitleContext } from "../contexts/titleContext";
import Input from "../components/Input";
import Progress from "../components/Progress";
import { CheckFat, FileCsv } from "@phosphor-icons/react";

function Contest() {
  const { setTitle } = React.useContext(TitleContext);

  React.useEffect(() => {
    setTitle("Contestar produtos");
  }, []);

  const [currentStep, setCurrentStep] = React.useState(0);
  const [task, setTask] = React.useState<Task | null>(null);

  const [emailRef, passwordRef, accountIdRef] = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
  ];

  React.useEffect(() => {
    if (!task) return;
    const interval = setInterval(async () => {
      try {
        const properties = await fetchStatus(task.id);
        setTask({
          id: task.id,
          properties,
        });
        if (
          task.properties.progress === 100 &&
          task.properties.message === "Esperando por CSV"
        ) {
          setCurrentStep((prev) => prev + 1);
        }
      } catch (err) {
        console.log(err);
      }
    }, 3000); // Atualiza o status da tarefa a cada três segundos

    return () => {
      clearInterval(interval);
    };
  }, [task]);

  const Steps = [Step1(), Step2()];

  function Step1() {
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
        console.log(properties);
      } catch (err: any) {
        console.log(err);
      }
    }

    return (
      <form
        key="0"
        className="flex flex-col gap-2 items-center justify-center w-4/5 sm:w-1/3 "
        onSubmit={handleSubmit}
      >
        <div className="w-full">
          {task && (
            <div className="my-4">
              {task.properties.progress && (
                <Progress
                  message={task.properties.message}
                  status={task.properties.status}
                  progress={task.properties.progress}
                />
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col w-full gap-8">
          <div>
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
          </div>
          <Input
            title="Id da conta"
            tooltipInfo="Id da conta do Google Merchant"
            placeholder="123123123"
            label="accountId"
            type="text"
            ref={accountIdRef}
          />
        </div>
        <button
          className="py-2 px-4 border border-gray-700  bg-transparent text-gray-700 hover:text-white hover:bg-gray-700 hover:shadow-md transition-all duration-125 ease-in-out"
          type="submit"
        >
          Enviar
        </button>
      </form>
    );
  }

  function Step2() {
    const [files, setFiles] = React.useState<FileList | null>(null);
    const [fileNames, setFileNames] = React.useState<string[]>([]);

    React.useEffect(() => {
      console.log(files);
    }, [files]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (!e.target.files) return;

      const newFiles = e.target.files;

      for (const file of newFiles) {
        if (!file.name.includes("item_issue"))
          return alert("Esperando apenas por arquivos das subcontas.");
        if (fileNames.includes(file.name))
          return alert(`Arquivo ${file.name} já foi adicionado!`);

        setFiles(newFiles);
        setFileNames((prev) => [...prev, file.name]);
      }
    }

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
    }

    return (
      <form onSubmit={handleSubmit}>
        {task?.properties && (
          <div className="my-4">
            {task.properties.progress && (
              <Progress
                message={task.properties.message}
                status={task.properties.status}
                progress={task.properties.progress}
              />
            )}
          </div>
        )}
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr>
              <th className="bg-gray-100 text-gray-800 font-semibold py-2 px-4">
                URL
              </th>
              <th className="bg-gray-100 text-gray-800 font-semibold py-2 px-4">
                Categoria de problema
              </th>
              <th className="bg-gray-100 text-gray-800 font-semibold py-2 px-4">
                Selecionado
              </th>
            </tr>
          </thead>
          <tbody>
            {task?.properties.data &&
              task.properties.data.length > 1 &&
              task.properties.data.map((item: any, index: number) => (
                <tr className="even:bg-gray-100 bg-gray-300" key={index}>
                  <td className="py-2 px-4 border">
                    <a
                      className="underline text-blue-600"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.url.substring(0, 65)}...
                    </a>
                  </td>
                  <td className="py-2 px-4 border">{item.issue}</td>
                  <td className="py-2 px-4 border text-center">
                    {fileNames
                      .map((name) => name.split("_")[2])
                      .includes(item.url.split("=")[1].split("&")[0]) ? (
                      <span className="text-green-600">✔</span>
                    ) : (
                      <span className="text-red-600">✘</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <input
          className="my-2"
          onChange={handleChange}
          type="file"
          accept=".csv"
          multiple
        />
        <div className="flex flex-col gap-1 mb-4">
          <p className="text-lg">Arquivos selecionados:</p>
          <div className="grid grid-cols-3 gap-2 bg-amber-400 p-2 rounded-md overflow-y-scroll h-32">
            {fileNames.map((el, i) => (
              <div
                className="flex flex-col bg-amber-500 p-2 rounded-md"
                key={`file-${i}`}
              >
                <FileCsv size={32} />
                <p>{`${el.split("_").slice(0, 3).join("_")}.csv`}</p>
              </div>
            ))}
          </div>
        </div>
        <p>Você vai receber uma nova notificação do OKTA verify.</p>
        <div className="flex justify-center items-center w-full">
          <button
            className="btn py-2 px-4 border border-gray-700 bg-yellow-300 text-gray-700 hover:text-white hover:bg-gray-700 hover:shadow-md transition-all duration-125 ease-in-out "
            type="submit"
          >
            Enviar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col justify-center  gap-2">
      <div className="flex w-full justify-center font-semibold text-lg">
        Etapa {currentStep + 1} de {Steps.length}
      </div>
      <div className="flex justify-center w-full">{Steps[currentStep]}</div>
      <div className="flex justify-center">
        <button
          className="bg-slate-600 border text-black p-2 border-black"
          onClick={() => {
            const ns = currentStep + 1;
            if (ns > Steps.length - 1) setCurrentStep(0);
            else setCurrentStep(ns);
          }}
        >
          Cycle through steps
        </button>
      </div>
    </div>
  );
}

export default Contest;
