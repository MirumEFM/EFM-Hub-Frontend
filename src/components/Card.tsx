import { Link } from "react-router-dom";

type CardProps = {
  name: string;
  description: string;
  path: string;
};

export default function Card({ name, description, path }: CardProps) {
  return (
    <li key={path} className="card inline-block w-full max-w-xs min-w-xs h-48 m-2 p-4 rounded bg-white transition-all duration-200 transform hover:scale-105 shadow-md">
      <Link className="text-xl font-bold text-gray-700 no-underline" to={path}>{name}</Link>
      <p className="text-lg text-gray-700">{description}</p>
    </li>
  );
}
