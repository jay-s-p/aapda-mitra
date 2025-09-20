import React from 'react';

// This component now displays the user-provided logo from a URL.
export const LogoIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
    <img 
        src="https://th.bing.com/th/id/OIG4.q9FiBZfGX6CzSNx_PFbK?pid=ImgGn"
        alt="Aapda Mitra Logo"
        className={className}
    />
);