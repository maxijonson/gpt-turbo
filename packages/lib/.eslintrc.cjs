module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint/eslint-plugin"],
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    root: true,
    env: {
        node: true,
    },
    ignorePatterns: [".eslintrc.cjs"],
    rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                ignoreRestSiblings: true,
            },
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/ban-types": "off",
        "max-classes-per-file": "off",
        "no-useless-constructor": "off",
        "class-methods-use-this": "off",
        eqeqeq: ["warn", "always"],
        "lines-between-class-members": "off",
        "no-console": [
            "warn",
            {
                allow: ["warn", "error", "info"],
            },
        ],
        "no-continue": "off",
        "no-plusplus": "off",
        "no-param-reassign": [
            "warn",
            {
                props: false,
            },
        ],
        "no-restricted-exports": "off",
        "no-unused-vars": "off",
        "spaced-comment": [
            "warn",
            "always",
            {
                markers: ["/"],
            },
        ],
        "arrow-body-style": "off",

        "prettier/prettier": ["warn"],
    },
};
