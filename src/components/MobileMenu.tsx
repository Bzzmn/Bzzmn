import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useState, useEffect } from 'react'
import ThemeToggler from './ThemeToggler'
import { languages } from '../i18n/languages'
import { ui } from '../i18n/ui'

interface MobileMenuProps {
    lang: string;
}

const MobileMenu = ({ lang = "en" }: MobileMenuProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentHash, setCurrentHash] = useState('')
    
    // Acceder a window solo en el cliente
    useEffect(() => {
        setCurrentHash(window.location.hash)
    }, [])
    
    const t = (key: string) => {
        const langUI = ui[lang as keyof typeof ui] || ui.en;
        return langUI[key as keyof typeof langUI];
    }

    const handleNavClick = () => {
        setIsOpen(false)
    }

    const menuAnimation = useSpring({
        transform: isOpen ? 'translateX(0%)' : 'translateX(-100%)',
        opacity: isOpen ? 1 : 0,
        config: { tension: 250, friction: 20 }
    })

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
            >
                <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h15M1 7h15M1 13h15"
                    />
                </svg>
            </button>

            <animated.div
                style={menuAnimation}
                className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg md:hidden z-50 flex flex-col"
            >
                <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    
                    <ul className="space-y-4 flex-grow">
                        <li>
                            <a
                                href={`/${lang}#experience`}
                                className="block py-2 text-gray-900 dark:text-white hover:text-purple-500 dark:hover:text-purple-400"
                                onClick={handleNavClick}
                            >
                                {t('nav.experience')}
                            </a>
                        </li>
                        <li>
                            <a
                                href={`/${lang}#projects`}
                                className="block py-2 text-gray-900 dark:text-white hover:text-purple-500 dark:hover:text-purple-400"
                                onClick={handleNavClick}
                            >
                                {t('nav.projects')}
                            </a>
                        </li>
                        <li>
                            <a
                                href={`/${lang}#education`}
                                className="block py-2 text-gray-900 dark:text-white hover:text-purple-500 dark:hover:text-purple-400"
                                onClick={handleNavClick}
                            >
                                {t('nav.education')}
                            </a>
                        </li>
                        <li>
                            <a
                                href={`/${lang}#resume`}
                                className="block py-2 text-gray-900 dark:text-white hover:text-purple-500 dark:hover:text-purple-400"
                                onClick={handleNavClick}
                            >
                                {t('nav.resume')}
                            </a>
                        </li>
                    </ul>
                    
                    {/* Opciones de idioma y tema al final del menú */}
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                {lang === "es" ? "Idioma" : "Language"}
                            </span>
                            <div className="flex gap-2">
                                {Object.entries(languages).map(([code, name]) => (
                                    <a 
                                        key={code}
                                        href={`/${code}${currentHash}`}
                                        className={`px-2 py-1 rounded text-xs transition-colors duration-200 
                                            ${code === lang 
                                                ? 'bg-purple-600 text-white font-medium' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                        onClick={handleNavClick}
                                    >
                                        {name}
                                    </a>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                {lang === "es" ? "Tema" : "Theme"}
                            </span>
                            <ThemeToggler variant="full" />
                        </div>
                    </div>
                </div>
            </animated.div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}

export default MobileMenu 