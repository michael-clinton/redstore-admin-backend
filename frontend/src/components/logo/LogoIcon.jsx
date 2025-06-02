// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shop Icon */}
      <rect x="10" y="15" width="40" height="30" fill="#ff4d4f" rx="4" />
      <rect x="12" y="12" width="36" height="10" fill="#d9363e" rx="2" />
      <rect x="18" y="25" width="8" height="12" fill="#fff" rx="1" />
      <rect x="34" y="25" width="8" height="12" fill="#fff" rx="1" />
    </svg>
  );
}
