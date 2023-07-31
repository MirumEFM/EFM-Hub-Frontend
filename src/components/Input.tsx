import { Question } from "@phosphor-icons/react";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  label: string;
  tooltipInfo: string;
}

const Input = React.forwardRef(function Input(props: InputProps, ref) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-1">
        <label htmlFor={props.label}>{props.title}</label>
        <span title={props.tooltipInfo}>
          <Question />
        </span>
      </div>
      <input
        className="p-2 outline outline-1 focus:outline-2 w-full "
        name={props.label}
        type={props.type}
        placeholder={props.placeholder}
        ref={ref as React.ForwardedRef<HTMLInputElement>}
      />
    </div>
  );
});

export default Input;
