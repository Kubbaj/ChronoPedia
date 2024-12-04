// Basic types for the timeline backbone
export type TickLevel = 'maxi' | 'mega' | 'major' | 'minor';

export interface Tick {
    year: number;
    label: string;
    level: TickLevel;
    dotted?: boolean;
}

export interface ScaleSet {
    zoomThreshold: number;
    mega: number;
    major: number;
    minor: number;
}

// New interface for timeline periods
export interface Period {
    name: string;
    startYear: number;
    endYear: number;
    color: string;
    level: number;
}