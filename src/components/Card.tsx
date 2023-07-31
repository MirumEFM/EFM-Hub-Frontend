import { Link } from "react-router-dom";

type CardProps = {
  name: string;
  description: string;
  path: string;
};

export default function Card({ name, description, path }: CardProps) {
  return (
    <li key={path} className="inline-block w-full sm:max-w-xs h-48 p-4 rounded bg-white transition-all duration-200 transform hover:scale-105 shadow-md">
      <Link className="text-xl font-bold text-gray-700 no-underline" to={path}>{name}</Link>
      <p className="text-lg text-gray-700">{description}</p>
    </li>
  );
}
