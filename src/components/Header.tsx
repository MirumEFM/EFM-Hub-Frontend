import React from "react";
import { TitleContext } from "../contexts/titleContext";
import { Link } from "react-router-dom";
import mirumLogo from "../assets/logo.svg";

// Receber title de um contexto
function Header() {
  const { title } = React.useContext(TitleContext);

  return (
    <header className="flex flex-col gap-2 items-center bg-yellow-300 p-4 border-b-2 border-gray-700">
      <div>
        <Link to="/">
          <img src={mirumLogo} alt="Mirum logo" />
        </Link>
      </div>
      <div className="title-container flex justify-center items-center  text-gray-700 col-span-2">
        <h1 className="title font-bold text-2xl text-black no-underline">
          {title}
        </h1>
      </div>
    </header>
  );
}

export default Header;
