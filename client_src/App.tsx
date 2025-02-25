import Home from "@components/Home";
import { useEffect, useState } from "react";
import { ThemeContext } from "./contexts/ThemeContext";
import "@styles/app.scss";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import FSPost from "./components/FSPost";
import { UserAtContext } from "./contexts/UserAtContext";
import { setUseDark } from "./redux/store";
import { useDispatch } from "react-redux";
import EditPost from "./components/EditPost";

interface AppProps {
    component: string;
}

export default function App({ component }: AppProps): JSX.Element {
    const storedTheme = localStorage.getItem("theme") ?? "light";
    const [theme, setTheme] = useState(storedTheme);
    const [userAt, setUserAt] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        if (storedTheme === "dark") {
            document.querySelector("#root")?.classList.add("black-bg");
            document.body?.classList.add("black-bg");
            dispatch(setUseDark(true));
        } else {
            dispatch(setUseDark(false));
        }
    }, []);

    async function changeGlobalTheme() {
        const root = document.querySelector("#root");
        const body = document.body;
        switch (theme) {
            case "dark":
                setTheme("light");
                localStorage.setItem("theme", "light");
                root?.classList.remove("black-bg");
                body?.classList.remove("black-bg");
                dispatch(setUseDark(true));
                break;
            case "light":
                setTheme("dark");
                localStorage.setItem("theme", "dark");
                root?.classList.add("black-bg");
                body?.classList.add("black-bg");
                dispatch(setUseDark(false));
                break;
        }
    }
    async function changeUserAt(userAt: string) {
        setUserAt(userAt);
    }

    switch (component) {
        case "Home":
            return (
                <ThemeContext.Provider value={theme}>
                    <UserAtContext.Provider value={userAt}>
                        <Home
                            setTheme={changeGlobalTheme}
                            setUserAtContext={changeUserAt}
                        />
                    </UserAtContext.Provider>
                </ThemeContext.Provider>
            );
        case "Profile":
            return (
                <ThemeContext.Provider value={theme}>
                    <UserAtContext.Provider value={userAt}>
                        <Profile
                            setTheme={changeGlobalTheme}
                            setUserAtContext={changeUserAt}
                        />
                    </UserAtContext.Provider>
                </ThemeContext.Provider>
            );
        case "EditProfile":
            return (
                <ThemeContext.Provider value={theme}>
                    <EditProfile setTheme={changeGlobalTheme} />
                </ThemeContext.Provider>
            );
        case "Post":
            return (
                <ThemeContext.Provider value={theme}>
                    <UserAtContext.Provider value={userAt}>
                        <FSPost setTheme={changeGlobalTheme} />
                    </UserAtContext.Provider>
                </ThemeContext.Provider>
            );
        case "EditPost":
            return (
                <ThemeContext.Provider value={theme}>
                    <UserAtContext.Provider value={userAt}>
                        <EditPost setTheme={changeGlobalTheme} />
                    </UserAtContext.Provider>
                </ThemeContext.Provider>
            );
        default:
            return <div>something went wrong</div>;
    }
}
