import { Navigate } from "react-router-dom";
import { APP_ROUTES } from "../main";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { authenticated, ProtectedRouteProps } from "./ProtectedRoute";

export default function ReverseProtectedRoute({
    children,
}: ProtectedRouteProps) {
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

        async function enableStorage() {
            try {
                if (!(await document.hasStorageAccess())) {
                    alert("enable storage");
                }
            } catch (_e) {
                alert("enable storage");
            }
        }

        enableStorage();
        fetchIsAuth();
    }, []);

    if (isLoading) {
        return <Loading useDarkTheme={useDarkTheme} />;
    } else {
        return !isAuthenticated ? (
            children
        ) : (
            <Navigate to={APP_ROUTES.APP_HOME} />
        );
    }
}
