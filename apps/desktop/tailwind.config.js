/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000",
                foreground: "#F5F5F7",
                card: "#1C1C1E",
                sidebar: "#0A0A0A",
                gold: "#D4AF37",
                "gold-dim": "rgba(212, 175, 55, 0.1)",
                silver: "#98989D",
                green: "#30D158",
                red: "#FF453A",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
