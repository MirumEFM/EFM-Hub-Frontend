type ProgressProps = {
  status: "pending" | "error" | "finished";
  message: string;
  progress: number;
};

function Progress({ message, progress, status }: ProgressProps) {
  return (
    <div className="flex justify-center items-center w-full relative p-2 bg-white">
      <span
        style={{
          width: `${progress}%`,
        }}
        // animate-pulse
        className={`absolute h-full z-10 top-0 left-0 transition-all duration-500 ease-in-out ${
          progress > 0 && progress < 100 ? "animate-pulse " : ""
        } ${status === "error" ? "bg-red-500" : "bg-green-500"}`}
      ></span>
      <span className="z-20">
        {Number(progress.toFixed(2))}% - {message}
      </span>
    </div>
  );
}

export default Progress;
