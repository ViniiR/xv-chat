import "@styles/edit_post.scss";
import i18n from "../i18n";
import darkImgIcon from "@assets/image-add-regular-120(1).png";
import lightImgIcon from "@assets/image-add-regular-120.png";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { PostData } from "./Feed";
import Loading from "./Loading";
import { POST_CHAR_LIMIT } from "./PostWriter";
import x from "@assets/x-regular-120(2).png";
import FSWarning from "./FSWarning";
import { useDispatch } from "react-redux";
import { alterPostContent } from "../redux/store";
import { goBackHistory } from "./Home";

interface EditPostProps {
    setTheme: CallableFunction;
}

export default function EditPost({}: EditPostProps) {
    const useDarkTheme = useContext(ThemeContext) === "dark";
    const params = useParams<{ postId: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [postText, setPostText] = useState("");
    const [postImage, setPostImage] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const dispatch = useDispatch();
    let blockButton = false;

    useEffect(() => {
        setIsLoading(true);
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
                    setPostText(body.text);
                    setPostImage(body.image);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchPostDetails();
    }, []);

    async function editPost() {
        if (blockButton) return;
        blockButton = true;
        const url = `${process.env.API_URL_ROOT}${process.env.EDIT_POST_PATH}/${params.postId}`;
        try {
            const response = await fetch(url, {
                method: "PATCH",
                mode: "cors",
                credentials: "include",
                body: JSON.stringify({
                    text: postText,
                    image: postImage,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const status = response.status;
            if (status > 199 && status < 300) {
                (async function () {
                    dispatch(
                        alterPostContent({
                            content: postText,
                            image: postImage,
                            postId: params.postId || "INVALID_POST_ID",
                        }),
                    );
                })();
                goBackHistory();
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (isLoading) {
        return <Loading useDarkTheme={useDarkTheme} />;
    }

    return (
        <main
            className={`edit-post ${useDarkTheme ? "edit-post-dark" : "edit-post-light"}`}
        >
            {showErrorMessage && (
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
                    className="edit-post-back-btn"
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
                <div>
                    <strong className="fs-title">{i18n.t("editPost")}</strong>
                    <button onClick={editPost}>{i18n.t("edit")}</button>
                </div>
            </header>
            <main>
                <textarea
                    autoComplete="off"
                    spellCheck={false}
                    cols={5}
                    maxLength={POST_CHAR_LIMIT}
                    placeholder={i18n.t("writeSomething")}
                    name="pre-post"
                    id="pre-post"
                    value={postText}
                    onChange={(e) => {
                        if (postText.length > POST_CHAR_LIMIT) {
                            return;
                        }
                        setPostText(e.target.value);
                    }}
                ></textarea>
                <div className="misc-post-char-limit-counter">
                    <span>
                        {postText.length}/{POST_CHAR_LIMIT}
                    </span>
                </div>
                {postImage ? (
                    <div className="post-img">
                        <button
                            onClick={() => {
                                setPostImage("");
                            }}
                        >
                            <img src={x} alt="" />
                        </button>
                        <img src={postImage} />
                    </div>
                ) : (
                    <></>
                )}
            </main>
            <section className="post-alt-data">
                <button>
                    <input
                        accept=".png, .jpeg, .jpg, .webp"
                        type="file"
                        name="postImage"
                        id="postImage"
                        onChange={(e) => {
                            if (
                                e.target.files == undefined ||
                                e.target.files.length < 1
                            )
                                return;
                            const file = e.target.files![0];
                            /*10MB (MegaBytes)*/
                            if (file.size > 10_000_000) {
                                setShowErrorMessage(true);
                                return;
                            }
                            const reader = new FileReader();
                            reader.addEventListener("load", function () {
                                const img = new Image();
                                const url = reader.result?.toString() || "";
                                img.src = url;
                                setPostImage(url);
                            });
                            reader.readAsDataURL(file);
                        }}
                    />
                    <img
                        src={useDarkTheme ? darkImgIcon : lightImgIcon}
                        alt=""
                    />
                </button>
            </section>
        </main>
    );
}
