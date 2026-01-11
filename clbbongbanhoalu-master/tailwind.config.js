/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#bdffff',
                secondary: '#7AC943',
                accent: '#FFD800',
            },
        },
    },
    plugins: [],
}
