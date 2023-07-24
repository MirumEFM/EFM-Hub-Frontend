import { useContext, useEffect } from "react";
import Card from "../components/Card";
import { TitleContext } from "../contexts/titleContext";

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
  });

  return (
    <div className="">
      <ul className="card-group flex flex-wrap flex-col justify-center m-0 p-0">
        {cards.map((cardInfo) => (
          <Card {...cardInfo} />
        ))}
      </ul>
    </div>
  );
}

export default Root;
