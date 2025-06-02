// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();

  return (
    <div style={{ marginTop: '27px', marginLeft: '0px' }}>
      <svg
        width="250"
        height="80"
        viewBox="0 0 250 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Store Icon */}
        <rect x="20" y="20" width="40" height="30" fill="#1976d2" rx="4" />
        <rect x="22" y="18" width="36" height="10" fill="#115293" rx="2" />
        <rect x="28" y="30" width="8" height="12" fill="#fff" rx="1" />
        <rect x="44" y="30" width="8" height="12" fill="#fff" rx="1" />

        {/* Logo Text */}
        <text
          x="65"
          y="45"
          fontFamily="'Poppins', sans-serif"
          fontSize="30"
          fontWeight="bold"
          fill={theme.palette.mode === 'dark' ? '#fff' : '#333'}
        >
          RedStore
        </text>
      </svg>
    </div>
  );
}
