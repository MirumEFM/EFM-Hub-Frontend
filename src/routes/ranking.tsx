import React from "react";
import axios from "axios";

import { TitleContext } from "../contexts/titleContext";

import fetchStatus from "../utils/fetchStatus";

import Progress from "../components/Progress";

function Ranking() {
  const { setTitle } = React.useContext(TitleContext);
  const [fetchingTask, setFetchingTask] = React.useState(false);
  const [task, setTask] = React.useState<Task | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [backupFile, setBackupFile] = React.useState<Blob | null>(null);

  function csvToJSON(csv: string) {
    const lines = csv.split("\n");

    const result = [];

    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentLine = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
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
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async e => {
      if (!e.target) return;
      const csv = e.target.result as string;
      const json = csvToJSON(csv);
      console.log(json);
      const { data } = await axios.post("http://localhost:8080/ranking", {
        products: json,
      });
      const { taskId } = data;
      const properties = await fetchStatus(taskId);
      setTask({
        id: taskId,
        properties,
      });
    };
  }

  React.useEffect(() => {
    if (!task) return;
    let interval: number | undefined;
    if (task.properties.status === "pending" && !fetchingTask) {
      setFetchingTask(true);
      interval = setInterval(async () => {
        try {
          console.log("fetching status");
          const properties = await fetchStatus(task.id);
          if (!properties.data) return;
          const newBackupFile = jsonToCSV(properties.data);
          setTask(() => ({ id: task.id, properties }));
          setBackupFile(new Blob([newBackupFile], { type: "text/csv" }));
          if (properties.status !== "pending") {
            setFetchingTask(false);
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

  React.useEffect(() => {
    setTitle("Ranqueamento de produtos");
  }, []);

  return (
    <div className="p-4">
      <form className="" onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={e => {
            if (!e.target.files) return;
            setFile(e.target.files[0]);
          }}
        />
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
            Baixar {task?.properties.status !== "finished" ? "Backup" : "Arquivo"}
          </a>
        )}
        {task?.properties && <div className="my-4">{task.properties.progress && <Progress {...task.properties} />}</div>}
      </form>
    </div>
  );
}

export default Ranking;
