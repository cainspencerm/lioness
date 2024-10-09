import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src-next/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src-next/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src-next/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
}
export default config
