import { Period } from './types';

// The four main geological eons of Earth's history, from oldest to most recent
export const GEOLOGICAL_EONS: Period[] = [
     // Level 0 - Eons
    {
        name: "Hadean",
        startYear: 4600000000,  // 4.6 billion years ago
        endYear: 4000000000,    // 4.0 billion years ago
        color: "rgb(207, 70, 70, 0.75)",
        level: 0
    },
    {
        name: "Archean",
        startYear: 4000000000,  // 4.0 billion years ago
        endYear: 2500000000,    // 2.5 billion years ago
        color: "rgb(147, 196, 125, 0.75)",
        level: 0
    },
    {
        name: "Proterozoic",
        startYear: 2500000000,  // 2.5 billion years ago
        endYear: 541000000,     // 541 million years ago
        color: "rgb(63, 158, 126, 0.75)",
        level: 0
    },
    {
        name: "Phanerozoic",
        startYear: 541000000,
        endYear: 0,
        color: "rgb(90, 210, 115, 0.75)",
        level: 0
    },
    // Level 1 - Eras
    {
        name: "Paleozoic",
        startYear: 541000000,
        endYear: 251900000,
        color: "rgb(145, 72, 182, 0.75)",
        level: 1
    },
    {
        name: "Mesozoic",
        startYear: 251900000,
        endYear: 66000000,
        color: "rgb(199, 88, 199, 0.75)",
        level: 1
    },
    {
        name: "Cenozoic",
        startYear: 66000000,
        endYear: 0,
        color: "rgb(219, 130, 222, 0.75)",
        level: 1
    },
    // Level 2 - Periods within Cenozoic
    {
        name: "Paleogene",
        startYear: 66000000,
        endYear: 23030000,
        color: "rgb(165, 92, 56, 0.75)", // #A55C38
        level: 2
    },
    {
        name: "Neogene",
        startYear: 23030000,
        endYear: 2580000,
        color: "rgb(190, 122, 65, 0.75)", // #BE7A41
        level: 2
    },
    {
        name: "Quaternary",
        startYear: 2580000,
        endYear: 0,
        color: "rgb(209, 167, 82, 0.75)", // #D1A752
        level: 2
    },
    // Level 3 - Epochs within Quaternary
    {
        name: "Pleistocene",
        startYear: 2580000,
        endYear: 11700,
        color: "rgb(63, 158, 126, 0.75)", // #3F9E7E
        level: 3
    },
    {
        name: "Holocene",
        startYear: 11700,
        endYear: 0,
        color: "rgb(52, 168, 83, 0.75)", // #34a853
        level: 3
    },
    // Level 4 - Ages within Holocene
    {
        name: "Greenlandian",
        startYear: 11700,
        endYear: 8200,
        color: "rgb(199, 88, 199, 0.75)", // #C758C7
        level: 4
    },
    {
        name: "Northgrippian",
        startYear: 8200,
        endYear: 4200,
        color: "rgb(236, 111, 158, 0.75)", // #EC6F9E
        level: 4
    },
    {
        name: "Meghalayan",
        startYear: 4200,
        endYear: 0,
        color: "rgb(239, 121, 121, 0.75)", // #EF7979
        level: 4
    }
];