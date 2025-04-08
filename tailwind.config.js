/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        {
            pattern: /^col-span-/, // Bu pattern col-span- ilə başlayan bütün class-ları qoruyacaq
            variants: ['sm', 'md', 'lg', 'xl', '2xl', 'hover', 'dark'], // Responsive variantları da əlavə edə bilərsiniz
        }
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#5F45D3",
                    extraLight: '#E6EAF5',
                    dark: '#200164'
                },
                secondary: "#EE3760",
            },
            fontSize: {
                '13': '13px',
                '14': '14px'
            },
            boxShadow: {
                theme: '0px 2px 8px 0px #806B4E1A;',
                light: '4px 0 10px rgba(0, 0, 0, 0.05);',
                table: '0 2px 8px rgb(12 70 61 / 0.03)',
                header: '0 2px 4px rgb(0 0 0 / 0.02)',
                subtle: '0 2px 6px rgb(12 26 38 / 0.02)',
                soft: '0 2px 8px rgb(12 26 38 / 0.04)',
                medium: '0 4px 12px rgb(12 26 38 / 0.06)',
                deep: '0 6px 16px rgb(12 26 38 / 0.08)',
                bottom: '0 2px 4px rgb(12 26 38 / 0.03)',
                sides: '2px 0 8px rgb(12 26 38 / 0.03), -2px 0 8px rgb(12 26 38 / 0.03)'
            }
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.border-color': {'@apply border-[#D7D7D7] dark:border-[#363738]': {}},
                '.divide-color': {'@apply divide-[#D7D7D7] dark:divide-[#363738]': {}},
                '.border-color-dark': {'@apply border-[#C9CACB] dark:border-[#303132]': {}},
                '.theme-text': {'@apply text-[#212b37] dark:!text-[#d5d5d6]': {}},
                '.theme-text-mute': {'@apply text-[#6e829f] dark:!text-[#8c8c8e]': {}},
                '.dark-bg-main': {'@apply dark:!bg-[#181819]': {}},
                '.dark-bg-light': {'@apply dark:!bg-[#242525]': {}},
                '.dark-bg-light-mute': {'@apply dark:!bg-[#303132]': {}},
                '.dark-secondary': {'@apply dark:!bg-[#303132]': {}},
            })
        }
    ],
}

