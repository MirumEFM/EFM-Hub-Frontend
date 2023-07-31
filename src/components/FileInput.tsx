import React from "react";
import { Image } from "@phosphor-icons/react";

type FileInputProps = {
  files: FileList | null;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  maxFiles: number;
};

const FileInput = ({ files, setFiles, maxFiles }: FileInputProps) => {
  const [dragOver, setDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!error) return;
    setTimeout(() => {
      setError(null);
    }, 10000);
  }, [error]);

  return (
    <input
      className={`border border-black border-dashed p-2 py-10 w-full transition-all duration-200 ${
        dragOver && "bg-white"
      }`}
      onDragOver={() => setDragOver(true)}
      onDragEnd={() => setDragOver(false)}
      onDragLeave={() => setDragOver(false)}
      type="file"
      accept=".csv"
      onChange={(e) => {
        if (!e.target.files) return;
        if (e.target.files.length > maxFiles) {
          setError(`Máximo de ${maxFiles} arquivo(s) atingido.`);
        }
        setFiles(e.target.files);
      }}
    />
  );
};

export default FileInput;
