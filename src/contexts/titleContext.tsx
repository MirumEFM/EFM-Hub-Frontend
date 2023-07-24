import { createContext, useState } from "react";

type TitleContextType = {
  title: string;
  setTitle: (title: string) => void;
};

const TitleContext = createContext<TitleContextType>({} as TitleContextType);

function TitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string>("");

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
}

export { TitleContext, TitleProvider };
