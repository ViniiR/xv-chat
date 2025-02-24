import { Navigate } from "react-router-dom";
import { APP_ROUTES } from "../main";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export interface ProtectedRouteProps {
    children: JSX.Element;
}

export async function authenticated(): Promise<boolean> {
    const url = `${process.env.API_URL_ROOT}${process.env.AUTH_PATH}`;
    try {
        const res = await fetch(url, {
            mode: "cors",
            method: "GET",
            credentials: "include",
        });
        if (res.status > 199 && res.status < 300) {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const useDarkTheme = localStorage.getItem("theme") === "dark";

    useEffect(() => {
        (async function () {
            try {
                await fetch(`${process.env.ORIGINAL_API_URL_ROOT}`);
                // set global message that server will spin up
            } catch (err) {
                console.error(err);
            }
        })();

        async function fetchIsAuth() {
            const isAuth = await authenticated();
            setIsAuthenticated(isAuth);
            setIsLoading(false);
        }

        fetchIsAuth();
    }, []);

    if (isLoading) {
        return <Loading useDarkTheme={useDarkTheme} />;
    } else {
        return isAuthenticated ? (
            children
        ) : (
            <Navigate to={APP_ROUTES.AUTH_LOGIN} />
        );
    }
}
