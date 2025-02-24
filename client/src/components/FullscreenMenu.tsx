import "@styles/fullscreen_menu.scss";
import React, { MouseEvent, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

interface FullscreenMenuProps {
    title: string;
    reference: React.RefObject<HTMLDivElement>;
    children?: JSX.Element | JSX.Element[];
    closedStateSetter: CallableFunction;
    zIndex?: string | number;
}

export default function FullscreenMenu({
    title,
    reference,
    children,
    closedStateSetter,
    zIndex,
}: FullscreenMenuProps) {
    const useDarkTheme = useContext(ThemeContext) == "dark";

    async function closeThisMenu(_e: MouseEvent) {
        if (reference == null) return;

        closedStateSetter(true);

        reference.current!.style.right = "-110%";
    }
    return (
        <section
            ref={reference}
            onClick={(e) => {
                e.stopPropagation();
            }}
            className={`fs-menu ${useDarkTheme ? "fs-menu-dark" : "fs-menu-light"}`}
            style={{ zIndex: zIndex ? zIndex : "15" }}
        >
            <header
                className={`fs-header ${useDarkTheme ? "fs-header-dark" : "fs-header-light"}`}
            >
                <button onClick={closeThisMenu} className="fs-back-btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        className={
                            "btn-icon " +
                            (useDarkTheme ? "btn-icon-dark" : "btn-icon-light")
                        }
                    >
                        <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path>
                    </svg>
                </button>
                <section className="title-section">
                    <strong className="fs-title">{title}</strong>
                </section>
            </header>
            <ul className="fs-body">{children}</ul>
        </section>
    );
}
