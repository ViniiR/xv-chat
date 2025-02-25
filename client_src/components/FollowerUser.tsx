import "@styles/follower_user.scss";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import userIcon from "@assets/user-circle-solid-108.png";
import { useNavigate } from "react-router-dom";

interface FollowerUserProps {
    user: { userName: string; userAt: string; icon: string };
    beforeOnClick: CallableFunction;
    //unfollow: MouseEventHandler;
}

export default function FollowerUser({
    user,
    beforeOnClick,
}: FollowerUserProps) {
    const useDarkTheme = useContext(ThemeContext) === "dark";
    const navigateTo = useNavigate();
    return (
        <button
            className={`follower-user ${useDarkTheme ? "fuser-dark" : "fuser-light"}`}
            onClick={() => {
                beforeOnClick();
                navigateTo(`/${user.userAt}`);
            }}
        >
            <img src={user.icon === "" ? userIcon : user.icon} alt="" />
            <section>
                <strong>{user.userName}</strong>
                <span>@{user.userAt}</span>
            </section>
        </button>
    );
}

export function EmptyFollowUser({ text }: { text: string }) {
    const useDarkTheme = useContext(ThemeContext) === "dark";
    return (
        <div
            className={`empty-follow ${useDarkTheme ? "mt-dark" : "mt-light"}`}
        >
            {text}
        </div>
    );
}
