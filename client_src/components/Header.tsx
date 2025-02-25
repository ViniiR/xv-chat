import "@styles/header.scss";
import { MouseEventHandler, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import UserIcon from "./UserIcon";

interface HeaderProps {
    showSlideMenu: MouseEventHandler;
    userIcon: string;
}

export default function Header({ showSlideMenu, userIcon }: HeaderProps) {
    const useDarkTheme = useContext(ThemeContext) == "dark";

    return (
        <header
            className={
                "header " + (useDarkTheme ? "dark-header" : "light-header")
            }
        >
            <section className="mini-profile-wrapper" onClick={showSlideMenu}>
                <UserIcon
                    className="slide-menu-icon"
                    userIconImg={userIcon}
                ></UserIcon>
            </section>
            <div className="logo-wrapper"></div>
        </header>
    );
}

//<img src={StellaOctangula} className="logo" alt="" />
