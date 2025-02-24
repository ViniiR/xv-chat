import "@styles/switch_input.scss";
import { ChangeEventHandler, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

interface SwitchProps {
    execFunction: ChangeEventHandler;
}

export default function Switch({ execFunction }: SwitchProps) {
    const useDarkMode = useContext(ThemeContext) == "dark";

    return (
        <div className="switch-wrapper">
            <input
                type="checkbox"
                onChange={execFunction}
                className={
                    "switch " + (useDarkMode ? "switch-dark" : "switch-light")
                }
            />
        </div>
    );
}
