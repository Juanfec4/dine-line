import { FC } from "react";

interface Props {
  message: string;
}

const FormError: FC<Props> = ({ message }) => {
  return <p className="text-red-500 text-sm">{message}</p>;
};

export default FormError;
