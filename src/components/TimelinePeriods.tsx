import React from 'react';
import { Period } from './types';

interface TimelinePeriodsProps {
    zoomLevel: number;
    periods?: Period[];
    activeZoomLevels: boolean[];
}

const TimelinePeriods: React.FC<TimelinePeriodsProps> = ({ 
    zoomLevel, 
    periods = [],
    activeZoomLevels
}) => {
    const LEVEL_VISIBILITY_THRESHOLDS = {
        0: 0,  // Level 0 (eons) visible from the start
        1: 3,  // Level 1 (eras) appear at 1B threshold (activeCount = 3)
    };

    const activeCount = activeZoomLevels.filter(Boolean).length;

    const getPeriodHeight = (level: number): string => {
        const baseHeight = 'h-16';
        
        // If this level isn't visible yet, no height
        if (activeCount < LEVEL_VISIBILITY_THRESHOLDS[level]) {
            return 'h-0';
        }

        // Count how many NEW levels have appeared since this level became visible
        const newLevelsAfterThis = Object.entries(LEVEL_VISIBILITY_THRESHOLDS)
            .filter(([_, threshold]) => 
                threshold > LEVEL_VISIBILITY_THRESHOLDS[level] && // Appeared after this level
                threshold <= activeCount // And is currently visible
            ).length;

        // Increase height only if other levels appeared after this one
        if (newLevelsAfterThis > 0) {
            return `h-32`; // Double height to accommodate new levels
        }

        return baseHeight;
    };

    return (
        <div className="absolute inset-0 pointer-events-none">
            {periods.map((period, index) => {
                const rightPos = (period.endYear / 13800000000 * 100);
                const leftPos = (period.startYear / 13800000000 * 100);
                const scaledRightPos = rightPos * zoomLevel;
                const scaledLeftPos = leftPos * zoomLevel;
                const width = Math.abs(scaledLeftPos - scaledRightPos);
                
                const isVisible = activeCount >= LEVEL_VISIBILITY_THRESHOLDS[period.level];
                
                return (
                    <div
                        key={index}
                        className={`absolute rounded-sm flex items-start 
                                  text-xs font-medium transition-opacity duration-200
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