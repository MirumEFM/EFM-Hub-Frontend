import { useEffect, useState } from "react";
import Progress from "../components/Progress";
import api from "../lib/api";

type TaskStatus = {
  createdAt: Date;
  status: "pending" | "error" | "finished";
  message: string;
  progress: number;
  data: any;
};

type Task = {
  id: string;
  properties: TaskStatus;
};

function Ranking() {
  const [task, setTask] = useState<Task | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [backupFile, setBackupFile] = useState<Blob | null>(null);

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
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (e) => {
      if (!e.target) return;
      const csv = e.target.result as string;
      const json = csvToJSON(csv);
      const { data } = await api.post("/ranking", json);
      fetchStatus(data.taskId);
    };
  }

  async function fetchStatus(taskId: string) {
    try {
      const { data } = await api.get(`/status/${taskId}`);
      setTask((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          properties: data,
        };
      });
    } catch (err: any) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (task?.properties.status === "pending") {
      setTimeout(async () => {
        await fetchStatus(task.id);
        const newBackupFile = jsonToCSV(task.properties.data);
        setBackupFile(new Blob([newBackupFile], { type: "text/csv" }));
      }, 1000);
    }

    return () => {
      setTask(null);
    };
  }, [task]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
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
