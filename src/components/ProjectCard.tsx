import React from 'react';
import { useState } from 'react';

interface ProjectProps {
    title: string;
    description: string;
    link: string;
    techs: string[];
    repolink: string;
    image: string;
    lang?: string;
}

export default function ProjectCard({ title, description, link, techs, repolink, image, lang = "en" }: ProjectProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const truncateDescription = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + ' ...';
    };

    // Textos traducidos para los botones
    const buttonTexts = {
        en: {
            readMore: "Read more",
            showLess: "Show less",
            visitSite: "Visit site",
            viewCode: "View code",
            projectOnline: "Project is online"
        },
        es: {
            readMore: "Leer más",
            showLess: "Ver menos",
            visitSite: "Visitar sitio",
            viewCode: "Ver código",
            projectOnline: "Proyecto en línea"
        }
    };

    // Obtener los textos según el idioma actual
    const texts = buttonTexts[lang as keyof typeof buttonTexts] || buttonTexts.en;

    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col transform transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-lg">
            <div className="relative">
                <div 
                    className="absolute top-3 right-3 z-10 group"
                    title={texts.projectOnline}
                >
                    <div className="w-3 h-3 bg-green-500 rounded-full relative">
                        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                    </div>
                    <div className="invisible group-hover:visible absolute -top-1 right-5 w-28 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {texts.projectOnline}
                    </div>
                </div>
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <img className="rounded-t-lg w-full h-48 object-cover" src={image} alt={title} />
                </a>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {title}
                    </h5>
                </a>
                <div className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {isExpanded ? description : truncateDescription(description)}
                    {description.length > 100 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 ml-1 focus:outline-none"
                        >
                            {isExpanded ? texts.showLess : texts.readMore}
                        </button>
                    )}
                </div>
                <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {techs.map((tech) => (
                            <span
                                key={tech}
                                className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2">
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                        >
                            {texts.visitSite}
                            <svg
                                className="w-3.5 h-3.5 ml-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 10"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 5h12m0 0L9 1m4 4L9 9"
                                />
                            </svg>
                        </a>
                        <a
                            href={repolink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-purple-700 border border-purple-700 rounded-lg hover:bg-purple-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:border-purple-600 dark:text-purple-600 dark:hover:text-white dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                        >
                            {texts.viewCode}
                            <svg
                                className="w-3.5 h-3.5 ml-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
} 