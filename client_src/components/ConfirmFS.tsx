import "@styles/confirm_fs.scss";
import { MouseEventHandler, RefObject, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

interface ConfirmProps {
    ok: string;
    cancel: string;
    description: string;
    onConfirm: MouseEventHandler;
    reference: RefObject<HTMLDivElement>;
    revertColors: boolean;
    onCloseHandler: CallableFunction;
}

export default function Confirm({
    ok,
    cancel,
    description,
    onConfirm,
    reference,
    revertColors,
    onCloseHandler,
}: ConfirmProps) {
    const useDarkTheme = useContext(ThemeContext) === "dark";
    return (
        <main
            className={`confirm-wrapper ${useDarkTheme ? "dark-confirm" : "light-confirm"}`}
            ref={reference}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <main className={`confirm ${revertColors ? "revert-colors" : ""}`}>
                <strong className="confirm-description">{description}</strong>
                <button
                    className="cancel-btn"
                    onClick={() => {
                        if (reference == null) return;
                        reference.current!.style.display = "none";
                        onCloseHandler();
                    }}
                >
                    {cancel}
                </button>
                <button className="ok-btn" onClick={onConfirm}>
                    {ok}
                </button>
            </main>
        </main>
    );
}
