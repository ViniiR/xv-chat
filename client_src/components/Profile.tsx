import "@styles/profile.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import userIcon from "@assets/user-circle-solid-108.png";
import UserIcon from "./UserIcon";
import { useNavigate, useParams } from "react-router-dom";
import Feed from "./Feed";
import Loading from "./Loading";
import i18n from "../i18n";
import FollowPage from "@components/FullscreenMenu";
import FollowerUser, { EmptyFollowUser } from "@components/FollowerUser";
import FSWarning from "./FSWarning";
import { useDispatch, useSelector } from "react-redux";
import {
    updateUserData,
    UserDataState,
    UserDataStateSelector,
} from "../redux/store";
import { goBackHistory } from "./Home";
import { API_ROUTES, APP_ROUTES } from "../main";

interface ProfileProps {
    // not actually used
    setTheme?: CallableFunction;
    setUserAtContext: CallableFunction;
}

enum SelectedField {
    Posts,
    Likes,
}

export default function Profile(props: ProfileProps) {
    const useDarkTheme = useContext(ThemeContext) === "dark";
    const navigateTo = useNavigate();
    const [currentUserData, setCurrentUserData] = useState({
        icon: "",
        userAt: "",
        userName: "",
        bio: "",
        followingCount: 0,
        followersCount: 0,
        isFollowing: false,
    });
    const [updateDataTrigger, setUpdateDataTrigger] = useState(false);
    const params = useParams<{ user: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isFollowingPage, setIsFollowingPage] = useState(false);
    const followPageRef = useRef<HTMLDivElement>(null);
    const [_isFollowPageClosed, setIsFollowPageClosed] = useState(true);
    const [followPageTitle, setFollowPageTitle] = useState("");
    const [followListVector, setFollowListVector] = useState([
        {
            userAt: "",
            userName: "",
            icon: "",
        },
    ]);
    const [isLoadingFollows, setIsLoadingFollows] = useState(true);
    const [showWarning, setShowWarning] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const [isImgStealerOpen, setIsImgStealerOpen] = useState(false);
    const imgStealerRef = useRef<HTMLDivElement>(null);
    const [drawableImage, setDrawableImage] = useState("");
    const [showZoomStealer, setShowZoomStealer] = useState(false);
    const userProfileData = useSelector<UserDataStateSelector, UserDataState>(
        (state) => state.userData.value,
    );
    const dispatch = useDispatch();
    const [selectedFeed, setSelectedField] = useState(SelectedField.Posts);
    const postsBtnRef = useRef<HTMLButtonElement>(null);
    const likesBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setSelectedField(SelectedField.Posts);
    }, [params]);

    useEffect(() => {
        if (!postsBtnRef.current || !likesBtnRef.current) return;
        switch (selectedFeed) {
            case SelectedField.Posts:
                postsBtnRef.current!.classList.add("selected");
                likesBtnRef.current!.classList.remove("selected");
                break;
            case SelectedField.Likes:
                likesBtnRef.current!.classList.add("selected");
                postsBtnRef.current!.classList.remove("selected");
                break;
            default:
                break;
        }
    }, [selectedFeed]);

    useEffect(() => {
        if (userProfileData.userAt === params.user) {
            setCurrentUserData({
                ...userProfileData,
                isFollowing: false,
            });
            setIsOwnProfile(true);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        props.setUserAtContext(
            isOwnProfile ? currentUserData.userAt : "INVALID_USERÑAME",
        );

        setDrawableImage(currentUserData.icon);
    }, [currentUserData, isOwnProfile]);

    let lockFollowButton = false;

    async function followUnfollow() {
        if (lockFollowButton) return;
        lockFollowButton = true;
        try {
            const url = `${API_ROUTES.FOLLOW_USER_PATH}`;
            const res = await fetch(url, {
                mode: "cors",
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_at: currentUserData.userAt,
                    follow: !currentUserData.isFollowing,
                }),
            });
            const status = res.status;
            if (status > 199 && status < 300) {
                //setUpdateDataTrigger(!updateDataTrigger);
                setCurrentUserData({
                    ...currentUserData,
                    isFollowing: !currentUserData.isFollowing,
                    followersCount: currentUserData.isFollowing
                        ? currentUserData.followersCount - 1
                        : currentUserData.followersCount + 1,
                });
                lockFollowButton = false;
            } else if (status > 399 && status < 500) {
                setShowWarning(true);
            }
        } catch (err) {
            console.error("could not communicate with the server");
        }
    }

    async function fetchFollowsData(following: boolean) {
        setIsLoadingFollows(true);
        if (following) {
            try {
                const url = `${API_ROUTES.FOLLOWING_DATA_PATH}/${params.user}`;
                const res = await fetch(url, {
                    mode: "cors",
                    method: "GET",
                    //credentials: "include",
                });
                const body = await res.json();
                const status = res.status;
                if (status > 199 && status < 300) {
                    const users: Array<{
                        userAt: string;
                        userName: string;
                        icon: string;
                    }> = body.Ok;
                    setFollowListVector(users);
                    setIsLoadingFollows(false);
                } else {
                    // set failed to fetch component idk
                }
            } catch (err) {
                console.error("failed to communicate with the server");
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const url = `${API_ROUTES.FOLLOWERS_DATA_PATH}/${params.user}`;
                const res = await fetch(url, {
                    mode: "cors",
                    method: "GET",
                    //credentials: "include",
                });
                const body = await res.json();
                const status = res.status;
                if (status > 199 && status < 300) {
                    const users: Array<{
                        userAt: string;
                        userName: string;
                        icon: string;
                    }> = body.Ok;
                    setFollowListVector(users);
                    setIsLoadingFollows(false);
                } else {
                    // set failed to fetch component idk
                }
            } catch (err) {
                console.error("failed to communicate with the server");
            } finally {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        if (isFollowingPage) {
            setFollowPageTitle(i18n.t("followingCount"));
        } else {
            setFollowPageTitle(i18n.t("followCount"));
        }
    }, [isLoadingFollows]);

    async function openFollowMenu(following: boolean) {
        if (followPageRef == null) return;
        fetchFollowsData(following);
        followPageRef.current!.style.right = "0px";

        if (ref?.current != null) {
            ref!.current.classList.add("disable-profile-fs-scroll");
        }
    }

    useEffect(() => {
        async function fetchUserData() {
            try {
                const url = `${API_ROUTES.GET_PROFILE_DATA_PATH}`;
                if (params.user === userProfileData.userAt) {
                    setIsLoading(false);
                } else {
                    setIsOwnProfile(false);
                    setIsLoading(true);
                }
                const res = await fetch(url + `/${params.user}`, {
                    mode: "cors",
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
                const status = res.status;
                const body: {
                    userName: string;
                    userAt: string;
                    icon: string;
                    followingCount: number;
                    followersCount: number;
                    isFollowing: boolean;
                    isHimself: boolean;
                    bio: string;
                } = (await res.json()).Ok;
                if (status > 199 && status < 300) {
                    setCurrentUserData({
                        icon: body.icon,
                        userAt: body.userAt,
                        userName: body.userName,
                        followersCount: body.followersCount,
                        followingCount: body.followingCount,
                        isFollowing: body.isFollowing,
                        bio: body.bio,
                    });
                    setIsOwnProfile(body.isHimself);
                    if (body.isHimself) {
                        dispatch(
                            updateUserData({
                                icon: body.icon,
                                userAt: body.userAt,
                                userName: body.userName,
                                followersCount: body.followersCount,
                                followingCount: body.followingCount,
                                bio: body.bio,
                            }),
                        );
                    }
                } else {
                    navigateTo(APP_ROUTES.NOT_FOUND);
                }
            } catch (err) {
                console.error("unable to connect to server");
                navigateTo(APP_ROUTES.NOT_FOUND);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUserData();
    }, [updateDataTrigger, params]);

    useEffect(() => {
        setTimeout(() => {
            if (isImgStealerOpen) {
                const profile = document.querySelector(
                    ".profile-fs",
                ) as HTMLElement | null;
                if (!imgStealerRef.current) return;
                imgStealerRef.current!.style.bottom = `-${profile?.scrollTop || 0}px`;
                //imgStealerRef.current!.style.bottom = "0px";
                toggleImgStealerAnimation(true);
            } else {
                toggleImgStealerAnimation(false);
            }
        }, 0);
    }, [isImgStealerOpen]);

    function toggleImgStealerAnimation(open: boolean) {
        // shittiest code i have ever written
        // and it smh became even even worse³(copy pasted it so thats why 3 now)
        if (open) {
            if (!imgStealerRef.current) return;
            imgStealerRef.current!.style.bottom = "0px";
            if (ref?.current != null) {
                ref!.current.classList.add("disable-profile-fs-scroll");
            }
        } else {
            if (!imgStealerRef.current) return;
            imgStealerRef.current!.style.bottom = "-100%";
            setTimeout(() => {
                if (ref?.current != null) {
                    ref!.current.classList.remove("disable-profile-fs-scroll");
                }
            }, 100);
        }
    }

    if (isLoading) {
        return <Loading useDarkTheme={true} />;
    }

    return (
        <main
            ref={ref}
            className={`profile-fs ${useDarkTheme ? "profile-dark" : "profile-light"}`}
        >
            {showWarning ? (
                <FSWarning
                    handleClose={() => {
                        setShowWarning(false);
                    }}
                    text={i18n.t("mustSignIn")}
                />
            ) : (
                <></>
            )}
            <FollowPage
                title={followPageTitle}
                reference={followPageRef}
                zIndex={60}
                closedStateSetter={(set: boolean) => {
                    setIsFollowPageClosed(set);
                    if (set && ref?.current != null) {
                        ref!.current.classList.remove(
                            "disable-profile-fs-scroll",
                        );
                    }
                }}
            >
                {isLoadingFollows ? (
                    <Loading useDarkTheme={useDarkTheme} />
                ) : followListVector.length > 0 ? (
                    followListVector.map((e, i) => (
                        <FollowerUser
                            key={i}
                            user={e}
                            beforeOnClick={() => {}}
                        />
                    ))
                ) : (
                    <EmptyFollowUser
                        text={
                            isFollowingPage
                                ? i18n.t("heFollowsNobody")
                                : i18n.t("heIsFollowedByNobody")
                        }
                    />
                )}
            </FollowPage>
            {showZoomStealer ? (
                <div
                    className="img-stealer-zoom"
                    onClick={() => {
                        setShowZoomStealer(false);
                    }}
                >
                    <img draggable={false} src={drawableImage} alt="" />
                </div>
            ) : (
                <></>
            )}
            {isImgStealerOpen ? (
                <section
                    className="image-stealer-fullscreen"
                    ref={imgStealerRef}
                >
                    <header>
                        <button
                            className="go-back-stealer-btn"
                            onClick={() => {
                                toggleImgStealerAnimation(false);
                                setShowZoomStealer(false);
                                setTimeout(() => {
                                    setIsImgStealerOpen(false);
                                }, 100);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 24 24"
                                className={
                                    "btn-icon " +
                                    (useDarkTheme
                                        ? "btn-icon-dark"
                                        : "btn-icon-light")
                                }
                            >
                                <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path>
                            </svg>
                        </button>
                        <a download href={drawableImage} className="steal-btn">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 24 24"
                                className={
                                    "btn-icon " +
                                    (useDarkTheme
                                        ? "btn-icon-dark"
                                        : "btn-icon-light")
                                }
                            >
                                <path d="M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z"></path>
                            </svg>
                        </a>
                    </header>
                    <section>
                        {/*<div
                                    className="follow-mouse-zoom"
                                    //style={{ background: `url(${drawableImage})` }}
                                    ref={followMouseDivZoomRef}
                                >
                                        <canvas
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                        ref={zoomCanvasRef}
                                    ></canvas>
                                    </div>
                                            */}
                        <img
                            className="image-stealer-image"
                            onClick={() => {
                                setShowZoomStealer(true);
                            }}
                            draggable={false}
                            src={drawableImage}
                            alt=""
                        />
                    </section>
                </section>
            ) : (
                <></>
            )}
            <header className="profile-header">
                <button className="back-btn" onClick={goBackHistory}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        className={
                            "btn-icon " +
                            (useDarkTheme ? "btn-icon-dark" : "btn-icon-light")
                        }
                    >
                        <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path>
                    </svg>
                </button>
            </header>
            <main className="profile-body">
                <UserIcon
                    onclick={() => {
                        setIsImgStealerOpen(true);
                    }}
                    className="user-icon"
                    userIconImg={
                        currentUserData.icon === ""
                            ? userIcon
                            : currentUserData.icon
                    }
                />
                <section className="names-sect">
                    <strong className="user-name">
                        {currentUserData.userName}
                    </strong>
                    <span className="user-at">@{currentUserData.userAt}</span>
                </section>
                <button
                    onClick={() => {
                        if (isOwnProfile) {
                            navigateTo(`/edit/profile`);
                        } else {
                            followUnfollow();
                        }
                    }}
                    className={`follow-btn ${currentUserData.isFollowing || isOwnProfile ? "following" : "not-following"}`}
                >
                    {isOwnProfile
                        ? i18n.t("edit")
                        : currentUserData.isFollowing
                          ? i18n.t("following")
                          : i18n.t("follow")}
                </button>
                <textarea
                    autoComplete="off"
                    spellCheck={false}
                    value={currentUserData.bio}
                    readOnly
                    className="bio"
                    name="bio"
                    id="bioProfile"
                ></textarea>
                <span
                    onClick={() => {
                        setIsFollowingPage(true);
                        openFollowMenu(true);
                    }}
                    className="following-count"
                >
                    <span>{currentUserData.followingCount}</span>
                    {i18n.t("followingCount")}
                </span>
                <span
                    onClick={() => {
                        setIsFollowingPage(false);
                        openFollowMenu(false);
                    }}
                    className="followers-count"
                >
                    <span>{currentUserData.followersCount}</span>
                    {i18n.t("followCount")}
                </span>
            </main>
            <section className="profile-feed-state">
                <button
                    className="selected"
                    onClick={() => {
                        setSelectedField(SelectedField.Posts);
                    }}
                    ref={postsBtnRef}
                >
                    {i18n.t("posts")}
                </button>
                <button
                    ref={likesBtnRef}
                    onClick={() => {
                        setSelectedField(SelectedField.Likes);
                    }}
                >
                    {i18n.t("likes")}
                </button>
            </section>
            {selectedFeed === SelectedField.Posts ? (
                <Feed
                    key={"posts-feed-key"}
                    profilepageRef={ref}
                    mainPage={false}
                    profileLikes={false}
                    className={`feed-merge-scroll posts-feed`}
                ></Feed>
            ) : (
                <Feed
                    key={"likes-feed-key"}
                    profilepageRef={ref}
                    mainPage={false}
                    profileLikes={true}
                    className={`feed-merge-scroll likes-feed`}
                ></Feed>
            )}
        </main>
    );
}
