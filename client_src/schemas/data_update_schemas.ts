import { object, string } from "yup";
import i18n from "../i18n";

export const userAtSchema = object().shape({
    userAtField: string()
        .trim()
        .transform((s: string, _: string) =>
            s.startsWith("@") ? s.substring(1) : s,
        )
        .min(2, i18n.t("userAtMinLength"))
        .max(20, i18n.t("userAtMaxLength"))
        .required(i18n.t("userAtRequired")),
});

export const passwordSchema = object().shape({
    passwordField: string()
        .trim()
        .min(8, i18n.t("passwordShort"))
        .max(32, i18n.t("passwordLong"))
        .required(i18n.t("passwordRequired")),
    oldPasswordField: string()
        .trim()
        .min(8, i18n.t("passwordShort"))
        .max(32, i18n.t("passwordLong"))
        .required(i18n.t("passwordRequired")),
});

export const emailSchema = object().shape({
    emailField: string()
        .trim()
        .email(i18n.t("invalidEmail"))
        .required(i18n.t("emailRequired")),
});
