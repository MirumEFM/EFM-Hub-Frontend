import React from "react";

import { Question } from "@phosphor-icons/react";

type InputProps = {
  label: string;
  title: string;
  placeholder?: string;
  type?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, title, type, placeholder }: InputProps, ref) => {
    return (
      <div className="input-group flex flex-col mb-4 ">
        <label
          className="flex items-center text-lg text-gray-700 mb-2"
          htmlFor={label}
        >
          {label}
          <span title={title}>
            <Question size={20} />
          </span>
        </label>
        <input
          className="w-full py-2 px-1 outline outline-1 outline-black "
          name={label}
          type={type || "text"}
          placeholder={placeholder}
          ref={ref}
        ></input>
      </div>
    );
  }
);

export default Input;
