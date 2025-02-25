import "@styles/fs_menu_button.scss";
import { MouseEventHandler, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

interface FSMbtnProps {
    icon: any;
    children: string;
    description: string;
    execOnClick: MouseEventHandler;
    className?: string;
}

export default function FSMenuButton({
    icon,
    children,
    description,
    execOnClick,
    className,
}: FSMbtnProps) {
    const useDarkTheme = useContext(ThemeContext) == "dark";

    return (
        <li
            className={`fsm-btn-wrapper ${useDarkTheme ? "fsm-w-dark" : "fsm-w-light"} ${className ?? ""}`}
            onClick={execOnClick}
        >
            <button className="fsm-btn">
                <img src={icon} alt="icon" />
                <span>{children}</span>
                <p>{description}</p>
            </button>
        </li>
    );
}
