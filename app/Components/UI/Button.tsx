import { ReactNode } from "react";

const Button = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <button
      className={`px-4  py-1 rounded cursor-pointer bg-zinc-600 hover:bg-zinc-700 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
