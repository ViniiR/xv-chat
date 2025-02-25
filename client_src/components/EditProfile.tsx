import "@styles/edit_profile.scss";
import {
    ChangeEvent,
    SyntheticEvent,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import i18n from "../i18n";
import userIcon from "@assets/user-circle-solid-108.png";
import editIcon from "@assets/edit-alt-regular-96.png";
import ReactCrop, { centerCrop, Crop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/src/ReactCrop.scss";
import x from "@assets/x-regular-120(2).png";
import { useSelector } from "react-redux";
import { UserDataState, UserDataStateSelector } from "../redux/store";
import { goBackHistory } from "./Home";

interface EditProfileProps {
    setTheme: CallableFunction;
}

export default function EditProfile({}: EditProfileProps) {
    const minWidth = 100;
    const useDarkTheme = useContext(ThemeContext) === "dark";
    const imgInputRef = useRef<HTMLInputElement>(null);
    const [submitableData, setSubmitableData] = useState({
        userName: "",
        bio: "",
        icon: "",
    });
    const [error, setError] = useState("");
    const [croppableImg, setCroppableImg] = useState("");
    const [crop, setCrop] = useState<Crop>();
    const [showCropper, setShowCropper] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const croppingRef = useRef<HTMLImageElement>(null);
    const [updateDataTrigger, setUpdateDataTrigger] = useState(false);
    const userProfileData = useSelector<UserDataStateSelector, UserDataState>(
        (state) => state.userData.value,
    );
    const [serverDiagnostics, setServerDiagnostics] = useState("");

    const USERNAME_LIMIT_LENGTH = 20;
    const BIO_LIMIT_LENGTH = 150;

    useEffect(() => {
        if (userProfileData.userAt !== "") {
            setSubmitableData({
                bio: userProfileData.bio,
                icon: userProfileData.icon,
                userName: userProfileData.userName,
            });
        }
        async function fetchUserData() {
            const url = `${process.env.API_URL_ROOT}${process.env.DATA_USER_PATH}`;
            try {
                const res = await fetch(url, {
                    mode: "cors",
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                });
                if (res.status > 199 && res.status < 300) {
                    const response = await res.json();
                    const body: {
                        userName: string;
                        userAt: string;
                        icon: string;
                        followingCount: number;
                        followersCount: number;
                        bio: string;
                    } = JSON.parse(response);
                    setSubmitableData({
                        bio: body.bio == null ? "" : body.bio,
                        icon: body.icon,
                        userName: body.userName,
                    });
                    setUpdateDataTrigger(!updateDataTrigger);
                }
            } catch (err) {
                console.error("unable to connect to server");
            }
        }
        fetchUserData();
    }, []);

    useEffect(() => {
        const canvas = previewCanvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const img = new Image();
        img.src = submitableData.icon ? submitableData.icon : userIcon;
        img.onload = function () {
            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                0,
                0,
                canvas.width,
                canvas.height,
            );
        };
    }, [updateDataTrigger]);

    async function exitProfile() {
        goBackHistory();
    }

    function imgInputHandler(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files![0];
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            const img = new Image();
            const url = reader.result?.toString() || "";
            img.src = url;

            //shhhhhhhhhut the fuck up
            img.addEventListener("load", function (e: any) {
                const { naturalWidth, naturalHeight } = e.currentTarget;
                if (naturalWidth < minWidth || naturalHeight < minWidth) {
                    setError(i18n.t("min150px"));
                    setCroppableImg("");
                    return;
                }
            });

            if (!error) {
                setCroppableImg(url);
                setShowCropper(true);
            }
        });

        reader.readAsDataURL(file);
    }

    function handleLoad(e: SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const crop = makeAspectCrop(
            {
                unit: "%",
                width: (minWidth / width) * 100,
            },
            1,
            width,
            height,
        );
        setCrop(centerCrop(crop, width, height));
    }

    function handleCropping() {
        if (!canvasRef || !croppingRef || !crop || !previewCanvasRef) return;

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const img = croppingRef.current!;

        ctx.drawImage(
            img,
            img.naturalWidth * (crop.x / 100),
            img.naturalHeight * (crop.y / 100),
            img.naturalWidth * (crop.width / 100),
            img.naturalHeight * (crop.height / 100),
            0,
            0,
            500,
            500,
        );
        const previewCtx = previewCanvasRef.current!.getContext("2d");
        previewCtx!.drawImage(ctx.canvas, 0, 0, 70, 70);

        setSubmitableData({
            userName: submitableData.userName,
            bio: submitableData.bio,
            icon: ctx.canvas.toDataURL(),
        });
    }

    async function submitData() {
        try {
            const url = `${process.env.API_URL_ROOT}${process.env.EDIT_PROFILE_PATH}`;
            const res = await fetch(url, {
                mode: "cors",
                method: "PATCH",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: submitableData.userName,
                    bio: submitableData.bio,
                    icon: submitableData.icon,
                }),
            });
            const status = res.status;
            if (status > 199 && status < 300) {
                setServerDiagnostics(i18n.t("profileDataOk"));
            } else {
                console.log(await res.text());
            }
        } catch (err) {
            console.error("could not communicate with the server");
        }
    }

    return (
        <main
            className={`edit-profile ${useDarkTheme ? "edit-dark" : "edit-light"}`}
        >
            {showCropper ? (
                <div className="cropper-wrapper">
                    <div className="cropper">
                        <button
                            className="exit-btn"
                            onClick={() => {
                                if (imgInputRef) {
                                    imgInputRef.current!.value = "";
                                }
                                setError("");
                                setCroppableImg("");
                                setShowCropper(false);
                            }}
                        >
                            <img src={x} alt="" />
                        </button>
                        {error ? (
                            <div className="err">{error}</div>
                        ) : (
                            <>
                                <ReactCrop
                                    className="croppable"
                                    aspect={1}
                                    crop={crop}
                                    circularCrop={true}
                                    keepSelection
                                    minWidth={minWidth}
                                    onChange={(_px, per) => {
                                        setCrop(per);
                                    }}
                                >
                                    {croppableImg && (
                                        <img
                                            ref={croppingRef}
                                            onLoad={handleLoad}
                                            src={croppableImg}
                                            alt=""
                                        />
                                    )}
                                </ReactCrop>
                                <button
                                    onClick={() => {
                                        handleCropping();
                                        setTimeout(() => {
                                            setShowCropper(false);
                                        }, 0);
                                    }}
                                    className="crop-btn"
                                >
                                    {i18n.t("crop")}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
            <header className="profile-header">
                <section>
                    <button className="back-btn" onClick={exitProfile}>
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
                    <strong>{i18n.t("editProfile")}</strong>
                </section>
                <button onClick={submitData} className="save-btn">
                    {i18n.t("save")}
                </button>
            </header>
            <main className="edit-profile-body">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <section className="user-img">
                        <div className="edit-btn">
                            <input
                                spellCheck={false}
                                autoComplete="off"
                                accept=".png, .jpeg, .jpg, .webp"
                                onChange={imgInputHandler}
                                type="file"
                                ref={imgInputRef}
                            />
                            <img src={editIcon} alt="" />
                        </div>
                        <canvas
                            style={{ borderRadius: "50px" }}
                            ref={previewCanvasRef}
                            width={70}
                            height={70}
                        ></canvas>
                    </section>
                    <section className="field">
                        <label htmlFor="userName">{i18n.t("userName")}:</label>
                        <input
                            spellCheck={false}
                            autoComplete="off"
                            value={submitableData.userName}
                            onChange={(e) => {
                                if (
                                    e.target.value.length >
                                    USERNAME_LIMIT_LENGTH
                                )
                                    return;
                                setSubmitableData({
                                    userName: e.target.value.trimStart(),
                                    bio: submitableData.bio,
                                    icon: submitableData.icon,
                                });
                            }}
                            type="text"
                            name="userNameField"
                            id="userName"
                        />
                        <div className="counter">
                            {submitableData.userName.length}/
                            {USERNAME_LIMIT_LENGTH}
                        </div>
                    </section>
                    <section className="field">
                        <label htmlFor="bio">{i18n.t("bio")}:</label>
                        <textarea
                            spellCheck={false}
                            autoComplete="off"
                            name="bioField"
                            id="bio"
                            wrap="hard"
                            maxLength={150}
                            onChange={(e) => {
                                if (e.target.value.length > BIO_LIMIT_LENGTH)
                                    return;
                                setSubmitableData({
                                    userName:
                                        submitableData.userName.trimStart(),
                                    bio: e.target.value,
                                    icon: submitableData.icon,
                                });
                            }}
                            value={submitableData.bio}
                            cols={4}
                        ></textarea>
                        <div className="counter">
                            {submitableData.bio.length}/{BIO_LIMIT_LENGTH}
                        </div>
                    </section>
                    {serverDiagnostics ? (
                        <div className="server-dig">{serverDiagnostics}</div>
                    ) : (
                        <></>
                    )}
                </form>
            </main>
            <canvas
                style={{ display: "none" }}
                ref={canvasRef}
                width={500}
                height={500}
            ></canvas>
        </main>
    );
}
