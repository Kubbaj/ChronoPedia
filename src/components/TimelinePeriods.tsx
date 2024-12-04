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
    return (
        <div className="absolute inset-0 pointer-events-none">
            {periods.map((period, index) => {
                const rightPos = (period.endYear / 13800000000 * 100);
                const leftPos = (period.startYear / 13800000000 * 100);
                const scaledRightPos = rightPos * zoomLevel;
                const scaledLeftPos = leftPos * zoomLevel;
                const width = Math.abs(scaledLeftPos - scaledRightPos);
                
                return (
                    <div
                        key={index}
                        className="absolute h-16 rounded-sm flex items-start 
                                 text-xs font-medium transition-opacity duration-200"
                        style={{
                            right: `${scaledRightPos}%`,
                            width: `${width}%`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: period.color,
                            opacity: width < 0.1 ? 0 : 1,
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