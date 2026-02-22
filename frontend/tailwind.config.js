/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#f8faf9', // 清新放松的底色
                card: '#ffffff',
                textPrimary: '#2d3748',
                textSecondary: '#718096',
                accent: '#84b6a3', // 莫兰迪绿/牛油果绿
            }
        },
    },
    plugins: [require('@tailwindcss/typography')],
}
