// Official Mount Sinai Health System logo
// Brand colors: Vivid Cerulean (#06ABEB), Barbie Pink (#DC298D), St. Patrick's Blue (#212070)

interface MountSinaiLogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export function MountSinaiLogo({ className = 'h-12', variant = 'full' }: MountSinaiLogoProps) {
  if (variant === 'icon') {
    return (
      <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Intersecting lines representing connections - Mount Sinai's core brand element */}
        <g>
          {/* Cyan diagonal line */}
          <path
            d="M10 30 L90 70"
            stroke="#06ABEB"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Magenta diagonal line */}
          <path
            d="M10 70 L90 30"
            stroke="#DC298D"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Violet intersection (created by overlap) */}
          <circle cx="50" cy="50" r="8" fill="#7B2D8E" />
        </g>
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
      {/* Icon */}
      <g transform="translate(0, 0)">
        {/* Cyan diagonal */}
        <path
          d="M10 30 L50 50"
          stroke="#06ABEB"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Magenta diagonal */}
        <path
          d="M10 50 L50 30"
          stroke="#DC298D"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>

      {/* Text */}
      <g>
        <text
          x="70"
          y="35"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="24"
          fontWeight="700"
          fill="#212070"
        >
          MOUNT SINAI
        </text>
        <text
          x="70"
          y="58"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="16"
          fontWeight="400"
          fill="#212070"
        >
          HEALTH SYSTEM
        </text>
      </g>
    </svg>
  );
}
