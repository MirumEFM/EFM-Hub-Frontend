import { Outlet } from "react-router-dom";
import { TitleProvider } from "./contexts/titleContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <TitleProvider>
      <Header />
      <main className="h-screen min-h-screen-270px box-border">
        <Outlet />
      </main>
      <Footer />
    </TitleProvider>
  );
}

export default App;
