import React, { useState } from 'react';

interface ExperienceProps {
    title: string;
    company: string;
    period: string;
    description: string | string[];
    logo?: string;
}

function ExperienceEntry({ title, company, period, description }: ExperienceProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="relative border-s border-gray-200 dark:border-gray-700 ms-3 ps-8 mb-10 last:mb-0">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-purple-900">
                <svg className="w-2.5 h-2.5 text-purple-800 dark:text-purple-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                </svg>
            </span>
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {title} at {company}
                </h3>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {period}
            </time>
            <div 
                className={`text-base font-normal text-gray-500 dark:text-gray-400 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <p className="ps-4">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function Experience({ experiences }: { experiences: ExperienceProps[] }) {
    return (
        <div className="relative">
            {experiences.map((exp, index) => (
                <ExperienceEntry 
                    key={index} 
                    {...exp} 
                />
            ))}
        </div>
    );
} 