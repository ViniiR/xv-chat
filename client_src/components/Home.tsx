import "@styles/home.scss";
import Header from "@components/Header";
import Footer from "@components/Footer";
import SlideMenu, { hideSlideMenu, menuCloserHandler } from "./SlideMenu";
import userIcon from "@assets/user-circle-solid-108.png";
import UserIcon from "./UserIcon";
import brasilFlag from "@assets/brasil_flag.svg";
import englishFlag from "@assets/england_flag.svg";
import russiaFlag from "@assets/russia_flag.svg";
import mexicoFlag from "@assets/mexico_flag.svg";
import chinaFlag from "@assets/china_flag.svg";
import franceFlag from "@assets/france_flag.svg";
import germanyFlag from "@assets/germany_flag.svg";
import japanFlag from "@assets/japan_flag.svg";
import netherlandsFlag from "@assets/netherlands_flag.svg";
import italyFlag from "@assets/italy_flag.svg";
import {
    ChangeEvent,
    ChangeEventHandler,
    FormEvent,
    MouseEvent,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import i18n from "../i18n";
import IconButton from "./IconButton";
import MenuBtnList from "./MenuButtonList";
import Switch from "./SwitchInput";
import SimpleIconBtn from "./SimpleIconButton";
import ConfigsMenu from "./FullscreenMenu";
import FSMenuButton from "./FSMenuButton";
import profileIcon from "@assets/usericon-light.svg";
import darkProfileIcon from "@assets/usericon.svg";
import lightLanguageIcon from "@assets/language_17176254.png";
import darkLanguageIcon from "@assets/language_17176254-dark.png";
import accSettingsDarkIcon from "@assets/user-account-solid-120-dark.png";
import accSettingsLightIcon from "@assets/user-account-solid-120.png";
import exitIcon from "@assets/exit-regular-120.png";
import trashIcon from "@assets/trash-regular-120.png";
import postIconLight from "@assets/send-regular-120(1).png";
import postIconDark from "@assets/send-regular-120.png";
import { Outlet, useNavigate } from "react-router-dom";
import AccountFSMenu from "./FullscreenMenu";
import FollowPage from "./FullscreenMenu";
import altLockLight from "@assets/lock-alt-regular-120.png";
import altLockDark from "@assets/lock-alt-regular-120(1).png";
import emailLight from "@assets/envelope-regular-120-light.png";
import emailDark from "@assets/envelope-regular-120.png";
import atDark from "@assets/at-regular-120(1).png";
import atLight from "@assets/at-regular-120.png";
import Confirm from "./ConfirmFS";
import {
    FormikUpdateDataKind,
    FSFormEmail,
    FSFormPassword,
    FSFormUserAt,
} from "./FSForm";
import Loading from "./Loading";
import FollowerUser, { EmptyFollowUser } from "./FollowerUser";
import { APP_ROUTES } from "../main";
import PostWriter from "./PostWriter";
import { useDispatch, useSelector } from "react-redux";
import {
    shiftPost,
    UserDataState,
    UserDataStateSelector,
} from "../redux/store";
import FSWarning from "./FSWarning";

interface HomeProps {
    setTheme: CallableFunction;
    setUserAtContext: CallableFunction;
}

//enum LanguageNumber {
//    PT_BR,
//    EN,
//    RU,
//}

//TODO:
//function formatNumber(type: LanguageNumber, number: number): string {
//    const strNumber = number.toString();
//    switch (type) {
//        case LanguageNumber.PT_BR:
//            break;
//        case LanguageNumber.EN:
//            break;
//    }
//    return strNumber;
//}

export function goBackHistory(): void {
    const url = window.location.pathname.substring(
        1,
        window.location.pathname.length,
    );
    const path1 = "/" + url.substring(0, url.indexOf("/"));
    console.log(path1);
    switch (path1) {
        case APP_ROUTES.POST:
            location.href = "/";
            break;
        case APP_ROUTES.APP_HOME: // and /profileUserAt
            location.href = "/";
            break;
        case APP_ROUTES.EDIT_POST:
            location.href = "/";
            break;
        case APP_ROUTES.APP_SEARCH:
            location.href = "/";
            break;
        case APP_ROUTES.AUTH_LOGIN:
            history.go(-1);
            break;
        case APP_ROUTES.AUTH_SIGNUP:
            history.go(-1);
            break;
        case APP_ROUTES.EDIT_PROFILE:
            location.href = "/";
            break;
        case APP_ROUTES.APP_DIRECT_MESSAGES:
            location.href = "/";
            break;
        default:
            location.href = "/";
            break;
    }
    //if (history.length > 1) {
    //    history.go(-1);
    //} else {
    //    location.href = "/";
    //}
}

export default function Home({ setTheme, setUserAtContext }: HomeProps) {
    const useDarkTheme = useContext(ThemeContext) == "dark";
    //i'm sorry (thrice)
    const [profileBtnIcon, setProfileBtnIcon] = useState<typeof profileIcon>();
    const [accountSettingsConfigIcon, setAccountSettingsConfigIcon] =
        useState<typeof accSettingsDarkIcon>();
    const [languageBtnIcon, setLanguageBtnIcon] =
        useState<typeof lightLanguageIcon>();
    const configMenuRef = useRef<HTMLDivElement>(null);
    const langSelMenuRef = useRef<HTMLDivElement>(null);
    const [currentLanguage, setCurrentlanguage] = useState(i18n.locale);
    const [isConfigMenuClosed, setIsConfigMenuClosed] = useState(true);
    const [radioSelLang, setRadioSelLang] = useState("");
    const [isAcctMenuClosed, setIsAcctMenuClosed] = useState(true);
    const acctMenuRef = useRef<HTMLDivElement>(null);
    const confirmMenuRef = useRef<HTMLDivElement>(null);
    const [confirmMenuContent, setConfirmMenuContent] = useState({
        ok: "",
        cancel: "",
        description: "",
        onConfirm: () => {},
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentUserData, setCurrentUserData] = useState({
        icon: "",
        userAt: "",
        userName: "",
        followingCount: 0,
        followersCount: 0,
    });
    const navigateTo = useNavigate();
    const [updateDataTrigger, setUpdateDataTrigger] = useState(false);
    const [formikUpdateDataKind, setFormikUpdateDataKind] = useState(
        FormikUpdateDataKind.None,
    );
    const fsfUserAtref = useRef(null);
    const fsfEmailRef = useRef(null);
    const fsfPasswordRef = useRef(null);
    const [isFollowingPage, setIsFollowingPage] = useState(false);
    const followPageRef = useRef<HTMLDivElement>(null);
    const [isFollowPageClosed, setIsFollowPageClosed] = useState(true);
    const [followPageTitle, setFollowPageTitle] = useState("");
    const [followListVector, setFollowListVector] = useState([
        { userAt: "", userName: "", icon: "" },
    ]);
    const [isLoadingFollows, setIsLoadingFollows] = useState(true);
    const [openPostWriter, setOpenPostWriter] = useState(false);
    const [postImage, setPostImage] = useState("");
    const [postText, setPostText] = useState("");
    const postWriterRef = useRef<HTMLDivElement>(null);
    const [openConfigsMenu, setOpenConfigsMenu] = useState(false);
    const [showOpenLangMenu, setShowOpenLangMenu] = useState(false);
    const [showOpenFollowsPage, setShowOpenFollowsPage] = useState(false);
    const [showOpenAccountPage, setShowOpenAccountPage] = useState(false);
    const [isHomePage, setIsHomePage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const userProfileData = useSelector<UserDataStateSelector, UserDataState>(
        (state) => state.userData.value,
    );
    const dispatch = useDispatch();

    useEffect(() => {
        setUserAtContext(currentUserData.userAt);
    }, [currentUserData]);

    useEffect(() => {
        setIsHomePage(window.location.pathname === "/");
    }, [window.location.href]);

    useEffect(() => {
        if (isFollowingPage) {
            setFollowPageTitle(i18n.t("followingCount"));
        } else {
            setFollowPageTitle(i18n.t("followCount"));
        }
    }, [isLoadingFollows]);

    useEffect(() => {
        if (isAcctMenuClosed) {
            setTimeout(() => {
                setShowOpenAccountPage(false);
            }, 200);
        }
    }, [isAcctMenuClosed]);

    useEffect(() => {
        async function fetchUserData() {
            if (userProfileData.userAt === "") {
                setIsLoadingFollows(true);
            } else {
                setCurrentUserData({
                    icon: userProfileData.icon,
                    userAt: userProfileData.userAt,
                    userName: userProfileData.userName,
                    followersCount: userProfileData.followersCount,
                    followingCount: userProfileData.followingCount,
                });
            }
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
                    setCurrentUserData({
                        icon: body.icon,
                        userAt: body.userAt,
                        userName: body.userName,
                        followersCount: body.followersCount,
                        followingCount: body.followingCount,
                    });
                    setIsLoadingFollows(false);
                }
            } catch (err) {
                console.error("unable to connect to server");
            }
        }
        fetchUserData();
    }, [updateDataTrigger]);

    useEffect(() => {
        if (!langSelMenuRef.current) return;
        const enInput = document.getElementById(
            "en-lang-input",
        ) as HTMLInputElement;
        const ptInput = document.getElementById(
            "pt-BR-lang-input",
        ) as HTMLInputElement;
        const ruInput = document.getElementById(
            "ru-lang-input",
        ) as HTMLInputElement;
        switch (radioSelLang) {
            case "en":
                enInput.checked = true;
                ptInput.checked = false;
                ruInput.checked = false;
                break;
            case "pt-BR":
                ptInput.checked = true;
                enInput.checked = false;
                ruInput.checked = false;
                break;
            //case "ru":
            //    ruInput.checked = true;
            //    ptInput.checked = false;
            //    enInput.checked = false;
            //    break;
        }
    }, [radioSelLang, showOpenLangMenu]);

    useEffect(() => {
        if (useDarkTheme) {
            setProfileBtnIcon(darkProfileIcon);
            setLanguageBtnIcon(darkLanguageIcon);
            setAccountSettingsConfigIcon(accSettingsDarkIcon);
        } else {
            setProfileBtnIcon(profileIcon);
            setLanguageBtnIcon(lightLanguageIcon);
            setAccountSettingsConfigIcon(accSettingsLightIcon);
        }
    }, [useDarkTheme]);

    useEffect(() => {
        if (isConfigMenuClosed) {
            closeLangMenu();
            setTimeout(() => {
                setOpenConfigsMenu(false);
            }, 200);
        }
    }, [isConfigMenuClosed]);

    useEffect(() => {
        if (isFollowPageClosed) {
            setShowOpenFollowsPage(false);
        }
    }, [isFollowPageClosed]);

    async function openFollowMenu(following: boolean) {
        if (followPageRef == null) return;
        setShowOpenFollowsPage(true);
        setTimeout(() => {
            fetchFollowsData(following);
            followPageRef.current!.style.right = "0px";
        }, 0);
    }
    async function fetchFollowsData(following: boolean) {
        setIsLoadingFollows(true);
        if (following) {
            try {
                const url = `${process.env.API_URL_ROOT}${process.env.FOLLOWING_DATA_PATH}/${currentUserData.userAt}`;
                const res = await fetch(url, {
                    mode: "cors",
                    method: "GET",
                    credentials: "include",
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
                    // TODO set failed to fetch component idk
                }
            } catch (err) {
                console.error("failed to communicate with the server");
            }
        } else {
            try {
                const url = `${process.env.API_URL_ROOT}${process.env.FOLLOWERS_DATA_PATH}/${currentUserData.userAt}`;
                const res = await fetch(url, {
                    mode: "cors",
                    method: "GET",
                    credentials: "include",
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
                }
            } catch (err) {
                console.error("failed to communicate with the server");
            }
        }
    }

    function hasTranslationFor(lang: string): boolean {
        return (i18n.translations as Object).hasOwnProperty(lang);
    }

    async function updateDataTriggerCallback() {
        setUpdateDataTrigger(!updateDataTrigger);
    }

    function showConfigMenu() {
        setOpenConfigsMenu(true);
        setTimeout(() => {
            if (configMenuRef == null) return;

            setIsConfigMenuClosed(false);

            configMenuRef.current!.style.right = "0px";
        }, 0);
    }

    function showAccountConfig() {
        closeLangMenu();
        setShowOpenAccountPage(true);
        setTimeout(() => {
            if (acctMenuRef.current == null) return;
            acctMenuRef.current!.style.right = "0px";
        }, 0);
    }

    function handleLangSelection(e: FormEvent) {
        e.preventDefault();

        if (radioSelLang === "") {
            closeLangMenu();
            return;
        }

        i18n.locale = radioSelLang;
        setCurrentlanguage(radioSelLang);
        localStorage.setItem("language", radioSelLang);
        window.location.reload();

        //closeLangMenu();
    }

    function handleRadioChange(e: ChangeEvent) {
        const { nodeName, value } = e.target as HTMLInputElement;

        if (nodeName === "INPUT") {
            setRadioSelLang(value);
        }
    }

    function openLangMenu() {
        setShowOpenLangMenu(true);

        setTimeout(() => {
            if (langSelMenuRef.current == null) return;
            setCurrentlanguage(i18n.locale);
            setRadioSelLang(currentLanguage);

            langSelMenuRef.current!.style.bottom = "0px";
        }, 0);
    }

    function closeLangMenu(e?: MouseEvent) {
        e?.stopPropagation();
        e?.preventDefault();
        if (langSelMenuRef.current == null) return;

        setRadioSelLang(currentLanguage);

        langSelMenuRef.current!.style.bottom = "-100%";
        setTimeout(() => {
            setShowOpenLangMenu(false);
        }, 200);
    }

    async function hideConfirmMenu() {
        setShowConfirm(false);
    }

    async function logout() {
        if (confirmMenuRef == null) return;
        setConfirmMenuContent({
            ok: i18n.t("logout"),
            cancel: i18n.t("cancel"),
            description: i18n.t("logoutConfirm"),
            onConfirm: requestLogout,
        });
        setShowConfirm(true);
        setTimeout(() => {
            confirmMenuRef.current!.style.display = "grid";
        }, 0);
    }

    async function deleteAccount() {
        if (confirmMenuRef == null) return;
        setConfirmMenuContent({
            ok: i18n.t("delete"),
            cancel: i18n.t("cancel"),
            description: i18n.t("deleteConfirm"),
            onConfirm: requestDelete,
        });
        setShowConfirm(true);

        setTimeout(() => {
            confirmMenuRef.current!.style.display = "grid";
        }, 0);
    }

    async function requestLogout() {
        try {
            const url = `${process.env.API_URL_ROOT}${process.env.LOGOUT_USER_PATH}`;
            const res = await fetch(url, {
                mode: "cors",
                method: "POST",
                credentials: "include",
            });
            if (res.status > 199 && res.status < 300) {
                hideSlideMenu();
                navigateTo("/login");
            }
        } catch (err) {
            console.error("could not communicate with the server");
        }
    }

    async function requestDelete() {
        try {
            const url = `${process.env.API_URL_ROOT}${process.env.DELETE_USER_PATH}`;
            const res = await fetch(url, {
                mode: "cors",
                method: "DELETE",
                credentials: "include",
            });
            if (res.status > 199 && res.status < 300) {
                hideSlideMenu();
                navigateTo("/login");
            }
        } catch (err) {
            console.error("could not communicate with the server");
        }
    }

    async function closeFSFmenu() {
        setFormikUpdateDataKind(FormikUpdateDataKind.None);
    }

    async function gotoProfile() {
        hideSlideMenu();
        navigateTo(`/${currentUserData.userAt}`);
    }

    async function showSlideMenu() {
        //const isSlideMenuOpen =
        //    (document.querySelector(".slide-menu") as HTMLElement)?.style
        //        .left == "0px";
        const menuRef: HTMLElement | null =
            document.querySelector(".slide-menu");
        setUpdateDataTrigger(!updateDataTrigger);

        menuRef!.style.left = "0px";

        setTimeout(() => {
            // closes SlideMenu if a click occurs outside of it
            document.addEventListener("click", menuCloserHandler);
        }, 0);
    }

    async function publish() {
        try {
            const url = `${process.env.API_URL_ROOT}${process.env.PUBLISH_POST_PATH}`;
            const res = await fetch(url, {
                method: "POST",
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
                dispatch(
                    shiftPost({
                        icon: currentUserData.icon,
                        image: postImage,
                        unixTime: Date.now().toString(),
                        userAt: currentUserData.userAt,
                        userName: currentUserData.userName,
                        text: postText,
                        ownerId: "0",
                        likesCount: 0,
                        commentsCount: 0,
                        postId: "0",
                        hasThisUserLiked: false,
                        edited: false,
                    }),
                );
                //window.location.reload();
                //} else {
                //    console.log(await res.text());
            }
        } catch (err) {
            console.error("could not communicate with the server");
        }
    }

    function animatePostWriter(onOpen: boolean) {
        if (!postWriterRef.current) return;
        if (onOpen) {
            postWriterRef.current!.style.top = "0px";
        } else {
            postWriterRef.current!.style.top = "100%";
        }
    }

    return (
        <main className={`home ${useDarkTheme ? "home-dark" : "home-light"}`}>
            {isHomePage ? (
                <div
                    onClick={() => {
                        setOpenPostWriter(true);
                        setTimeout(() => {
                            animatePostWriter(true);
                        }, 0);
                    }}
                    className={`post-button ${useDarkTheme ? "post-button-dark" : "post-button-light"}`}
                >
                    <img
                        src={useDarkTheme ? postIconDark : postIconLight}
                        alt=""
                    />
                </div>
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

            {openPostWriter ? (
                <PostWriter
                    postImage={postImage}
                    postText={postText}
                    setPostImage={setPostImage}
                    setPostText={setPostText}
                    postWriterRef={postWriterRef}
                    placeholder={
                        i18n.t("yourThoughts") +
                        " " +
                        currentUserData.userName +
                        "?"
                    }
                    publish={publish}
                    setOpenPostWriter={setOpenPostWriter}
                    animatePostWriter={animatePostWriter}
                />
            ) : (
                <></>
            )}
            {showConfirm ? (
                <Confirm
                    onCloseHandler={hideConfirmMenu}
                    revertColors={true}
                    reference={confirmMenuRef}
                    {...confirmMenuContent}
                />
            ) : (
                <></>
            )}
            {formikUpdateDataKind === FormikUpdateDataKind.UserAt ? (
                <FSFormUserAt
                    updateDataCallback={updateDataTriggerCallback}
                    closeCallBack={closeFSFmenu}
                    reference={fsfUserAtref}
                />
            ) : formikUpdateDataKind === FormikUpdateDataKind.Email ? (
                <FSFormEmail
                    updateDataCallback={updateDataTriggerCallback}
                    closeCallBack={closeFSFmenu}
                    reference={fsfEmailRef}
                />
            ) : formikUpdateDataKind === FormikUpdateDataKind.Password ? (
                <FSFormPassword
                    updateDataCallback={updateDataTriggerCallback}
                    closeCallBack={closeFSFmenu}
                    reference={fsfPasswordRef}
                />
            ) : (
                <></>
            )}
            {openConfigsMenu ? (
                <ConfigsMenu
                    reference={configMenuRef}
                    title={i18n.t("config")}
                    closedStateSetter={setIsConfigMenuClosed}
                >
                    <FSMenuButton
                        execOnClick={() => {
                            hideSlideMenu();
                            navigateTo("/edit/profile");
                        }}
                        icon={profileBtnIcon}
                        description={i18n.t("profileSettingsDesc")}
                    >
                        {i18n.t("profileSettings")}
                    </FSMenuButton>
                    <FSMenuButton
                        execOnClick={openLangMenu}
                        icon={languageBtnIcon}
                        description={i18n.t("languageSettingsDesc")}
                    >
                        {i18n.t("languageSettings")}
                    </FSMenuButton>
                    <FSMenuButton
                        execOnClick={showAccountConfig}
                        icon={accountSettingsConfigIcon}
                        description={i18n.t("accountSettingsDesc")}
                    >
                        {i18n.t("accountSettings")}
                    </FSMenuButton>
                </ConfigsMenu>
            ) : (
                <></>
            )}
            {showOpenLangMenu ? (
                <menu
                    className={`change-lang-menu ${useDarkTheme ? "clang-menu-dark" : "clang-menu-light"}`}
                    ref={langSelMenuRef}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div>
                        <form
                            onSubmit={handleLangSelection}
                            className="lang-sel-form"
                        >
                            <button
                                className="exit-lang-selection-btn"
                                onClick={closeLangMenu}
                            >
                                {useDarkTheme ? (
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
                                        <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
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
                                        <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                                    </svg>
                                )}
                            </button>
                            <ul
                                className={` ${useDarkTheme ? "dark-lang-ul" : "light-lang-ul"}`}
                            >
                                <li>
                                    <input
                                        disabled={!hasTranslationFor("en")}
                                        type="radio"
                                        name="lang"
                                        id="en-lang-input"
                                        value="en"
                                        onChange={handleRadioChange}
                                    />
                                    <label htmlFor="en-lang-input">
                                        <img src={englishFlag} alt="" />
                                        <span>English</span>
                                    </label>
                                </li>
                                <li>
                                    <input
                                        disabled={!hasTranslationFor("pt-BR")}
                                        type="radio"
                                        name="lang"
                                        id="pt-BR-lang-input"
                                        value="pt-BR"
                                        onChange={handleRadioChange}
                                    />
                                    <label htmlFor="pt-BR-lang-input">
                                        <img src={brasilFlag} alt="" />
                                        <span>Português, Brasil</span>
                                    </label>
                                </li>
                                <li>
                                    <input
                                        disabled={!hasTranslationFor("ru")}
                                        type="radio"
                                        name="lang"
                                        id="ru-lang-input"
                                        value="ru"
                                        onChange={handleRadioChange}
                                    />
                                    <label htmlFor="ru-lang-input">
                                        <img src={russiaFlag} alt="" />
                                        <span>Русский</span>
                                    </label>
                                </li>
                                <li>
                                    <input
                                        disabled={!hasTranslationFor("de")}
                                        type="radio"
                                        name="lang"
                                        id="de-lang-input"
                                        value="de"
                                        onChange={handleRadioChange}
                                    />
                                    <label htmlFor="de-lang-input">
                                        <img src={germanyFlag} alt="" />
                                        <span>Deutsch</span>
                                    </label>
                                </li>
                                <li>
                                    <input
                                        disabled={!hasTranslationFor("it")}
                                        type="radio"
                                        name="lang"
                                        id="it-lang-input"
                                        value="it"
                                        onChange={handleRadioChange}
                                    />
                                    <label htmlFor="it-lang-input">
                                        <img src={italyFlag} alt="" />
                                        <span>Italiano</span>
                                    </label>
                                </li>
                                <li>
                                    <input
                                        disabled={!hasTranslationFor("nl")}
                                        type="radio"
                                        name="lang"
                                        id="nl-lang-input"
                                        value="nl"
                                        onChange={handleRadioChange}
                                    />
                                    <label htmlFor="nl-lang-input">
                                        <img src={netherlandsFlag} alt="" />
                                        <span>Nederlandse</span>
                                    </label>
                                </li>
                                <li>
                                    <input
                                        disabled={!hasTranslationFor("es")}
                                        type="radio"
                                        name="lang"
                                        id="es-lang-input"
                                        value="es"
                                        onChange={handleRadioChange}
                                    />
                                    <label htmlFor="es-lang-input">
                                        <img src={mexicoFlag} alt="" />
                                        <span>Español</span>
                                    </label>
                                </li>
                                <li>
                                    <input
                                        disabled={!hasTranslationFor("fr")}
                                        type="radio"
                                        name="lang"
                                        id="fr-lang-input"
                                        value="fr"
                                        onChange={handleRadioChange}
                                    />
                                    <label htmlFor="fr-lang-input">
                                        <img src={franceFlag} alt="" />
                                        <span>Français</span>
                                    </label>
                                </li>
                                <li>
                                    <input
                                        disabled={!hasTranslationFor("ja")}
                                        type="radio"
                                        name="lang"
                                        id="ja-lang-input"
                                        value="ja"
                                        onChange={handleRadioChange}
                                    />
                                    <label htmlFor="ja-lang-input">
                                        <img src={japanFlag} alt="" />
                                        <span>日本語</span>
                                    </label>
                                </li>
                                <li>
                                    <input
                                        disabled={!hasTranslationFor("zh-cn")}
                                        type="radio"
                                        name="lang"
                                        id="cn-lang-input"
                                        value="cn"
                                        onChange={handleRadioChange}
                                    />
                                    <label htmlFor="cn-lang-input">
                                        <img src={chinaFlag} alt="" />
                                        <span>中文</span>
                                    </label>
                                </li>
                            </ul>
                            <input
                                className="submit-lang-selection"
                                type="submit"
                                value={i18n.t("ok")}
                            />
                        </form>
                    </div>
                </menu>
            ) : (
                <></>
            )}
            {showOpenFollowsPage ? (
                <FollowPage
                    title={followPageTitle}
                    reference={followPageRef}
                    zIndex={60}
                    closedStateSetter={setIsFollowPageClosed}
                >
                    {isLoadingFollows ? (
                        <Loading useDarkTheme={useDarkTheme} />
                    ) : followListVector.length > 0 ? (
                        followListVector.map((e, i) => (
                            <FollowerUser
                                key={i}
                                user={e}
                                beforeOnClick={hideSlideMenu}
                            />
                        ))
                    ) : (
                        <EmptyFollowUser
                            text={
                                isFollowingPage
                                    ? i18n.t("youFollowNobody")
                                    : i18n.t("youFollowedByNobody")
                            }
                        />
                    )}
                </FollowPage>
            ) : (
                <></>
            )}
            {showOpenAccountPage ? (
                <AccountFSMenu
                    title={i18n.t("accountSubMenu")}
                    reference={acctMenuRef}
                    closedStateSetter={setIsAcctMenuClosed}
                    zIndex="20"
                >
                    <FSMenuButton
                        execOnClick={() => {
                            setFormikUpdateDataKind(
                                FormikUpdateDataKind.UserAt,
                            );
                        }}
                        icon={useDarkTheme ? atDark : atLight}
                        description={i18n.t("changeUserAtDesc")}
                    >
                        {i18n.t("changeUserAt")}
                    </FSMenuButton>
                    <FSMenuButton
                        execOnClick={() => {
                            setFormikUpdateDataKind(FormikUpdateDataKind.Email);
                        }}
                        icon={useDarkTheme ? emailDark : emailLight}
                        description={i18n.t("changeUserEmailDesc")}
                    >
                        {i18n.t("changeUserEmail")}
                    </FSMenuButton>
                    <FSMenuButton
                        execOnClick={() => {
                            setFormikUpdateDataKind(
                                FormikUpdateDataKind.Password,
                            );
                        }}
                        icon={useDarkTheme ? altLockDark : altLockLight}
                        description={i18n.t("changeUserPasswordDesc")}
                    >
                        {i18n.t("changeUserPassword")}
                    </FSMenuButton>
                    <FSMenuButton
                        className="fsm-w-red"
                        execOnClick={logout}
                        icon={exitIcon}
                        description={i18n.t("logOutDesc")}
                    >
                        {i18n.t("logOut")}
                    </FSMenuButton>
                    <FSMenuButton
                        className="fsm-w-red"
                        execOnClick={deleteAccount}
                        icon={trashIcon}
                        description={i18n.t("deleteAcctDesc")}
                    >
                        {i18n.t("deleteAcct")}
                    </FSMenuButton>
                </AccountFSMenu>
            ) : (
                <></>
            )}
            <SlideMenu>
                <section className="menu-profile-section">
                    <UserIcon
                        onclick={() => {
                            hideSlideMenu();
                            navigateTo(
                                `${APP_ROUTES.APP_HOME}${currentUserData.userAt}`,
                            );
                        }}
                        className="slide-menu-icon"
                        userIconImg={
                            currentUserData.icon === ""
                                ? userIcon
                                : currentUserData.icon
                        }
                    ></UserIcon>
                    <strong
                        onClick={() => {
                            hideSlideMenu();
                            navigateTo(
                                `${APP_ROUTES.APP_HOME}${currentUserData.userAt}`,
                            );
                        }}
                        className="user-name"
                    >
                        {currentUserData.userName}
                    </strong>
                    <strong
                        onClick={() => {
                            hideSlideMenu();
                            navigateTo(
                                `${APP_ROUTES.APP_HOME}${currentUserData.userAt}`,
                            );
                        }}
                        className="user-at"
                    >
                        {"@" + currentUserData.userAt}
                    </strong>
                    <div className="follow-info">
                        <span
                            onClick={() => {
                                setIsFollowingPage(true);
                                openFollowMenu(true);
                            }}
                        >
                            <strong
                                className={
                                    useDarkTheme
                                        ? "follow-number-dark"
                                        : "follow-number-light"
                                }
                            >
                                {currentUserData.followingCount}
                            </strong>
                            {i18n.t("followingCount")}
                        </span>
                        <span
                            onClick={() => {
                                setIsFollowingPage(false);
                                openFollowMenu(false);
                            }}
                        >
                            <strong
                                className={
                                    useDarkTheme
                                        ? "follow-number-dark"
                                        : "follow-number-light"
                                }
                            >
                                {currentUserData.followersCount}
                            </strong>
                            {i18n.t("followCount")}
                        </span>
                    </div>
                </section>
                <section className="menu-content-section">
                    <MenuBtnList>
                        <IconButton
                            icon={profileBtnIcon}
                            executeFunction={gotoProfile}
                            altText="An icon representing a person's profile"
                        >
                            {i18n.t("profile")}
                        </IconButton>
                    </MenuBtnList>
                </section>
                <section className="menu-bottom">
                    <Switch
                        execFunction={setTheme as ChangeEventHandler}
                    ></Switch>
                    <SimpleIconBtn execOnClick={showConfigMenu}>
                        {useDarkTheme ? (
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
                                <path d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2z"></path>
                                <path d="m2.845 16.136 1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399.999.999 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108z"></path>
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
                                <path d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2z"></path>
                                <path d="m2.845 16.136 1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399.999.999 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108z"></path>
                            </svg>
                        )}
                    </SimpleIconBtn>
                </section>
            </SlideMenu>
            <Header
                userIcon={
                    currentUserData.icon === ""
                        ? userIcon
                        : currentUserData.icon
                }
                showSlideMenu={showSlideMenu}
            ></Header>
            <Outlet></Outlet>
            <Footer></Footer>
        </main>
    );
}
