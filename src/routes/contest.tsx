import React from "react";
import axios from "axios";

import fetchStatus from "../utils/fetchStatus";

import { TitleContext } from "../contexts/titleContext";
import Input from "../components/Input";
import Progress from "../components/Progress";
import { CheckFat, FileCsv } from "@phosphor-icons/react";
import { Button } from "../components/Button";

function Contest() {
  const { setTitle } = React.useContext(TitleContext);

  React.useEffect(() => {
    setTitle("Contestar produtos");
  }, []);

  const [fetchingTask, setFetchingTask] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [task, setTask] = React.useState<Task | null>(null);

  const [emailRef, passwordRef, accountIdRef] = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
  ];

  const gotoNextStep = () => {
    const ns = currentStep + 1;
    if (ns > Steps.length - 1) setCurrentStep(0);
    else setCurrentStep(ns);
  };

  React.useEffect(() => {
    if (!task) return;
    let interval: number | undefined;
    if (task.properties.status === "pending" && !fetchingTask) {
      setFetchingTask(true);
      interval = setInterval(async () => {
        try {
          console.log("fetching status");
          const properties = await fetchStatus(task.id);
          setTask(() => ({ id: task.id, properties }));
          if (properties.status !== "pending") {
            setFetchingTask(false);
            gotoNextStep();
          }
        } catch (err) {
          console.log(err);
          setFetchingTask(false);
        }
      }, 2000);
    } else {
      if (interval) clearInterval(interval);
    }
  }, [task, fetchingTask]);

  const Steps = [Step1(), Step2()];

  function Step1() {
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const [email, password, accountId] = [
        emailRef.current?.value,
        passwordRef.current?.value,
        accountIdRef.current?.value,
      ];

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
        <div className="flex flex-col w-full gap-6">
          <div className="flex flex-col gap-2">
            <Input
              title="Email"
              tooltipInfo="Email da conta do Google Merchant"
              placeholder="joao@mirumagency.com"
              label="email"
              type="email"
              ref={emailRef}
              required
            />
            <Input
              title="Senha"
              tooltipInfo="Senha da conta do Google Merchant"
              placeholder="******"
              label="password"
              type="password"
              ref={passwordRef}
              required
            />
          </div>
          <Input
            title="Id da conta"
            tooltipInfo="Id da conta do Google Merchant"
            placeholder="123123123"
            label="accountId"
            type="text"
            ref={accountIdRef}
            required
          />
        </div>
        <Button>Enviar</Button>
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
      if (!files) return alert("Selecione arquivos para enviar.");
    }

    return (
      <div className="flex container flex-col w-full">
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
          <div className="flex flex-col gap-1 mb-4 ">
            <p className="text-lg">
              {fileNames.length > 1
                ? "Arquivo(s) selecionado(s):"
                : "Nenhum arquivo selecionado"}
            </p>
            {fileNames.length > 1 && (
              <div className="grid grid-cols-3 gap-2  bg-amber-400 p-2 rounded-md overflow-y-scroll overflow-x-hidden h-1/2">
                {fileNames.map((el, i) => (
                  <div
                    className="flex flex-col bg-amber-500 p-2 rounded-md min-w-min"
                    key={`file-${i}`}
                  >
                    <FileCsv size={32} />
                    <p>{`${el.split("_")[2]}.csv`}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-center my-2">
            Você receberá uma nova notificação do OKTA verify.
          </p>
          <div className="flex justify-center items-center w-full">
            <Button>Enviar</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-2">
      <h3 className="flex w-full justify-center font-semibold text-xl">
        Etapa {currentStep + 1} de {Steps.length}
      </h3>

      <div className="flex justify-center w-full">{Steps[currentStep]}</div>
      <div className="flex justify-center">
        <button
          className="bg-slate-600 border text-black p-2 border-black"
          onClick={gotoNextStep}
        >
          Cycle through steps
        </button>
      </div>
    </div>
  );
}

export default Contest;
