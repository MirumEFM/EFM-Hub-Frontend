import { createContext, useState, useEffect } from "react";

type TitleContextType = {
  title: string;
  setTitle: (title: string) => void;
};

const TitleContext = createContext<TitleContextType>({} as TitleContextType);

function TitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    console.log(title)
  }, [title]);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
}

export { TitleContext, TitleProvider };
