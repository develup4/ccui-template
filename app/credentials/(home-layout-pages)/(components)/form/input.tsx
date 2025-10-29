import { InputHTMLAttributes } from "react";

interface FormInputProps {
  name: string;
  textSize?: string;
  errors?: string[];
  errorPosition?: string;
  transparent?: boolean;
  className?: string;
}

export default function FormInput({
  name,
  textSize = "text-xs",
  errors = [],
  errorPosition = "mt-1 ml-1",
  transparent = false,
  className = "",
  ...rest
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="w-full flex flex-col">
      <input
        name={name}
        {...rest}
        className={`w-full rounded-lg ${
          transparent ? "bg-transparent" : "bg-white"
        } ring-sky-500 focus:ring-2 focus:outline-none text-gray-700 placeholder:text-xs placeholder:text-gray-300 p-2.5 ${textSize} ${className}`}
      />
      <div className={errorPosition}>
        {errors.map((error, index) => (
          <p className="text-red-500 test-xs" key={index}>
            {error}
          </p>
        ))}
      </div>
    </div>
  );
}
