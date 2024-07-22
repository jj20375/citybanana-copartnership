const colors = require("tailwindcss/colors");
import type { Config } from "tailwindcss";
const config: Config = {
    content: ["./layouts/**/*.{js,ts,jsx,tsx,mdx}", "./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
        colors: {
            transparent: "transparent",
            current: "currentColor",
            black: colors.black,
            white: colors.white,
            red: {
                50: "#ead7d7",
                100: "#eac0c0",
                200: "#ea9f9f",
                300: "#ea8888",
                400: "#ea6768",
                500: "#FB4F3B",
                600: "#FF3550",
                700: "#c73949",
                800: "#ad3240",
                900: "#8a2833",
            },
            // yellow: colors.amber,
            yellow: {
                50: "#fffff5",
                100: "#ffffe9",
                200: "#ffffcf",
                300: "#ffffc1",
                400: "#ffe991",
                500: "#ffd200",
                600: "#ffc100",
                700: "#dba600",
                800: "#c49500",
                900: "#a88000",
            },
            orange: {
                50: "#ffefdb",
                100: "#ffe6c7",
                200: "#ffd5a1",
                300: "#ffbc69",
                400: "#ffaf4d",
                500: "#ffa333",
                600: "#ff5733",
                700: "#d17400",
                800: "#b36300",
                900: "#8f4f00",
            },
            green: {
                100: "#CCFFE6",
                200: "#B3FFD9",
                300: "#99FFCC",
                400: "#66FFB3",
                500: "#47B36B",
                600: "#24B354",
                700: "#1F9948",
                800: "#156630",
                900: "#104D24",
            },
            blue: {
                50: "#f2f2f2",
                100: "#eaeef2",
                200: "#d3e2f2",
                300: "#accff2",
                400: "#8cbff2",
                500: "#67B0F0",
                600: "#51AAF8",
                700: "#1F86E3",
                800: "#3071ab",
                900: "#265987",
            },
            purple: {
                50: "#f2f2f2",
                100: "#eaeef2",
                200: "#B2ADF0",
                300: "#9890F0",
                400: "#8378F0",
                500: "#1C4BDB",
                600: "#4A3DCC",
                700: "#291F99",
                800: "#160D80",
                900: "#0A0073",
            },
            gray: {
                50: "#f5f5f5",
                100: "#e5e5e5",
                200: "#d1d1d1",
                300: "#b2b2b2",
                400: "#909090",
                500: "#666666",
                600: "#4d4d4d",
                700: "#757575",
                800: "#2C2C2C",
                900: "#0d0d0d",
            },
            pink: {
                500: "#FB3C9C",
            },
            indigo: colors.indigo,
            pink: colors.pink,
        },
        spacing: {
            px: "1px",
            0: "0px",
            0.5: "0.125rem",
            1: "0.25rem",
            1.5: "0.375rem",
            2: "0.5rem",
            2.5: "0.625rem",
            3: "0.75rem",
            3.5: "0.875rem",
            4: "1rem",
            5: "1.25rem",
            6: "1.5rem",
            7: "1.75rem",
            8: "2rem",
            9: "2.25rem",
            10: "2.5rem",
            11: "2.75rem",
            12: "3rem",
            14: "3.5rem",
            16: "4rem",
            20: "5rem",
            24: "6rem",
            28: "7rem",
            32: "8rem",
            36: "9rem",
            40: "10rem",
            44: "11rem",
            48: "12rem",
            52: "13rem",
            56: "14rem",
            60: "15rem",
            64: "16rem",
            72: "18rem",
            80: "20rem",
            96: "24rem",
        },
    },
    plugins: [],
};
export default config;
