import jsConfig from "@eslint/js";
import globals from "globals";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactEslint from "eslint-plugin-react";
import reactHooksEslint from "eslint-plugin-react-hooks";

export default [
    jsConfig.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            sourceType: "module",
            parserOptions: {
                sourceType: "module",
                project: "./tsconfig.json",
                ecmaVersion: "latest", // change
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.es2025,
                //...globals.commonjs,
                ...globals.node,
                JSX: true,
                React: true,
                context: true,
            },
        },
        plugins: {
            "@typescript-eslint": tsEslint,
            react: reactEslint,
            "react-hooks": reactHooksEslint,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "no-undef": "off",
            ...reactEslint.configs["jsx-runtime"].rules,
            ...tsEslint.configs.recommended.rules,
            //...tsEslint.configs["recommended-requiring-type-checking"].rules,
            ...reactEslint.configs.recommended.rules,
            ...reactHooksEslint.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": ["warn"],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" },
            ],
            "react/react-in-jsx-scope": "off",
            "react-hooks/rules-of-hooks": "warn",
            "react-hooks/exhaustive-deps": "warn",
        },
    },
];
