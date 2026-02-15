/** @type {import('tailwindcss').Config} */
const sharedConfig = require("../../packages/ui/tailwind.config");

module.exports = {
    ...sharedConfig,
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "../../packages/ui/**/*.{js,ts,jsx,tsx}"
    ],
};
