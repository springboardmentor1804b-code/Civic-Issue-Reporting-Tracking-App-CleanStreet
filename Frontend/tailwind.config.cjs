/** @type {import('tailwindcss').Config} */
module.exports = {
  // This array tells Tailwind which files to scan for class names (like 'md:flex' or 'bg-[#B77A4D]')
  content: [
    "./index.html",
    // This path targets all your React components in the 'src' directory.
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    // You can customize colors, fonts, spacing, etc., here.
    extend: {},
  },
  plugins: [],
}