import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

//criado um componente de Input para utilizar em todas as paginas

export function Input(props: InputProps){
  return(
    <input
      className="border h-9 rounded-md outline-none px-2 mb-1 bg-amber-50"
      {...props}
    />
  )
}