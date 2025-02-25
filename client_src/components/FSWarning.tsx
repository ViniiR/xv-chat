import "@styles/fs_warning.scss";
import { APP_ROUTES } from "../main";
import { MouseEventHandler, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import x from "@assets/x-regular-120(2).png";
import i18n from "../i18n";

interface FSWProps {
    text: string;
    handleClose: MouseEventHandler;
    alternateMessage?: boolean;
}

export default function FSWarning({
    text,
    handleClose,
    alternateMessage,
}: FSWProps) {
    const useDarkTheme = useContext(ThemeContext) === "dark";
    return (
        <div
            className={`warning ${useDarkTheme ? "warning-dark" : "warning-light"}`}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <section>
                <button onClick={handleClose}>
                    <img src={x} alt="" />
                </button>
                <strong>{text}</strong>
                {!alternateMessage && (
                    <>
                        <span>
                            <span>{i18n.t("signupLinkDescAlt")}</span>
                            <a rel="stylesheet" href={APP_ROUTES.AUTH_SIGNUP}>
                                {i18n.t("signup")}
                            </a>
                        </span>
                        <span>
                            <span>{i18n.t("loginLinkDesc")}</span>
                            <a rel="stylesheet" href={APP_ROUTES.AUTH_LOGIN}>
                                {i18n.t("login")}
                            </a>
                        </span>
                    </>
                )}
            </section>
        </div>
    );
}
