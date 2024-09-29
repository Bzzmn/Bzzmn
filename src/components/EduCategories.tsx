import { useState, useCallback, useRef, useEffect } from 'react'
import { categories } from '../data/categories'
import CloseIcon from './icons/ClosingIcon'

type Category = {
    name: string;
    elements: {
        type: string;
        institution: string;
        logo: string;
        program: string;
        date: string;
        certificate: string;
    }[];
};

interface FlipCardProps {
    category: Category;
    index: number;
    isFlipped: boolean;
    onFlip: (index: number) => void;
}

const FlipCard: React.FC<FlipCardProps> = ({ category, index, isFlipped, onFlip }) => {
    const cardRef = useRef(null);
    const innerRef = useRef(null);

    useEffect(() => {
        if (isFlipped && cardRef.current && innerRef.current) {
            const card = cardRef.current as HTMLElement;
            const inner = innerRef.current as HTMLElement;
            // Resize the card to 80vw and 80vh
            if (inner) {

                inner.classList.add('flipped-card');
                inner.style.width = '90vw';
                inner.style.height = '90vh';
                inner.style.maxWidth = '640px';
                inner.style.maxHeight = '500px';
                card.style.zIndex = '9998';
            }

            // Force a reflow to ensure the new size is applied
            // void inner.offsetWidth;

            const rect = inner.getBoundingClientRect();

            // Calculate the scrollbar width
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            // Calculate the center of the viewport, accounting for scrollbar
            const viewportCenterX = (window.innerWidth - scrollbarWidth) / 2;
            const viewportCenterY = window.innerHeight / 2;
            const viewportTop = window.scrollY

            // Calculate the center of the resized card
            // const offset = window.innerWidth * 0.8
            const offsetX = window.innerWidth * 0.9 > 640 ? 640 : window.innerWidth * 0.9
            const offsetY = window.innerHeight * 0.9 > 500 ? 500 : window.innerHeight * 0.9
            const cardCenterX = rect.left + offsetX / 2;
            const cardCenterY = rect.top + offsetY / 2;
            const cardTop = rect.top + viewportTop

            // Calculate the translation needed to center the card
            const translateX = viewportCenterX - cardCenterX;
            // const translateY = cardCenterY - (viewportCenterY);
            const translateY = cardTop - viewportTop - 100

            // Apply the transformation to center the card
            inner.style.transform = `rotateX(180deg) translate(${translateX}px, ${translateY}px)`;



        } else if (innerRef.current) {
            const inner = innerRef.current as HTMLElement;
            inner.classList.remove('flipped-card');

            inner.style.transform = '';
            inner.style.width = '';
            inner.style.height = '';
            setTimeout(() => {
                if (cardRef.current) {
                    const card = cardRef.current as HTMLElement;
                    card.style.zIndex = '10';
                }
            }, 300);

        }
    }, [isFlipped]);

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFlip(index);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFlip(index);
    };

    const formatDate = (dateString: string) => {
        const [month, year] = dateString.split(' ');
        return (
            <div className="flex flex-col items-center">
                <span className="text-xs font-medium">{month}</span>
                <span className="text-sm font-medium">{year}</span>
            </div>
        );
    };


    return (
        <div
            ref={cardRef}
            className={`flip-card h-[200px] [perspective:3000px] transition-transform duration-600 cursor-pointer z-10  ${isFlipped ? 'flipped z-[9999]' : ''}`}
        >
            <div ref={innerRef} className="flip-card-inner relative w-full h-full text-center transition-transform duration-600 [transform-style:preserve-3d]">
                <div
                    className="flip-card-front absolute w-full h-full backface-hidden transition-transform duration-600 bg-primary text-primary-foreground flex items-center justify-center p-4 rounded-lg shadow-md hover:bg-[#FF00FF] hover:scale-105 bg-[#3b82f6]"
                    onClick={handleCardClick}
                >
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                </div>
                <div
                    className="flip-card-back absolute w-full h-full backface-hidden [transform:rotateX(180deg)] p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 overflow-auto text-gray-500 dark:text-gray-400"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CloseIcon
                        className="absolute top-4 right-4 w-6 h-6 cursor-pointer text-current"
                        onClick={handleClose}
                    />
                    <h3 className="text-lg font-semibold pt-6 mb-6">{category.name} Certificates:</h3>
                    <div className="flex flex-col space-y-4">
                        {category.elements.map((element, index) => (
                            <div key={index} className="grid grid-cols-5 gap-2 items-center me-4">
                                <div className="text-sm font-medium text-center">
                                    {formatDate(element.date)}
                                </div>
                                <div className="col-span-3 flex items-center space-x-2">
                                    <div className="relative group">
                                        <img
                                            src={element.logo}
                                            alt={element.institution}
                                            className="image min-w-10 min-h-10 w-10 h-10 rounded-full object-cover"
                                        />
                                        <span className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-2 bg-gray-800 dark:bg-white dark:text-gray-800 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-wrap">
                                            {element.institution}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-left">{element.program}</span>
                                </div>
                                <div>
                                    <a
                                        href={element.certificate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 px-2 rounded"
                                    >
                                        Certificate
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function EduCategories() {
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

    const handleFlip = useCallback((index: number) => {
        setFlippedIndex(prevIndex => prevIndex === index ? null : index)
    }, [])

    return (
        <div className="categories-container relative w-full">
            <div id="edu-categories" className="relative w-full">
                <div
                    className={`fixed inset-0 z-[9998] overlay ${flippedIndex !== null ? 'active' : ''}`}
                    onClick={(e) => e.preventDefault()}
                ></div>
                <div className="mx-auto w-full relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] ">
                        {categories.map((category, index) => (
                            <FlipCard
                                key={category.name}
                                category={category}
                                index={index}
                                isFlipped={flippedIndex === index}
                                onFlip={handleFlip}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}