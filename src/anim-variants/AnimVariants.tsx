export const slideRight = {
    start: { x: -240 },
    end: { x: 0 },
}

export const slideLeft = {
    start: { x: 1400 },
    end: { x: 1122 },
}

export const fadeIn = {
    start: { opacity: 0 },
    end: { opacity: 1 },
}

export const fadeUp = {
    start: { opacity: 0, y: 30 },
    end: { opacity: 1, y: 0 },
}

export const fadeUpStaggered = {
    start: { opacity: 0, y: 10 },
    end: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
}
