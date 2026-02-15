/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./**/*.{js,ts,jsx,tsx}",
        "../../packages/ui/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                kore: {
                    black: "#0A0A0A",
                    gold: "#C9A84C",
                    silver: "#A8A9AD",
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
