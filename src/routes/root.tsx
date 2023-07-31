import { useContext, useEffect } from "react";

import { TitleContext } from "../contexts/titleContext";
import Card from "../components/Card";

const cards = [
  {
    name: "Contestar produtos [🚧 W.I.P 🛠️]",
    path: "/contest",
    description:
      "Script que automatiza a contestação de produtos de um cliente no Google Merchant. [80% Concluído]",
  },
  {
    name: "Ranqueamento no Shopping",
    path: "/ranking",
    description:
      "Recebe arquivo CSV com produtos e retorna o posicionamento deles no Google Shopping. [100% Concluído]",
  },
];

function Root() {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("Scripts");
  }, []);

  return (
    <div className="flex w-full justify-center">
      <ul className="flex flex-col sm:flex-row gap-4">
        {cards.map((cardInfo) => (
          <Card {...cardInfo} />
        ))}
      </ul>
    </div>
  );
}

export default Root;
