'use client';
import { useRef, useState } from 'react';
import LinkedinIcon from './icons/LinkedinIcon.tsx';
import GithubIcon from './icons/GithubIcon.tsx';
import MailIcon from './icons/MailIcon.tsx';
import DownloadIcon from './icons/DownloadIcon.tsx';

import type { Options as ConfettiOptions } from 'canvas-confetti';
import confetti from 'canvas-confetti';

interface ButtonProps {
    text: string;
    iconId: string;
    href: string;
    pdf?: string;
}

const icons: any = {
    linkedin: LinkedinIcon,
    github: GithubIcon,
    mail: MailIcon,
    download: DownloadIcon,
};

const ButtonAnimatedGradient = ({ text, iconId, href, pdf }: ButtonProps) => {
    const IconComponent = icons[iconId];

    const divRef = useRef<HTMLButtonElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!divRef.current || isFocused) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };


    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Get the button's position
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        // Trigger confetti from the button's position
        confetti({
            particleCount: 200,
            spread: 50,
            origin: { x, y },
            gravity: 1,
            startVelocity: 80,
            ticks: 600,
            angle: 110,
        });

        // Trigger download
        if (pdf) {
            const link = document.createElement('a');
            link.href = href;
            link.download = pdf;
            link.click();
        }
    };

    return (
        <button
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className='relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-gray-800 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-6 font-medium text-gray-300 shadow-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50'
        >
            <div
                className='pointer-events-none absolute -inset-px opacity-0 transition duration-300'
                style={{
                    opacity,
                    background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.1), #0000000f)`,
                }}
            />
            <div className='flex gap-2 items-center'>
                {IconComponent ? <IconComponent /> : null} {text}
            </div>
        </button>
    );
};

export default ButtonAnimatedGradient;
