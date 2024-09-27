const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
const themeToggler = document.getElementById('theme-toggler');
const bgDark = document.getElementById('bg-dark');
const bgLight = document.getElementById('bg-light');
// Initialize icons based on theme
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon?.classList.remove('hidden');
    themeToggleDarkIcon?.classList.add('hidden');
    if (bgDark && bgLight) {
        bgDark.style.opacity = "1";
        bgLight.style.opacity = "0";
    }

} else {
    themeToggleDarkIcon?.classList.remove('hidden');
    themeToggleLightIcon?.classList.add('hidden');
    if (bgDark && bgLight) {
        bgDark.style.opacity = "0";
        bgLight.style.opacity = "1";
    }
}

function toggleTheme() {
    themeToggleDarkIcon?.classList.toggle('hidden');
    themeToggleLightIcon?.classList.toggle('hidden');

    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            if (bgDark && bgLight) {
                    bgDark.style.opacity = "1";
                    bgLight.style.opacity = "0";
                }
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            if (bgDark && bgLight) {
                    bgDark.style.opacity = "0";
                    bgLight.style.opacity = "1";
                }
        }
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            if (bgDark && bgLight) {
                    bgDark.style.opacity = "0";
                    bgLight.style.opacity = "1";
                }
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            if (bgDark && bgLight) {
                    bgDark.style.opacity = "1";
                    bgLight.style.opacity = "0";
                }
        }
    }
}

themeToggler?.addEventListener('change', toggleTheme);