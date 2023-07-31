/* import React from "react";
import axios from "axios";

import { TitleContext } from "../contexts/titleContext";

import fetchStatus from "../utils/fetchStatus";

import Progress from "../components/Progress";
import FileInput from "../components/FileInput";

function Ranking() {
  const { setTitle } = React.useContext(TitleContext);
  const [task, setTask] = React.useState<Task | null>(null);
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [backupFile, setBackupFile] = React.useState<Blob | null>(null);

  function csvToJSON(csv: string) {
    const lines = csv.split("\n");

    const result = [];

    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentline = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    return result;
  }

  function jsonToCSV(json: any) {
    const header = Object.keys(json[0]).join(",");

    const values = json.map((item: any) => Object.values(item).join(","));

    return [header, ...values].join("\n");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // if (files.length < 1) return;
    // const reader = new FileReader();
    // reader.readAsText(files);
    // reader.onload = async (e) => {
    //   if (!e.target) return;
    //   const csv = e.target.result as string;
    //   const json = csvToJSON(csv);
    //   const { data } = await axios.post("/ranking", json);
    //   const { taskId } = data;
    //   const properties = await fetchStatus(taskId);
    //   setTask({
    //     id: taskId,
    //     properties,
    //   });
    // };
  }

  React.useEffect(() => {
    if (task?.properties.status === "pending") {
      setTimeout(async () => {
        const properties = await fetchStatus(task.id);
        const newBackupFile = jsonToCSV(properties.data);
        setBackupFile(new Blob([newBackupFile], { type: "text/csv" }));
      }, 1000);
    }

    return () => {
      setTask(null);
    };
  }, [task]);

  React.useEffect(() => {
    setTitle("Ranqueamento de produtos");
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FileInput files={files} setFiles={setFiles} maxFiles={1} />
        <div className="flex justify-center items-center w-full">
          <button
            className="btn py-2 px-4 border border-gray-700 bg-yellow-300 text-gray-700 hover:text-white hover:bg-gray-700 hover:shadow-md transition-all duration-125 ease-in-out "
            type="submit"
          >
            Enviar
          </button>
        </div>
        {backupFile && (
          <a
            href={URL.createObjectURL(backupFile)}
            download="ranking.csv"
            className="btn py-2 px-4 border border-gray-700 bg-yellow-300 text-gray-700 hover:text-white hover:bg-gray-700 hover:shadow-md transition-all duration-125 ease-in-out"
          >
            Baixar arquivo de backup
          </a>
        )}
        {task?.properties && (
          <div className="my-4">
            {task.properties.progress && <Progress {...task.properties} />}
          </div>
        )}
      </form>
    </div>
  );
}

export default Ranking;


// */