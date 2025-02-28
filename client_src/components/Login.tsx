import Form from "./Form";
import "@styles/login_signup.scss";
import Input from "./Input";
import i18n from "../i18n";
import Submit from "./Submit";
import { Link, useNavigate } from "react-router-dom";
import { FormikProps, useFormik } from "formik";
import { loginSchema, LoginSchema } from "@src/schemas/login_schema";
import { API_ROUTES, APP_ROUTES } from "../main";
import { useState } from "react";
import { translateServerErrorMessages } from "./SignUp";
import userIcon from "@assets/user-solid-96.png";
import lockClosed from "@assets/lock-solid-96.png";

export default function Login() {
    const [isStatusGood, setIsStatusGood] = useState(true);
    const navigateTo = useNavigate();
    const formik: FormikProps<LoginSchema> = useFormik({
        initialValues: {
            userAtEmail: "",
            password: "",
        },
        validationSchema: loginSchema,
        validateOnChange: false,
        async onSubmit(formData: LoginSchema, { setStatus }) {
            try {
                const url = `${API_ROUTES.LOGIN_USER_PATH}`;
                const res = await fetch(url, {
                    mode: "cors",
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const text = await res.text();
                if (res.status < 200 || res.status > 299) {
                    setIsStatusGood(false);
                    if (res.status === 503) {
                        setStatus(i18n.t("serverInactive"));
                    } else {
                        setStatus(await translateServerErrorMessages(text));
                    }
                } else {
                    setIsStatusGood(true);
                    setStatus(i18n.t("loginSuccess"));
                    navigateTo("/");
                }
            } catch (err) {
                setIsStatusGood(false);
                setStatus(await translateServerErrorMessages(err as string));
            }
        },
    });

    return (
        <main className="login-page">
            <Form formik={formik}>
                <section className="form-up-sect">
                    <span className="title">{i18n.t("login")}</span>
                    <Input
                        onChange={(e) => {
                            formik.handleChange(e);
                            formik.setErrors({
                                userAtEmail: "",
                                password: "",
                            });
                            formik.setStatus("");
                        }}
                        formikError={formik.errors.userAtEmail}
                        type="text"
                        id="userAtEmail"
                        label={i18n.t("usernameOrEmail")}
                        icon={userIcon}
                    />
                    <Input
                        onChange={(e) => {
                            formik.handleChange(e);
                            formik.setErrors({
                                userAtEmail: "",
                                password: "",
                            });
                            formik.setStatus("");
                        }}
                        formikError={formik.errors.password}
                        type="password"
                        id="password"
                        label={i18n.t("password")}
                        icon={lockClosed}
                    />
                    <output
                        className={`server-message ${isStatusGood ? "formik-success" : "formik-failure"}`}
                    >
                        {formik.status}
                    </output>
                </section>
                <section className="form-lower-sect">
                    <Submit name={i18n.t("login")} />
                    <p className="alt-auth-link">
                        <span>{i18n.t("signupLinkDesc")}</span>
                        <Link to={APP_ROUTES.AUTH_SIGNUP}>
                            {i18n.t("signup")}
                        </Link>
                    </p>
                </section>
            </Form>
        </main>
    );
}
