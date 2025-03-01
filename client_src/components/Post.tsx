import "@styles/post.scss";
import { MouseEvent, useContext, useRef, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import userIcon from "@assets/user-circle-solid-108.png";
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { API_ROUTES, APP_ROUTES } from "../main";
import { UserAtContext } from "../contexts/UserAtContext";
import { intlFormatDistance } from "date-fns";
import { useDispatch } from "react-redux";
import { alterPostLike, setFSPost } from "../redux/store";

export const USER_AT_REGEX_PATTERN =
    /((?<=\s|^)@(\p{L}|_|[0-9]){2,}(?=\s|$))/gu;
export const URL_REGEX_PATTERN =
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/g;

export type CommentDetails = {
    profilePicture: string;
    image: string;
    userName: string;
    postId: string;
    userAt: string;
    content: string;
    unixTime: string;
    commentsQuantity: number;
    likesQuantity: number;
    imgStealerCallback: CallableFunction;
    hasThisUserLiked: boolean;
};

export type PostDetails = {
    profilePicture: string;
    image: string;
    userName: string;
    postId: string;
    userAt: string;
    content: string;
    unixTime: string;
    commentsQuantity: number;
    likesQuantity: number;
    imgStealerCallback: CallableFunction;
    hasThisUserLiked: boolean;
    edited: boolean;
};

interface PostProps {
    postDetails: PostDetails;
}

export function getSmartHours(date: Date): string {
    return intlFormatDistance(date, new Date(), { locale: i18n.locale });
}

export function makeAnchor(str: string): string {
    if (!str) return str;
    if (!str.includes("@")) return str;

    const fixedString = str.replace(
        USER_AT_REGEX_PATTERN,
        function (match: string) {
            return `<a class='post-inner-anchor' href='/${match.substring(1, match.length)}'>${match}</a>`;
        },
    );
    const urlFixedString = fixedString.replace(
        URL_REGEX_PATTERN,
        function (match: string) {
            return `<a class='post-inner-anchor' target='_blank' href='${match}'>${match}</a>`;
        },
    );

    return urlFixedString;
}

export default function Post({ postDetails }: PostProps) {
    const useDarkTheme = useContext(ThemeContext) == "dark";
    const navigateTo = useNavigate();
    const [hasSetLike, setHasSetLike] = useState(postDetails.hasThisUserLiked);
    const [likesCount, setLikesCount] = useState(postDetails.likesQuantity);
    const postMenuRef = useRef<HTMLDivElement>(null);
    const currentUserAt = useContext(UserAtContext);
    const dispatch = useDispatch();

    function navigateToProfile(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        navigateTo(`/${postDetails.userAt}`);
    }

    async function toggleLike(e: MouseEvent) {
        if (postDetails.postId === "0") return;
        e.stopPropagation();
        const likes = hasSetLike ? likesCount - 1 : likesCount + 1;
        const setLike = !hasSetLike;
        setLikesCount(hasSetLike ? likesCount - 1 : likesCount + 1);
        setHasSetLike(!hasSetLike);

        const parentPost = (e.target as HTMLElement).closest(
            ".post",
        ) as HTMLElement | null;
        parentPost!.style.backgroundColor = "transparent";

        try {
            const url = `${API_ROUTES.LIKE_PATH}`;
            const res = await fetch(url, {
                method: "PATCH",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    post_id: postDetails.postId,
                }),
            });
            if (res.status <= 299 && res.status >= 200) {
                (async function () {
                    dispatch(
                        alterPostLike({
                            likesCount: likes,
                            hasThisUserLiked: setLike,
                            postId: postDetails.postId,
                        }),
                    );
                })();
            }
        } catch (err) {
            console.error("unable to communicate with the server");
        } finally {
            parentPost!.style.backgroundColor = "";
        }
    }

    function animateMenu() {
        if (postMenuRef.current == null) return;
        const menu = postMenuRef.current!;

        if (!useDarkTheme) {
            menu.classList.add("post-menu-light-open");
        }
        menu.style.maxHeight = "500px";
        menu.style.padding = "5px";
        function mouseHandler(_e: globalThis.MouseEvent) {
            const target = _e.target as HTMLElement;
            document.removeEventListener("click", mouseHandler);
            if (
                menu.style.maxHeight !== "0px" &&
                menu.style.maxHeight !== "" &&
                !target.parentNode?.isSameNode(menu)
            ) {
                _e.preventDefault();
                _e.stopPropagation();
            }
            menu.style.maxHeight = "0px";
            menu.style.padding = "0px";
            menu.classList.remove("post-menu-light-open");
        }
        function scrollHandler(_e: Event) {
            document.removeEventListener("scroll", scrollHandler);
            menu.style.maxHeight = "0px";
            menu.style.padding = "0px";
            menu.classList.remove("post-menu-light-open");
        }
        document.addEventListener("click", mouseHandler, true);
        document.addEventListener("scroll", scrollHandler, true);
    }

    const date = new Date(Number(postDetails.unixTime));

    async function deletePost() {
        if (postDetails.postId === "0") return;
        try {
            const url = `${API_ROUTES.DELETE_POST_PATH}/${postDetails.postId}`;
            const res = await fetch(url, {
                method: "DELETE",
                credentials: "include",
                mode: "cors",
            });
            const status = res.status;
            if (status === 204) {
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <li
                className={`post ${useDarkTheme ? "post-dark" : "post-light"}`}
                onClick={(e) => {
                    if (postDetails.postId === "0") return;
                    const isSlideMenuOpen =
                        (document.querySelector(".slide-menu") as HTMLElement)
                            ?.style.left == "0px";

                    if (
                        !isSlideMenuOpen &&
                        (e.target as HTMLElement).nodeName !== "A"
                    ) {
                        (async function () {
                            const { imgStealerCallback, ...values } = {
                                ...postDetails,
                            };
                            dispatch(setFSPost(values));
                        })();
                        navigateTo(`${APP_ROUTES.POST}/${postDetails.postId}`);
                    }
                }}
            >
                <section className="post-header">
                    <section className="post-hdr-left">
                        <img
                            onClick={navigateToProfile}
                            src={postDetails.profilePicture || userIcon}
                            alt=""
                        />
                        <strong onClick={navigateToProfile}>
                            {postDetails.userName}
                        </strong>
                        <span
                            className="user-at-main"
                            onClick={navigateToProfile}
                        >
                            @{postDetails.userAt}
                        </span>
                        {postDetails.edited && (
                            <div className="post-edited">
                                [{i18n.t("edited")}]
                            </div>
                        )}
                    </section>
                    <menu
                        className={`post-menu ${useDarkTheme ? "post-menu-dark" : "post-menu-light"}`}
                        ref={postMenuRef}
                        onClick={(e) => {
                            const isSlideMenuOpen =
                                (
                                    document.querySelector(
                                        ".slide-menu",
                                    ) as HTMLElement
                                )?.style.left == "0px";

                            if (
                                !isSlideMenuOpen &&
                                (e.target as HTMLElement).nodeName !== "A"
                            ) {
                                e.stopPropagation();
                            }
                        }}
                    >
                        <button
                            onClick={() => {
                                if (postDetails.postId === "0") return;
                                navigator.clipboard.writeText(
                                    `${window.location.href}post/${postDetails.postId}`,
                                );
                            }}
                        >
                            <div className="small-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 24 24"
                                    className={
                                        useDarkTheme
                                            ? "btn-icon-dark"
                                            : "btn-icon-light"
                                    }
                                >
                                    <path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path>
                                    <path d="M6 12h6v2H6zm0 4h6v2H6z"></path>
                                </svg>
                            </div>
                            {i18n.t("copyLink")}
                        </button>
                        {postDetails.userAt === currentUserAt ? (
                            <>
                                <button
                                    onClick={() => {
                                        if (postDetails.postId === "0") return;
                                        navigateTo(
                                            `${APP_ROUTES.EDIT_POST}/${postDetails.postId}`,
                                        );
                                    }}
                                >
                                    <div className="small-icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 24 24"
                                            className={
                                                useDarkTheme
                                                    ? "btn-icon-dark"
                                                    : "btn-icon-light"
                                            }
                                        >
                                            <path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z"></path>
                                        </svg>
                                    </div>
                                    {i18n.t("editPost")}
                                </button>
                                <button onClick={deletePost}>
                                    <div className="small-icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 24 24"
                                            className={
                                                useDarkTheme
                                                    ? "btn-icon-dark"
                                                    : "btn-icon-light"
                                            }
                                        >
                                            <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
                                            <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
                                        </svg>
                                    </div>
                                    {i18n.t("deletePost")}
                                </button>
                            </>
                        ) : (
                            <></>
                        )}
                    </menu>
                    <button
                        className="post-aditional-info"
                        onClick={(e) => {
                            const isSlideMenuOpen =
                                (
                                    document.querySelector(
                                        ".slide-menu",
                                    ) as HTMLElement
                                )?.style.left == "0px";

                            if (
                                !isSlideMenuOpen &&
                                (e.target as HTMLElement).nodeName !== "A"
                            ) {
                                e.stopPropagation();
                                animateMenu();
                            }
                        }}
                    >
                        ⋮
                    </button>
                </section>
                <section className="post-content">
                    <p
                        dangerouslySetInnerHTML={{
                            __html: makeAnchor(postDetails.content),
                        }}
                        style={{
                            minHeight:
                                postDetails.content.length > 0 ? "50px" : "0px",
                        }}
                    ></p>
                    {postDetails.image ? (
                        <section
                            className="post-image"
                            onClick={(e) => {
                                const isSlideMenuOpen =
                                    (
                                        document.querySelector(
                                            ".slide-menu",
                                        ) as HTMLElement
                                    )?.style.left == "0px";

                                if (
                                    !isSlideMenuOpen &&
                                    (e.target as HTMLElement).nodeName !== "A"
                                ) {
                                    e.stopPropagation();
                                    postDetails.imgStealerCallback(
                                        postDetails.image,
                                    );
                                }
                            }}
                        >
                            <img src={postDetails.image} alt="" />
                        </section>
                    ) : (
                        <></>
                    )}
                </section>
                <section className="post-footer">
                    <span className="date-age">
                        {`${new Intl.DateTimeFormat(i18n.locale === "en" ? "pt-BR" : i18n.locale, { dateStyle: "short" }).format(date)} - ${getSmartHours(date)}`}
                    </span>
                    <section>
                        <button
                            className="post-interaction-btn"
                            onClick={() => {}}
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
                                <path d="M5 18v3.766l1.515-.909L11.277 18H16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h1zM4 8h12v8h-5.277L7 18.234V16H4V8z"></path>
                                <path d="M20 2H8c-1.103 0-2 .897-2 2h12c1.103 0 2 .897 2 2v8c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z"></path>
                            </svg>
                            <span>{postDetails.commentsQuantity}</span>
                        </button>
                        <button
                            className={`post-interaction-btn `}
                            onClick={toggleLike}
                        >
                            {hasSetLike ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 24 24"
                                    className={"btn-icon " + "btn-icon-colored"}
                                >
                                    <path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path>
                                </svg>
                            ) : (
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
                                    <path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path>
                                </svg>
                            )}
                            <span>{likesCount}</span>
                        </button>
                    </section>
                </section>
            </li>
        </>
    );
}
