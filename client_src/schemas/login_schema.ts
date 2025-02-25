import { object, string } from "yup";
import i18n from "../i18n";

export type LoginSchema = {
    email: string;
    password: string;
};

export const loginSchema = object().shape({
    email: string()
        .email(i18n.t("invalidEmail"))
        .required(i18n.t("emailRequired"))
        .trim(),
    password: string()
        .min(8, i18n.t("passwordShort"))
        .max(32, i18n.t("passwordLong"))
        .required(i18n.t("passwordRequired"))
        .trim(),
});
