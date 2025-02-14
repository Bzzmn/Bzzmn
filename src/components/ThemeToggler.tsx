import { useState, useEffect } from 'react'

const ThemeToggler = () => {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'))
        updateBackground(document.documentElement.classList.contains('dark'))
    }, [])

    const updateBackground = (isDark: boolean) => {
        const bgDark = document.querySelector('.bg-dark') as HTMLElement
        const bgLight = document.querySelector('.bg-light') as HTMLElement

        if (bgDark && bgLight) {
            bgDark.style.opacity = isDark ? '1' : '0'
            bgLight.style.opacity = isDark ? '0' : '1'
        }
    }

    const handleThemeToggle = () => {
        const newTheme = !isDark
        setIsDark(newTheme)
        document.documentElement.classList.toggle('dark')
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
        updateBackground(newTheme)
    }

    return (
        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
            <svg
                className={`w-5 h-5 ${!isDark ? 'text-yellow-500' : 'text-gray-400'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
            </svg>
            <label className="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={isDark}
                    onChange={handleThemeToggle}
                    className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
            <svg
                className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-400'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
        </div>
    )
}

export default ThemeToggler 