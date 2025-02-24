import "@styles/fullscreen_post.scss";
import { CommentDetails, makeAnchor } from "./Post";
import i18n from "../i18n";
import { getSmartHours, PostDetails } from "./Post";
import userIcon from "@assets/user-circle-solid-108.png";
import { useNavigate, useParams } from "react-router-dom";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { PostData } from "./Feed";
import Loading from "./Loading";
import { UserAtContext } from "../contexts/UserAtContext";
import PostWriter from "./PostWriter";
import Comment from "./Comment";
import { APP_ROUTES } from "../main";
import FSWarning from "./FSWarning";
import { useSelector } from "react-redux";
import { FullscreenPostStateSelection } from "../redux/store";
import { goBackHistory } from "./Home";

interface FSPostProps {
    setTheme: CallableFunction;
}

export default function FSPost({}: FSPostProps) {
    const navigateTo = useNavigate();
    const [postDetails, setPostDetails] = useState<PostDetails>({
        edited: false,
        hasThisUserLiked: false,
        postId: "0",
        userAt: "",
        image: "",
        content: "",
        unixTime: "0",
        userName: "",
        likesQuantity: 0,
        commentsQuantity: 0,
        profilePicture: "",
        imgStealerCallback: () => {},
    });
    const [comments, setComments] = useState<CommentDetails[]>([]);
    const useDarkTheme = useContext(ThemeContext) === "dark";
    const params = useParams<{ postId: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isImgStealerOpen, setIsImgStealerOpen] = useState(false);
    const [drawableImage, setDrawableImage] = useState("");
    const imgStealerRef = useRef<HTMLDivElement>(null);
    const [hasSetLike, setHasSetLike] = useState(postDetails.hasThisUserLiked);
    const [likesCount, setLikesCount] = useState(postDetails.likesQuantity);
    const [openPostWriter, setOpenPostWriter] = useState(false);
    const [postImage, setPostImage] = useState("");
    const [postText, setPostText] = useState("");
    const postWriterRef = useRef<HTMLDivElement>(null);
    const fsPostRef = useRef<HTMLDivElement>(null);
    const postMenuRef = useRef<HTMLDivElement>(null);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showZoomStealer, setShowZoomStealer] = useState(false);
    const [currentUserAt, setCurrentUserAt] = useState(
        useContext(UserAtContext),
    );
    const reduxPost = useSelector(
        (state: FullscreenPostStateSelection) => state.fullscreenPost.value,
    );
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [refetchComments, setRefetchComments] = useState(false);

    useEffect(() => {
        if (!imgStealerRef.current) return;
        setTimeout(() => {
            if (isImgStealerOpen) {
                imgStealerRef.current!.style.bottom = "0px";
            }
        }, 0);
    }, [isImgStealerOpen]);

    function imgStealerCallback(img: string) {
        setIsImgStealerOpen(true);
        setDrawableImage(img);
        setTimeout(() => {
            toggleImgStealerAnimation(true);
        }, 0);
    }

    useEffect(() => {
        if (reduxPost.postId !== params.postId && reduxPost.userAt !== "") {
            setIsLoading(false);
            setPostDetails({
                ...reduxPost,
                imgStealerCallback,
            });
        } else {
            setIsLoading(true);
        }
        async function fetchPostDetails() {
            const url = `${process.env.API_URL_ROOT}${process.env.GET_POST_PATH}/${params.postId}`;
            try {
                const response = await fetch(url, {
                    method: "GET",
                    mode: "cors",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                });
                const status = response.status;
                const res: { Ok: PostData } = await response.json();
                const body = res.Ok;
                if (status > 199 && status < 300) {
                    setPostDetails({
                        edited: body.edited,
                        hasThisUserLiked: body.hasThisUserLiked,
                        unixTime: body.unixTime,
                        postId: body.postId,
                        profilePicture: body.icon,
                        image: body.image,
                        likesQuantity: body.likesCount,
                        commentsQuantity: body.commentsCount,
                        userAt: body.userAt,
                        userName: body.userName,
                        content: body.text,
                        imgStealerCallback,
                    });
                    setHasSetLike(body.hasThisUserLiked);
                    setLikesCount(body.likesCount);
                    setIsLoading(false);
                } else {
                    //
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchPostDetails();
    }, []);

    useEffect(() => {
        async function fetchComments() {
            setIsLoadingComments(true);
            try {
                const url = `${process.env.API_URL_ROOT}${process.env.FETCH_COMMENTS_PATH}/${params.postId}`;
                const res = await fetch(url, {
                    method: "GET",
                    mode: "cors",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const status = res.status;
                const body: { Ok: PostData[] } = await res.json();
                let comments: CommentDetails[] = [];
                if (status === 200) {
                    body.Ok.forEach((c) => {
                        comments.push({
                            hasThisUserLiked: c.hasThisUserLiked,
                            unixTime: c.unixTime,
                            postId: c.postId,
                            profilePicture: c.icon,
                            image: c.image,
                            likesQuantity: c.likesCount,
                            commentsQuantity: c.commentsCount,
                            userAt: c.userAt,
                            userName: c.userName,
                            content: c.text,
                            imgStealerCallback,
                        });
                    });
                    setComments(comments);
                    setIsLoadingComments(false);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchComments();
    }, [refetchComments]);

    useEffect(() => {
        async function fetchUserAt() {
            try {
                const url = `${process.env.API_URL_ROOT}${process.env.DATA_USER_PATH}`;
                const res = await fetch(url, {
                    method: "GET",
                    mode: "cors",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const status = res.status;
                const bodyString: string = await res.json();
                const body: { userAt: string } = JSON.parse(bodyString);
                if (status === 200) {
                    setCurrentUserAt(body.userAt);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchUserAt();
    }, []);

    useEffect(() => {
        if (!fsPostRef.current) return;
        if (isImgStealerOpen) {
            fsPostRef.current!.style.overflowY = "hidden";
        } else {
            fsPostRef.current!.style.overflowY = "scroll";
        }
    }, [isImgStealerOpen]);

    const date = new Date(Number(postDetails.unixTime));

    function toggleImgStealerAnimation(open: boolean) {
        if (!imgStealerRef.current) return;
        if (open) {
            imgStealerRef.current!.style.bottom = "0px";
        } else {
            imgStealerRef.current!.style.bottom = "-100%";
        }
    }

    async function toggleLike(e: MouseEvent) {
        e.stopPropagation();
        setLikesCount(hasSetLike ? likesCount - 1 : likesCount + 1);
        setHasSetLike(!hasSetLike);

        const parentPost = (e.target as HTMLElement).closest(
            ".post",
        ) as HTMLElement | null;
        if (parentPost != null) {
            parentPost!.style.backgroundColor = "transparent";
        }

        try {
            const url = `${process.env.API_URL_ROOT}${process.env.LIKE_PATH}`;
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
                //
            }
        } catch (err) {
            console.error("unable to communicate with the server");
        } finally {
            if (parentPost != null) {
                parentPost!.style.backgroundColor = "";
            }
        }
    }

    function navigateToProfile() {
        navigateTo(`/${postDetails.userAt}`);
    }

    async function comment() {
        animatePostWriter(false);
        try {
            const url = `${process.env.API_URL_ROOT}${process.env.COMMENT_POST_PATH}/${postDetails.postId}`;
            const res = await fetch(url, {
                method: "PATCH",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: postText || null,
                    image: postImage || null,
                }),
            });
            const status = res.status;
            if (status > 199 && status < 300) {
                setOpenPostWriter(false);
                setPostImage("");
                setPostText("");
                setRefetchComments(!refetchComments);
                setPostDetails({
                    ...postDetails,
                    commentsQuantity: postDetails.commentsQuantity + 1,
                });
            }
        } catch (err) {
            console.error("could not communicate with the server");
        }
    }

    function animatePostWriter(onOpen: boolean) {
        if (!postWriterRef.current) return;
        if (!fsPostRef.current) return;
        if (onOpen) {
            fsPostRef.current!.style.overflowY = "hidden";
            //postWriterRef.current!.style.top = "0px";

            // perfection in code
            postWriterRef.current!.style.top = `${fsPostRef.current.scrollTop}px`;
            //fsPostRef.current.scrollTo({ top: 0 });
        } else {
            postWriterRef.current!.style.top = "100%";
            fsPostRef.current!.style.overflowY = "scroll";
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

    async function deletePost() {
        try {
            const url = `${process.env.API_URL_ROOT}${process.env.DELETE_POST_PATH}/${postDetails.postId}`;
            const res = await fetch(url, {
                method: "DELETE",
                credentials: "include",
                mode: "cors",
            });
            const status = res.status;
            if (status === 204) {
                navigateTo("/");
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main
            ref={fsPostRef}
            className={`fullscreen-post ${useDarkTheme ? "fs-post-dark" : "fs-post-light"}`}
        >
            {openPostWriter ? (
                <PostWriter
                    postImage={postImage}
                    postText={postText}
                    setPostImage={setPostImage}
                    setPostText={setPostText}
                    postWriterRef={postWriterRef}
                    placeholder={i18n.t("postComment")}
                    publish={comment}
                    setOpenPostWriter={setOpenPostWriter}
                    animatePostWriter={animatePostWriter}
                />
            ) : (
                <></>
            )}
            {showErrorMessage && openPostWriter && (
                <FSWarning
                    text={i18n.t("10MBLimit")}
                    handleClose={() => {
                        setShowErrorMessage(false);
                    }}
                    alternateMessage={true}
                />
            )}

            <header>
                <button
                    className="fs-back-btn"
                    onClick={() => {
                        goBackHistory();
                    }}
                >
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
                <strong className="fs-title">{i18n.t("post")}</strong>
            </header>
            {isLoading ? (
                <Loading useDarkTheme={useDarkTheme} />
            ) : isImgStealerOpen ? (
                <>
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
                    <section
                        className={`image-stealer-fullscreen ${useDarkTheme ? "image-stealer-fullscreen-dark" : "image-stealer-fullscreen-light"}`}
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
                            <a
                                download
                                href={drawableImage}
                                className="steal-btn"
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
                                    <path d="M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z"></path>
                                </svg>
                            </a>
                        </header>
                        <section>
                            <img
                                className="image-stealer-image"
                                src={drawableImage}
                                draggable={false}
                                onClick={() => {
                                    setShowZoomStealer(true);
                                }}
                                alt=""
                            />
                        </section>
                    </section>
                </>
            ) : (
                <main>
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
                                    navigator.clipboard.writeText(
                                        `${window.location.href}`,
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
                    </section>
                    <section className="post-content">
                        {postDetails.content.length > 0 && (
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: makeAnchor(postDetails.content),
                                }}
                            ></p>
                        )}
                        {postDetails.image ? (
                            <section
                                className="post-image"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    postDetails.imgStealerCallback(
                                        postDetails.image,
                                    );
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
                                onClick={() => {
                                    setOpenPostWriter(true);
                                    setTimeout(() => {
                                        animatePostWriter(true);
                                    }, 0);
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
                                        className={
                                            "btn-icon " + "btn-icon-colored"
                                        }
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
                    <strong className="comments-list-title">
                        {i18n.t("comments")}
                    </strong>
                    {isLoadingComments || comments[0] ? (
                        <></>
                    ) : (
                        <div className="no-comments">
                            {i18n.t("noComments")}
                        </div>
                    )}
                    <ul className="comments-list">
                        {isLoadingComments ? (
                            <Loading useDarkTheme={useDarkTheme} />
                        ) : (
                            comments[0] &&
                            comments.map((c, i) => (
                                <Comment
                                    parentPostId={parseInt(postDetails.postId)}
                                    key={i}
                                    postDetails={c}
                                    userAt={currentUserAt}
                                />
                            ))
                        )}
                    </ul>
                </main>
            )}
        </main>
    );
}
