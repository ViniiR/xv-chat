import "@styles/simple_icon_button.scss";
import { MouseEventHandler } from "react";

interface SimpleBtnProps {
    children: JSX.Element;
    execOnClick: MouseEventHandler;
    className?: string;
}

export default function SimpleIconBtn({
    children,
    className,
    execOnClick,
}: SimpleBtnProps) {
    return (
        <button
            onClick={execOnClick}
            className={`${className || ""} simple-icon-btn`}
        >
            {children}
        </button>
    );
}
