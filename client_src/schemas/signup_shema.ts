import { object, ref, string } from "yup";
import i18n from "../i18n";

export type SignUpSchema = {
    userName: string;
    userAt: string;
    email: string;
    password: string;
    passwordConfirm: string;
};

export const signUpSchema = object().shape({
    userName: string()
        .min(2, i18n.t("userNameMinLength"))
        .max(20, i18n.t("userNameMaxLength"))
        .trim()
        .required(i18n.t("userNameRequired")),
    userAt: string()
        .min(2, i18n.t("userAtMinLength"))
        .max(20, i18n.t("userAtMaxLength"))
        .trim()
        .required(i18n.t("userAtRequired")),
    email: string()
        .email(i18n.t("invalidEmail"))
        .trim()
        .required(i18n.t("emailRequired")),
    password: string()
        .min(8, i18n.t("passwordShort"))
        .max(32, i18n.t("passwordLong"))
        .trim()
        .required(i18n.t("passwordRequired")),
    passwordConfirm: string()
        .min(8, i18n.t("passwordShort"))
        .max(32, i18n.t("passwordLong"))
        .trim()
        .oneOf([ref("password")], i18n.t("passwordNoMatch"))
        .required(i18n.t("passwordConfirmRequired")),
});
