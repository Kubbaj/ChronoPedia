import React, { useState } from 'react';
import { Period, ScaleSet } from './types';

interface TimelinePeriodsProps {
    zoomLevel: number;
    cosmologicalPeriods?: Period[];
    geologicalPeriods?: Period[];
    archaeologicalPeriods?: Period[];
    historicalPeriods?: Period[];
    activeScaleSet?: ScaleSet;
    activeZoomLevels?: boolean[];
}

const TimelinePeriods: React.FC<TimelinePeriodsProps> = ({ 
    zoomLevel, 
    periods = []
}) => {
    const LEVEL_YEAR_THRESHOLDS = {
        0: 20000000000,
        1: 20000000000,
        2: 20000000000,
        3: 700000000,
        4: 90000000,
        5: 4000000,
        6: 20000
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
        const smallInterval = 0.3;
        const bigInterval = 0.6;
        
        if (!visibleLevels.includes(level)) {
            return '0px';
        }
    
        // Get the lowest (most detailed) visible level
        const lowestVisibleLevel = Math.max(...visibleLevels);
    
        // Special initial heights for cosmological and stellar periods
        if (lowestVisibleLevel < 3) {
            // Before level 3 appears
            if (level === 0) return `${baseHeight * 1.9}px`;
            if (level === 1) return `${baseHeight * 1.3}px`;
            return `${baseHeight}px`;
        }
        
        // Special case when level 3 first appears
        if (lowestVisibleLevel === 3) {
            if (level === 0) return `${baseHeight * 2.2}px`;  // Original 1.9 + small .3
            if (level === 1) return `${baseHeight * 1.9}px`;  // Original 1.3 + big .6
            if (level === 2) return `${baseHeight * 1.6}px`;  // Base + big .6
            return `${baseHeight}px`;  // Level 3 at base height
        }
    
        // After level 3, return to normal expansion pattern
        const stepsFromLowest = lowestVisibleLevel - level;
        
        if (stepsFromLowest <= 0) {
            // Current level
            return `${baseHeight}px`;
        } else if (stepsFromLowest === 1) {
            // Immediate parent - big interval
            return `${baseHeight * (1 + bigInterval)}px`;
        } else {
            // Earlier ancestors - additional small intervals
            const expansion = (1 + bigInterval) + ((stepsFromLowest - 1) * smallInterval);
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
        display: scaledRightPos > 175 ? 'none' : 'flex'  // Changed from 100 to 150
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