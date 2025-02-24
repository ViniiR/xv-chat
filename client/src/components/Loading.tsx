import "@styles/loading.scss";
import { useSelector } from "react-redux";
import { darkGlobalThemeStateSelector } from "../redux/store";

interface LoadingProps {
    useDarkTheme?: boolean;
}

export default function Loading({ useDarkTheme }: LoadingProps) {
    const useDarkTheme2 = useSelector(
        (state: darkGlobalThemeStateSelector) => state.darkGlobalTheme.value,
    );
    return (
        <div
            className={`loading ${useDarkTheme2 ? "loading-dark" : "loading-light"}`}
        ></div>
    );
}
