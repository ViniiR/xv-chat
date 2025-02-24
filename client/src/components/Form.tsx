import "@styles/form.scss";
import { FormikProps } from "formik";
import { LoginSchema } from "../schemas/login_schema";
import { SignUpSchema } from "../schemas/signup_shema";

interface FormProps {
    children: JSX.Element[];
    formik: FormikProps<LoginSchema> | FormikProps<SignUpSchema>;
}

export default function Form({ children, formik }: FormProps) {
    return (
        <form
            onReset={formik.handleReset}
            onSubmit={formik.handleSubmit}
            className="form"
        >
            {children}
        </form>
    );
}
