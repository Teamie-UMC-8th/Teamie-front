/ @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app//.{js,ts,jsx,tsx}', './src/components/**/.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      tablet: { max: '1024px' }, // 1024px 이하일 때만 적용되는 커스텀 브레이크포인트
    },
  },
  plugins: [],
};
