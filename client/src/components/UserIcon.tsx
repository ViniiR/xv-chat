import "@styles/user_icon.scss";
import { MouseEventHandler } from "react";

interface UserIconProps {
    userIconImg: any;
    className?: string;
    onclick?: MouseEventHandler;
}

export default function UserIcon({
    userIconImg,
    onclick,
    className,
}: UserIconProps) {
    return (
        <button
            onClick={onclick}
            className={`user-icon-toggle-btn ${className ? className : ""}`}
        >
            <img src={userIconImg} className={className} alt="" />
        </button>
    );
}
