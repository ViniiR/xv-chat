import "@styles/icon_button.scss";
import { MouseEventHandler, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

interface IconBtnProps {
    icon: any;
    children?: string;
    className?: string;
    altText: string;
    executeFunction: MouseEventHandler;
}

export default function IconButton({
    icon,
    children,
    className,
    altText,
    executeFunction,
}: IconBtnProps) {
    const useDarkMode = useContext(ThemeContext) == "dark";

    return (
        <li className="icon-btn-list-wrapper">
            <button
                onClick={executeFunction}
                className={
                    "icon-btn " +
                    (useDarkMode ? "icon-btn-dark " : "icon-btn-light ") +
                    className
                }
            >
                <img
                    src={icon}
                    className={useDarkMode ? "svg-icon-dark" : "svg-icon-light"}
                    alt={altText}
                />
                <p>{children}</p>
            </button>
        </li>
    );
}
