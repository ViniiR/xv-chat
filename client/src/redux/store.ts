import { createSlice, configureStore } from "@reduxjs/toolkit";
import { PostData } from "../components/Feed";
import { PostDetails } from "../components/Post";

export type UserDataState = {
    icon: string;
    userAt: string;
    userName: string;
    followingCount: number;
    followersCount: number;
    bio: string;
};

export type ReduxAction<T> = {
    type: string;
    payload: T;
};

export type UserDataStateSelector = {
    userData: {
        value: UserDataState;
    };
};

const userDataSlice = createSlice({
    name: "userData",
    initialState: {
        value: {
            icon: "",
            userAt: "",
            userName: "",
            followingCount: 0,
            followersCount: 0,
            bio: "",
        },
    },
    reducers: {
        updateUserData: function (state, action: ReduxAction<UserDataState>) {
            state.value = action.payload;
        },
        updateUserIcon: function (state, action: ReduxAction<string>) {
            state.value.icon = action.payload;
        },
        updateUserAt: function (state, action: ReduxAction<string>) {
            state.value.userAt = action.payload;
        },
        updateUserName: function (state, action: ReduxAction<string>) {
            state.value.userName = action.payload;
        },
        updateUserFollowingCount: function (
            state,
            action: ReduxAction<number>,
        ) {
            state.value.followingCount = action.payload;
        },
        updateUserFollowersCount: function (
            state,
            action: ReduxAction<number>,
        ) {
            state.value.followersCount = action.payload;
        },
    },
});

export const {
    updateUserData,
    updateUserIcon,
    updateUserAt,
    updateUserName,
    updateUserFollowersCount,
    updateUserFollowingCount,
} = userDataSlice.actions;

export type darkGlobalThemeStateSelector = {
    darkGlobalTheme: {
        value: boolean;
    };
};

const darkGlobalThemeSlice = createSlice({
    name: "darkGlobalTheme",
    initialState: {
        value: localStorage.getItem("theme") === "dark",
    },
    reducers: {
        setUseDark: function (
            state,
            action: {
                payload: boolean;
                type: string;
            },
        ) {
            state.value = action.payload;
        },
    },
});

export const { setUseDark } = darkGlobalThemeSlice.actions;

export type FeedStateSelector = {
    feed: {
        value: Array<PostData>;
    };
};

const feedSlice = createSlice({
    name: "feed",
    initialState: {
        value: [
            {
                icon: "",
                image: "",
                unixTime: "0",
                userAt: "",
                userName: "",
                text: "",
                ownerId: "",
                likesCount: 0,
                commentsCount: 0,
                postId: "",
                hasThisUserLiked: false,
                edited: false,
            },
        ],
    },
    reducers: {
        shiftPost: function (state, action: ReduxAction<PostData>) {
            state.value = [action.payload, ...state.value];
        },
        setPosts: function (state, action: ReduxAction<PostData[]>) {
            state.value = action.payload;
        },
        alterPostLike: function (
            state,
            action: ReduxAction<{
                likesCount: number;
                hasThisUserLiked: boolean;
                postId: string;
            }>,
        ) {
            state.value.forEach((p) => {
                if (p.postId === action.payload.postId) {
                    p.hasThisUserLiked = action.payload.hasThisUserLiked;
                    p.likesCount = action.payload.likesCount;
                }
            });
        },
        alterPostContent: function (
            state,
            action: ReduxAction<{
                content: string;
                image: string;
                postId: string;
            }>,
        ) {
            state.value.forEach((p) => {
                if (p.postId === action.payload.postId) {
                    p.text = action.payload.content;
                    p.image = action.payload.image;
                }
            });
        },
    },
});

export const { shiftPost, setPosts, alterPostLike, alterPostContent } =
    feedSlice.actions;

export type FullscreenPostStateSelection = {
    fullscreenPost: {
        value: Omit<PostDetails, "imgStealerCallback">;
    };
};

const fullscreenPostSlice = createSlice({
    name: "fullscreenPost",
    initialState: {
        value: {
            profilePicture: "",
            image: "",
            userName: "",
            postId: "",
            userAt: "",
            content: "",
            unixTime: "",
            likesQuantity: 0,
            commentsQuantity: 0,
            hasThisUserLiked: false,
            edited: false,
        },
    },
    reducers: {
        setFSPost: function (
            state,
            action: ReduxAction<Omit<PostDetails, "imgStealerCallback">>,
        ) {
            if (state.value.postId !== action.payload.postId) {
                state.value = action.payload;
            }
        },
    },
});

export const { setFSPost } = fullscreenPostSlice.actions;

export default configureStore({
    reducer: {
        userData: userDataSlice.reducer,
        darkGlobalTheme: darkGlobalThemeSlice.reducer,
        feed: feedSlice.reducer,
        fullscreenPost: fullscreenPostSlice.reducer,
    },
});
