import { Outlet } from "react-router-dom";
import { TitleProvider, TitleContext } from "./contexts/titleContext";
import { useContext } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const { title } = useContext(TitleContext);

  return (
    <TitleProvider>
      <Header title={title} />
      <main className="h-screen p-8 min-h-screen-270px box-border">
        <Outlet />
      </main>
      <Footer />
    </TitleProvider>
  );
}

export default App;
