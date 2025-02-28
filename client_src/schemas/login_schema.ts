import { object, string } from "yup";
import i18n from "../i18n";

export type LoginSchema = {
    userAtEmail: string;
    password: string;
};

export const loginSchema = object().shape({
    userAtEmail: string()
        .trim()
        .transform((s: string, _: string) =>
            s.startsWith("@") ? s.substring(1) : s,
        )
        //.email(i18n.t("invalidEmail"))
        .when((value: string[], schema) => {
            const val = value[0] || "";
            if (val.includes("@")) {
                if (val.indexOf("@") === 0) {
                    return schema
                        .trim()
                        .min(2, i18n.t("userAtMinLength"))
                        .max(20, i18n.t("userAtMaxLength"));
                } else {
                    return schema.trim().email(i18n.t("invalidEmail"));
                }
            }
            return schema
                .min(2, i18n.t("userAtMinLength"))
                .max(20, i18n.t("userAtMaxLength"));
        })
        .required(i18n.t("emailRequired")),
    password: string()
        .trim()
        .min(8, i18n.t("passwordShort"))
        .max(32, i18n.t("passwordLong"))
        .required(i18n.t("passwordRequired")),
});
