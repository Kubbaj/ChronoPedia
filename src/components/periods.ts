import { Period } from './types';

// The four main geological eons of Earth's history, from oldest to most recent
export const GEOLOGICAL_EONS: Period[] = [
    {
        name: "Hadean",
        startYear: 4600000000,  // 4.6 billion years ago
        endYear: 4000000000,    // 4.0 billion years ago
        color: "rgb(207, 70, 70, 0.5)",
        level: 0
    },
    {
        name: "Archean",
        startYear: 4000000000,  // 4.0 billion years ago
        endYear: 2500000000,    // 2.5 billion years ago
        color: "rgb(147, 196, 125, 0.5)",
        level: 0
    },
    {
        name: "Proterozoic",
        startYear: 2500000000,  // 2.5 billion years ago
        endYear: 541000000,     // 541 million years ago
        color: "rgb(63, 158, 126, 0.5)",
        level: 0
    },
    {
        name: "Phanerozoic",
        startYear: 541000000,   // 541 million years ago
        endYear: 0,             // Present
        color: "rgb(90, 210, 115, 0.5)",
        level: 0
    }
];