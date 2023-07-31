import axios from "axios";

type TaskStatus = {
  createdAt: Date;
  status: "pending" | "error" | "finished";
  message: string;
  progress: number;
  data: any;
};

async function fetchStatus(taskId: string): Promise<TaskStatus> {
  const { data } = await axios.get(`http://localhost/status/${taskId}`);
  return data;
}

export default fetchStatus;
