import { useSpring, animated } from '@react-spring/web'
import { useState } from 'react'
import ThemeToggler from './ThemeToggler'

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false)

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
                className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg md:hidden z-50"
            >
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <ul className="font-medium flex flex-col-reverse p-4 mt-16">
                    <li>
                        <div className="py-4 px-3 border-t dark:border-gray-700 mt-4">
                            <ThemeToggler />
                        </div>
                    </li>
                    <li>
                        <a
                            href="#experience"
                            onClick={handleNavClick}
                            className="block py-2 px-3 text-gray-900 dark:text-white hover:text-purple-500 dark:hover:text-purple-700"
                        >
                            Experience
                        </a>
                    </li>
                    <li>
                        <a
                            href="#projects"
                            onClick={handleNavClick}
                            className="block py-2 px-3 text-gray-900 dark:text-white hover:text-purple-500 dark:hover:text-purple-700"
                        >
                            Projects
                        </a>
                    </li>
                    <li>
                        <a
                            href="#education"
                            onClick={handleNavClick}
                            className="block py-2 px-3 text-gray-900 dark:text-white hover:text-purple-500 dark:hover:text-purple-700"
                        >
                            Education & Certifications
                        </a>
                    </li>
                    <li>
                        <a
                            href="#resume"
                            onClick={handleNavClick}
                            className="block py-2 px-3 text-gray-900 dark:text-white hover:text-purple-500 dark:hover:text-purple-700"
                        >
                            Resume
                        </a>
                    </li>
                </ul>
            </animated.div>

            {/* Overlay para cerrar el menú al hacer clic fuera */}
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