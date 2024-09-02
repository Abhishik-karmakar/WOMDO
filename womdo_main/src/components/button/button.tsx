import { ButtonHTMLAttributes } from 'react';

type TButton = ButtonHTMLAttributes<HTMLButtonElement> & {
    text?: string,
    fluid?: boolean,
    loading?: boolean,
}

const Button = (props: TButton) => {
    const { text, children, type, loading, className, fluid, ...rest } = props;
    return (
        <button
            {...rest}
            type={type || "button"}
            className={`${className ?? ""} custom_btn ${fluid ? "w-100" : ""}`}
        >
            {text ?? children}
        </button>
    )
}

export default Button
