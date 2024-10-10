import { nextui } from "@nextui-org/theme"
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src-next/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src-next/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|checkbox|chip|divider|input|table|ripple|spinner|spacer).js"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [nextui()],
}
export default config
