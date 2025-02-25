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

export const API_ROUTES = {
    CREATE_USER_PATH: "/user/create",
    LOGIN_USER_PATH: "/user/login",
    DELETE_USER_PATH: "/user/delete",
    LOGOUT_USER_PATH: "/user/log-out",
    DATA_USER_PATH: "/user/data",
    AUTH_PATH: "/auth/validate",
    GET_PROFILE_DATA_PATH: "/user/profile",
    FOLLOW_USER_PATH: "/user/follow",
    FOLLOWERS_DATA_PATH: "/user/followers",
    FOLLOWING_DATA_PATH: "/user/following",
    EDIT_PROFILE_PATH: "/user/change/profile",
    PUBLISH_POST_PATH: "/user/publish-post",
    FETCH_POSTS_PATH: "/user/fetch-posts",
    GET_POST_PATH: "/user/fetch-post",
    FETCH_USER_POSTS_PATH: "/user/fetch-user-posts",
    LIKE_PATH: "/user/like",
    QUERY_PATH: "/user/query",
    COMMENT_POST_PATH: "/user/comment",
    FETCH_COMMENTS_PATH: "/user/fetch-post-comments",
    DELETE_COMMENT_PATH: "/user/delete-post-comment",
    DELETE_POST_PATH: "/user/delete-post",
    LIKE_COMMENT_PATH: "/user/like-comment",
    EDIT_POST_PATH: "/user/edit-post",
    CHANGE_PASSWORD_PATH: "/user/change/password",
    CHANGE_EMAIL_PATH: "/user/change/email",
    CHANGE_USER_AT_PATH: "/user/change/user-at",
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
