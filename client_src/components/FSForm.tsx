import "@styles/fs_form.scss";
import { MouseEvent, RefObject, useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import i18n from "../i18n";
import x from "@assets/x-regular-120(2).png";
import { useFormik } from "formik";
import {
    emailSchema,
    passwordSchema,
    userAtSchema,
} from "../schemas/data_update_schemas";
import { translateServerErrorMessages } from "./SignUp";
import { API_ROUTES } from "../main";

interface FSFormProps {
    children?: JSX.Element[] | JSX.Element;
    reference: RefObject<HTMLDivElement>;
    closeCallBack: CallableFunction;
    updateDataCallback: CallableFunction;
}

export enum FormikUpdateDataKind {
    Password,
    Email,
    UserAt,
    None,
}

export function FSFormPassword({
    reference,
    closeCallBack,
    updateDataCallback,
}: FSFormProps) {
    const useDarkTheme = useContext(ThemeContext) == "dark";
    const [errorBad, setErrorBad] = useState(true);
    async function closeThisMenu(e: MouseEvent) {
        e.preventDefault();
        if (reference == null) return;
        //reference.current!.style.display = "none";
        closeCallBack();
    }

    const formikPassword = useFormik({
        initialValues: {
            passwordField: "",
            oldPasswordField: "",
        },
        validationSchema: passwordSchema,
        validateOnChange: false,
        onSubmit: submitUserPassword,
    });

    async function submitUserPassword(data: {
        passwordField: string;
        oldPasswordField: string;
    }) {
        setErrorBad(true);
        try {
            const url = `${API_ROUTES.CHANGE_PASSWORD_PATH}`;
            const res = await fetch(url, {
                mode: "cors",
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newPassword: data.passwordField,
                    currentPassword: data.oldPasswordField,
                }),
            });
            const text = await res.text();
            if (res.status > 199 && res.status < 300) {
                setErrorBad(false);
                formikPassword.setErrors({
                    oldPasswordField: "",
                    passwordField: i18n.t("passwordChangeOk"),
                });
                updateDataCallback();
                return;
            } else {
                formikPassword.setErrors({
                    passwordField: await translateServerErrorMessages(text),
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div
            ref={reference}
            className={`fsf-wrapper ${useDarkTheme ? "dark-ffs" : "light-ffs"}`}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <form
                onSubmit={formikPassword.handleSubmit}
                onReset={formikPassword.handleReset}
            >
                <button
                    onClick={(e) => {
                        // dont blame me it was bitching and the input was transferring the enter key event as a fucking click event TO THE BUTTON WHICH IS NOT EVEN ITS SIBLING WTF and the fucking button never caught a CLICK EVENT BUT ITS CHILD IMG DID WTF
                        if ((e.target as HTMLElement).nodeName === "IMG") {
                            formikPassword.resetForm();
                            closeThisMenu(e);
                        }
                    }}
                    className="update-exit-btn"
                >
                    <img src={x} alt="" />
                </button>
                <section>
                    <label htmlFor="oldPasswordField">
                        {i18n.t("oldPassword")}
                    </label>
                    <input
                        onChange={formikPassword.handleChange}
                        value={formikPassword.values.oldPasswordField}
                        formNoValidate
                        placeholder="********"
                        type="password"
                        name="oldPasswordField"
                        id="oldPasswordField"
                    />
                    <output className="update-errors">
                        {formikPassword.errors.oldPasswordField}
                    </output>
                </section>
                <section>
                    <label htmlFor="passwordField">
                        {i18n.t("newPassword")}
                    </label>
                    <input
                        onChange={formikPassword.handleChange}
                        value={formikPassword.values.passwordField}
                        formNoValidate
                        type="password"
                        name="passwordField"
                        placeholder="********"
                        id="passwordField"
                    />
                    <output
                        className={`${errorBad ? "update-errors" : "update-success"}`}
                    >
                        {formikPassword.errors.passwordField}
                    </output>
                </section>
                <input
                    value={i18n.t("ok")}
                    type="submit"
                    className="update-submit-btn"
                />
            </form>
        </div>
    );
}

export function FSFormEmail({
    reference,
    closeCallBack,
    updateDataCallback,
}: FSFormProps) {
    const useDarkTheme = useContext(ThemeContext) == "dark";
    const [errorBad, setErrorBad] = useState(true);
    async function closeThisMenu(e: MouseEvent) {
        e.preventDefault();
        if (reference == null) return;
        //reference.current!.style.display = "none";
        closeCallBack();
    }
    const formikEmail = useFormik({
        initialValues: {
            emailField: "",
        },
        validationSchema: emailSchema,
        validateOnChange: false,
        onSubmit: submitUserEmail,
    });

    async function submitUserEmail(data: { emailField: string }) {
        setErrorBad(true);
        try {
            const url = `${API_ROUTES.CHANGE_EMAIL_PATH}`;
            const res = await fetch(url, {
                mode: "cors",
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.emailField,
                }),
            });
            const status = res.status;
            const text = await res.text();
            if (status > 199 && status < 300) {
                setErrorBad(false);
                formikEmail.setErrors({
                    emailField: i18n.t("emailChangeOk"),
                });
                updateDataCallback();
            } else {
                formikEmail.setErrors({
                    emailField: await translateServerErrorMessages(text),
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div
            ref={reference}
            className={`fsf-wrapper ${useDarkTheme ? "dark-ffs" : "light-ffs"}`}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <form
                onSubmit={formikEmail.handleSubmit}
                onReset={formikEmail.handleReset}
            >
                <button
                    onClick={(e) => {
                        if ((e.target as HTMLElement).nodeName === "IMG") {
                            formikEmail.resetForm();
                            closeThisMenu(e);
                        }
                    }}
                    className="update-exit-btn"
                >
                    <img src={x} alt="" />
                </button>
                <section>
                    <label htmlFor="emailField">{i18n.t("newEmail")}</label>
                    <input
                        onChange={formikEmail.handleChange}
                        value={formikEmail.values.emailField}
                        formNoValidate
                        type="text"
                        placeholder="email@website.com"
                        name="emailField"
                        id="emailField"
                    />
                    <output
                        className={`${errorBad ? "update-errors" : "update-success"}`}
                    >
                        {formikEmail.errors.emailField}
                    </output>
                </section>
                <input
                    value={i18n.t("ok")}
                    type="submit"
                    className="update-submit-btn"
                />
            </form>
        </div>
    );
}

export function FSFormUserAt({
    reference,
    closeCallBack,
    updateDataCallback,
}: FSFormProps) {
    const useDarkTheme = useContext(ThemeContext) == "dark";
    const [errorBad, setErrorBad] = useState(true);
    async function closeThisMenu(e: MouseEvent) {
        e.preventDefault();
        if (reference == null) return;
        //reference.current!.style.display = "none";
        closeCallBack();
    }

    const formikUserAt = useFormik({
        initialValues: {
            userAtField: "",
        },
        validationSchema: userAtSchema,
        validateOnChange: false,
        onSubmit: submitUserAt,
    });

    async function submitUserAt(data: { userAtField: string }) {
        setErrorBad(true);
        try {
            const url = `${API_ROUTES.CHANGE_USER_AT_PATH}`;
            const res = await fetch(url, {
                mode: "cors",
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userAt: data.userAtField,
                }),
            });
            const status = res.status;
            const text = await res.text();
            if (status > 199 && status < 300) {
                setErrorBad(false);
                formikUserAt.setErrors({
                    userAtField: i18n.t("userAtChangeOk"),
                });
                updateDataCallback();
            } else {
                formikUserAt.setErrors({
                    userAtField: await translateServerErrorMessages(text),
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div
            ref={reference}
            className={`fsf-wrapper ${useDarkTheme ? "dark-ffs" : "light-ffs"}`}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <form
                onSubmit={formikUserAt.handleSubmit}
                onReset={formikUserAt.handleReset}
            >
                <button
                    onClick={(e) => {
                        if ((e.target as HTMLElement).nodeName === "IMG") {
                            formikUserAt.resetForm();
                            closeThisMenu(e);
                        }
                    }}
                    className="update-exit-btn"
                >
                    <img src={x} alt="" />
                </button>
                <section>
                    <label htmlFor="userAtField">{i18n.t("newUserAt")}</label>
                    <input
                        onChange={formikUserAt.handleChange}
                        value={formikUserAt.values.userAtField}
                        formNoValidate
                        type="text"
                        name="userAtField"
                        id="userAtField"
                        placeholder={`@${i18n.t("userAt")}`}
                    />
                    <output
                        className={`${errorBad ? "update-errors" : "update-success"}`}
                    >
                        {formikUserAt.errors.userAtField}
                    </output>
                </section>
                <input
                    value={i18n.t("ok")}
                    type="submit"
                    className="update-submit-btn"
                />
            </form>
        </div>
    );
}
