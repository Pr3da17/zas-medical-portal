/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hospital: {
          primary: '#00A5AD', // ZAS Turquoise (Surgical color)
          secondary: '#F0F9FA', // Very light turquoise tint for background
          accent: '#007A80', // Darker turquoise for contrast
          error: '#D32F2F',
        },
        zas: {
          coral: '#FF6B6B',
        },
      },
      spacing: {
        'touch': '60px',
      },
      fontSize: {
        'beginner': '28px',
        'intermediate': '22px',
        'advanced': '18px',
      }
    },
  },
  plugins: [],
}
