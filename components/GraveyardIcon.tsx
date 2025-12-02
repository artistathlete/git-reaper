interface GraveyardIconProps {
  size?: number;
  className?: string;
}

export default function GraveyardIcon({ size = 16, className = '' }: GraveyardIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* Ground/grass layer */}
      <rect x="0" y="13" width="16" height="3" fill="currentColor" opacity="0.2"/>
      
      {/* Tombstone body - filled with rounded top */}
      <path 
        d="M4 13 L4 6 Q4 3 8 3 Q12 3 12 6 L12 13 Z" 
        fill="currentColor"
        opacity="0.8"
      />
      
      {/* Tombstone outline */}
      <path 
        d="M4 13 L4 6 Q4 3 8 3 Q12 3 12 6 L12 13" 
        stroke="currentColor" 
        strokeWidth="0.8"
        fill="none"
      />
      
      {/* RIP Text */}
      <text 
        x="8" 
        y="7.5" 
        fontSize="3.5" 
        fontWeight="bold" 
        fill="currentColor" 
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        RIP
      </text>
      
      {/* Small grass tufts */}
      <line x1="2" y1="13" x2="2" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      <line x1="14" y1="13" x2="14" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
    </svg>
  );
}
