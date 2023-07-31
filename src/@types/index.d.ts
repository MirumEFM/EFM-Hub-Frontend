
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