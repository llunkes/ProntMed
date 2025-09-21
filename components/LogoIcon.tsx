import React from 'react';

interface IconProps {
    className?: string;
}

const LogoIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="1.5"
    >
        <path 
            d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" 
            stroke="currentColor" 
            strokeMiterlimit="10"
        />
        <path 
            d="M12 8V16" 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <path 
            d="M16 12H8" 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
);

export default LogoIcon;
