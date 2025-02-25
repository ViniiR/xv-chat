import { createRoot } from "react-dom/client";
import App from "@src/App";
import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SearchFeed from "./components/SearchFeed";
import DMFeed from "./components/DirectMessageFeed";
import Feed from "./components/Feed";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ReverseProtectedRoute from "./components/ReverseProtectedRoute";
import { Provider } from "react-redux";
import STORE from "@src/redux/store";

const domNode = document.getElementById("root");
const root = createRoot(domNode!);

export const APP_ROUTES = {
    APP_HOME: "/",
    APP_SEARCH: "/search",
    APP_DIRECT_MESSAGES: "/direct",
    POST: "/post",
    EDIT_POST: "/edit-post",

    AUTH_LOGIN: "/login",
    AUTH_SIGNUP: "/sign-up",

    EDIT_PROFILE: "/edit/profile",
} as const;

const router = createBrowserRouter([
    {
        path: APP_ROUTES.APP_HOME,
        element: (
            <ProtectedRoute>
                <App component={"Home"} />
            </ProtectedRoute>
        ),
        children: [
            {
                path: APP_ROUTES.APP_HOME,
                element: <Feed mainPage={true}></Feed>,
            },
            {
                path: APP_ROUTES.APP_SEARCH,
                element: <SearchFeed />,
            },
            {
                path: APP_ROUTES.APP_DIRECT_MESSAGES,
                element: <DMFeed />,
            },
        ],
    },
    {
        path: `${APP_ROUTES.APP_HOME}/:user`,
        element: <App component={"Profile"} />,
    },
    {
        path: `${APP_ROUTES.POST}/:postId`,
        element: <App component={"Post"} />,
    },
    {
        path: `${APP_ROUTES.EDIT_POST}/:postId`,
        element: <App component={"EditPost"} />,
    },
    {
        path: APP_ROUTES.AUTH_LOGIN,
        element: (
            <ReverseProtectedRoute>
                <Login />
            </ReverseProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.AUTH_SIGNUP,
        element: (
            <ReverseProtectedRoute>
                <SignUp />
            </ReverseProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.EDIT_PROFILE,
        element: (
            <ProtectedRoute>
                <App component={"EditProfile"} />
            </ProtectedRoute>
        ),
    },
]);

// TODO: try moving the theme context to here
root.render(
    <StrictMode>
        <Provider store={STORE}>
            <RouterProvider router={router}></RouterProvider>
        </Provider>
    </StrictMode>,
);
