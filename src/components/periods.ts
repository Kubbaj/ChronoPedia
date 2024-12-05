import { Period } from './types';

export const GEOLOGICAL_EONS: Period[] = [
    // Level 0 - Cosmological Epochs
    {
        name: "BIG BANG",
        startYear: 13800000000,    // ~13.8B
        endYear: 13799620000,      // 13.79B
        color: "rgba(243, 243, 13, 0.75)",
        level: 0
    },
    {
        name: "Dark Ages",
        startYear: 13799620000,    // ~13.79B
        endYear: 13650000000,      // 13B
        color: "rgba(67, 67, 67, 0.75)", // #434343
        level: 0
    },
    {
        name: "Star Formation Period",
        startYear: 13650000000,    // 13B
        endYear: 0,      // 10B
        color: "rgba(28, 69, 135, 0.75)", // #1C4587
        level: 0
    },
    // Level 1 - Stellar Periods
    {
        name: "Cosmic Dawn",
        startYear: 13650000000,    // 13B
        endYear: 13000000000,      // 10B
        color: "rgba(238, 138, 190, 0.75)", // #EE8ABE
        level: 1
    },
    {
        name: "Cosmic Morning",
        startYear: 13000000000,    // 10B
        endYear: 10000000000,       // 9B
        color: "rgba(255, 217, 102, 0.75)", // #FFD966
        level: 1
    },
    {
        name: "Cosmic Noon",
        startYear: 10000000000,     // 9B
        endYear: 9000000000,       // 5B
        color: "rgba(246, 178, 107, 0.75)", // #F6B26B
        level: 1
    },
    {
        name: "Cosmic Afternoon",
        startYear: 9000000000,     // 5B
        endYear: 0,                // Present
        color: "rgba(250, 133, 109, 0.75)", // #FA856D
        level: 1
    },
    // Level 2 - Geological Eons (moved from level 0)
    {
        name: "Hadean",
        startYear: 4567000000,  // 4.6B
        endYear: 4031000000,    // 4.0B
        color: "rgba(207, 70, 70, 0.75)",
        level: 2
    },
    {
        name: "Archean",
        startYear: 4031000000,  // 4.0B
        endYear: 2500000000,    // 2.5B
        color: "rgba(147, 196, 125, 0.75)",
        level: 2
    },
    {
        name: "Proterozoic",
        startYear: 2500000000,  // 2.5B
        endYear: 541000000,     // 541M
        color: "rgba(63, 158, 126, 0.75)",
        level: 2
    },
    {
        name: "Phanerozoic",
        startYear: 541000000,   // 541M
        endYear: 0,             // Present
        color: "rgba(90, 210, 115, 0.75)",
        level: 2
    },
    // Level 3 - Eras (moved from level 1)
    {
        name: "Paleozoic",
        startYear: 541000000,
        endYear: 251900000,
        color: "rgba(145, 72, 182, 0.75)",
        level: 3
    },
    {
        name: "Mesozoic",
        startYear: 251900000,
        endYear: 66000000,
        color: "rgba(199, 88, 199, 0.75)",
        level: 3
    },
    {
        name: "Cenozoic",
        startYear: 66000000,
        endYear: 0,
        color: "rgba(219, 130, 222, 0.75)",
        level: 3
    },
    // Level 4 - Periods (moved from level 2)
    {
        name: "Paleogene",
        startYear: 66000000,
        endYear: 23030000,
        color: "rgba(165, 92, 56, 0.75)", // #A55C38
        level: 4
    },
    {
        name: "Neogene",
        startYear: 23030000,
        endYear: 2580000,
        color: "rgba(190, 122, 65, 0.75)", // #BE7A41
        level: 4
    },
    {
        name: "Quaternary",
        startYear: 2580000,
        endYear: 0,
        color: "rgba(209, 167, 82, 0.75)", // #D1A752
        level: 4
    },
    // Level 5 - Epochs (moved from level 3)
    {
        name: "Pleistocene",
        startYear: 2580000,
        endYear: 11700,
        color: "rgba(63, 158, 126, 0.75)", // #3F9E7E
        level: 5
    },
    {
        name: "Holocene",
        startYear: 11700,
        endYear: 0,
        color: "rgba(52, 168, 83, 0.75)", // #34a853
        level: 5
    },
    // Level 6 - Ages (moved from level 4)
    {
        name: "Greenlandian",
        startYear: 11700,
        endYear: 8200,
        color: "rgba(199, 88, 199, 0.75)", // #C758C7
        level: 6
    },
    {
        name: "Northgrippian",
        startYear: 8200,
        endYear: 4200,
        color: "rgba(236, 111, 158, 0.75)", // #EC6F9E
        level: 6
    },
    {
        name: "Meghalayan",
        startYear: 4200,
        endYear: 0,
        color: "rgba(239, 121, 121, 0.75)", // #EF7979
        level: 6
    }
];