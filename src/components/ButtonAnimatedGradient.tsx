'use client';
import { useRef, useState } from 'react';
import LinkedinIcon from './icons/LinkedinIcon.tsx';
import GithubIcon from './icons/GithubIcon.tsx';
import MailIcon from './icons/MailIcon.tsx';
import DownloadIcon from './icons/DownloadIcon.tsx';

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

  return (
    <a
      href={href}
      target='_blank'
      download={pdf || undefined}
      rel="noopener noreferrer"
    >
      <button
        ref={divRef}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-gray-800 bg-gradient-to-r from-gray-900 to-gray-950 px-6 font-medium text-gray-300 shadow-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50'
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
    </a>
  );
};

export default ButtonAnimatedGradient;
