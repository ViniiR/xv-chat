import "@styles/input.scss";
import { ChangeEventHandler, useRef } from "react";

interface InputProps {
    label: string;
    type: string;
    id: string;
    formikError?: string;
    onChange: ChangeEventHandler;
    icon: any;
}

export default function Input({
    id,
    label,
    type,
    formikError,
    onChange,
    icon,
}: InputProps) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <section className="input-wrapper">
            <input
                ref={ref}
                onChange={onChange}
                placeholder={label}
                formNoValidate
                type={type == "email" ? "text" : type}
                id={id}
            />
            <img
                src={icon}
                onClick={() => {
                    ref.current?.focus();
                }}
                alt=""
            />
            <output className="invalid-warnings">{formikError}</output>
        </section>
    );
}
