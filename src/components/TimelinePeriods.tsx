import React from 'react';
import { Period } from './types';

interface TimelinePeriodsProps {
    zoomLevel: number;
    periods?: Period[];
}

const TimelinePeriods: React.FC<TimelinePeriodsProps> = ({ 
    zoomLevel, 
    periods = []
}) => {
    const LEVEL_YEAR_THRESHOLDS = {
        0: 13800000000,
        1: 700000000,
        2: 90000000,
        3: 4000000,
        4: 20000
    };

    const getVisibleLevels = () => {
        const viewportRightYear = 13800000000 / zoomLevel;
        return Object.entries(LEVEL_YEAR_THRESHOLDS)
            .filter(([_, thresholdYear]) => viewportRightYear <= thresholdYear)
            .map(([level]) => parseInt(level));
    };

    const visibleLevels = getVisibleLevels();

    const getPeriodHeight = (level: number): string => {
        const baseHeight = 16; // Base height in units (equivalent to h-16)
        
        // If this level isn't visible yet, no height
        if (!visibleLevels.includes(level)) {
            return 'h-0';
        }

        // Count levels that appeared after this one
        const newerLevels = visibleLevels.filter(visibleLevel => 
            LEVEL_YEAR_THRESHOLDS[visibleLevel] < LEVEL_YEAR_THRESHOLDS[level]
        ).length;

        // Each newer level increases height by 50%
        const expansion = newerLevels * 0.5;
        const heightMultiplier = 1 + expansion;
        
        // Convert to tailwind height class (rounded to nearest available class)
        const height = Math.round(baseHeight * heightMultiplier);
        return `h-${height}`;
    };

    return (
        <div className="absolute inset-0 pointer-events-none">
            {periods.map((period, index) => {
                const rightPos = (period.endYear / 13800000000 * 100);
                const leftPos = (period.startYear / 13800000000 * 100);
                const scaledRightPos = rightPos * zoomLevel;
                const scaledLeftPos = leftPos * zoomLevel;
                const width = Math.abs(scaledLeftPos - scaledRightPos);
                
                const isVisible = visibleLevels.includes(period.level);
                
                return (
                    <div
                        key={index}
                        className={`absolute rounded-sm flex items-start 
                                  text-xs font-medium transition-all duration-200
                                  ${getPeriodHeight(period.level)}`}
                        style={{
                            right: `${scaledRightPos}%`,
                            width: `${width}%`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: period.color,
                            opacity: isVisible && width >= 0.1 ? 1 : 0,
                            display: scaledRightPos > 100 ? 'none' : 'flex'
                        }}
                    >
                        <span className="p-1 truncate">
                            {period.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default TimelinePeriods;