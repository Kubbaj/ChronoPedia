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
        const baseHeight = 64;
        
        if (!visibleLevels.includes(level)) {
            return '0px';
        }
    
        // Get the lowest (most detailed) visible level
        const lowestVisibleLevel = Math.max(...visibleLevels);
        
        // Calculate steps away from current lowest level
        const stepsFromLowest = lowestVisibleLevel - level;
        
        if (stepsFromLowest <= 0) {
            return `${baseHeight}px`;
        } else if (stepsFromLowest === 1) {
            return `${baseHeight * 1.6}px`;
        } else {
            const expansion = 1.6 + ((stepsFromLowest - 1) * 0.3);
            return `${baseHeight * expansion}px`;
        }
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
              text-xs font-medium transition-all duration-500`}
    style={{
        right: `${scaledRightPos}%`,
        width: `${width}%`,
        top: '50%',
        height: getPeriodHeight(period.level),
        transform: 'translateY(-50%)',
        backgroundColor: period.color,
        opacity: isVisible && width >= 0.1 ? 1 : 0,
        // Give more buffer space before unrendering
        display: scaledRightPos > 150 ? 'none' : 'flex'  // Changed from 100 to 150
    }}
>
                        <span className="pt-0.5 pl-1 truncate">
                            {period.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default TimelinePeriods;