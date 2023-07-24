import { Link } from "react-router-dom";
import mirumLogo from "../assets/logo.svg";

// Receber title de um contexto
function Header({ title }: { title: string }) {
  return (
    <header className="grid grid-cols-4 items-center bg-yellow-300 p-8 border-b-2 border-gray-700">
      <div>
        <Link to="/">
          <img src={mirumLogo} alt="Mirum logo" />
        </Link>
      </div>
      <div className="title-container flex justify-center items-center  text-gray-700 col-span-2">
        <h1 className="title font-bold text-xl text-gray-700 no-underline">{title}</h1>
      </div>
    </header>
  );
}

export default Header;
