/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '.src/renderer/src/index.html',
    './src/renderer/src/**/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      translate: {
        centerx: '-50%',
      },
      minWidth: {
        leftBar: '50px',
      },
      maxWidth: {
        leftBar: '50px',
      },
      colors: {
        border: 'rgba(255, 255, 255, 0.60)',
        void: '#272823',
        explorer: {
          inputs: '#262626',
        },
        folders: {
          hover: 'rgba(255,255,255,0.1)',
        },
        console: {
          background: '#1E1E1E',
          blue: '#0862B6',
        },
        input: {
          background: '#404040',
        },
        button: {
          blue: '#0862B6',
        },
        leftbar: {
          dark: '#242424',
        },
      },
    },
  },
  plugins: [],
}
