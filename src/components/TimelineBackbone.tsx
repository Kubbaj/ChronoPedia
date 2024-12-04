import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { TickLevel, Tick, ScaleSet } from './types';
import TimelinePeriods from './TimelinePeriods';
import { GEOLOGICAL_EONS } from './periods';

// The complete sequence in years
const SCALE_SEQUENCE = [
    10000000000, 5000000000, 1000000000, 500000000,  // Billions
    100000000, 50000000, 10000000, 5000000,          // Hundred/Ten Millions
    1000000, 500000, 100000, 50000,                  // Millions/Hundred Thousands
    10000, 5000, 1000, 500,                          // Ten/One Thousands
    100, 50, 10, 5, 1,                                // Hundreds to Years
    (1/12)
];


const generateScaleSets = (): ScaleSet[] => {
    const scaleSets: ScaleSet[] = [];
    
    for (let i = 0; i < SCALE_SEQUENCE.length - 3; i++) {
        scaleSets.push({
            zoomThreshold: SCALE_SEQUENCE[i],
            mega: SCALE_SEQUENCE[i + 1],
            major: SCALE_SEQUENCE[i + 2],
            minor: SCALE_SEQUENCE[i + 3]
        });
    }
    
    return scaleSets;
};

const tickStyles = {
    maxi: {
        height: 'h-32',
        width: 'w-2',
        textStyle: 'text-[1.5rem] font-bold underline',
        labelSpacing: '-bottom-8',
        showLabel: true
    },
    mega: {
        height: 'h-24',
        width: 'w-2',
        textStyle: 'text-[1rem] font-bold',
        labelSpacing: '-bottom-6',
        showLabel: true
    },
    major: {
        height: 'h-12',
        width: 'w-1',
        textStyle: 'text-[0.75rem]',
        labelSpacing: '-bottom-4',
        showLabel: true
    },
    minor: {
        height: 'h-6',
        width: 'w-px',
        textStyle: '',
        showLabel: false
    }
};

const formatTimeLabel = (year: number): string => {
    if (year >= 1000000000) {
        const billions = year / 1000000000;
        return `${Number.isInteger(billions) ? billions : billions.toFixed(1)}B`;
    }
    if (year >= 1000000) {
        const millions = year / 1000000;
        return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`;
    }
    if (year >= 1000) {
        const thousands = year / 1000;
        return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}K`;
    }
    return `${year}`;
};

const getLineScale = (zoomLevel: number) => {
    const fullWidthZoom = (13800000000 / 10000000000);
    return zoomLevel <= fullWidthZoom ? zoomLevel : fullWidthZoom;
};

const TimelineBackbone = () => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showDebugPanel, setShowDebugPanel] = useState(false);
    const [showDebugLabels, setShowDebugLabels] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Shift') {
                setShowDebugPanel(true);
            }
        };
    
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift') {
                setShowDebugPanel(false);
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    
        // Clean up listeners when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        if (e.deltaY < 0) {
            setZoomLevel(prev => Math.min(prev * zoomFactor, 10000000000));
        } else {
            setZoomLevel(prev => Math.max(prev / zoomFactor, 0.2));
        }
    }, []);

    const activeZoomLevels = useMemo(() => {
        const scaleSets = generateScaleSets();
        return scaleSets.map(set => 
            (set.zoomThreshold / 13800000000) * zoomLevel > 1
        );
    }, [zoomLevel]);
    
    const currentScaleSet = useMemo(() => {
        const scaleSets = generateScaleSets();
        // Get the last true index instead of the first
        const activeIndex = activeZoomLevels.lastIndexOf(true);
         return activeIndex >= 0 ? scaleSets[activeIndex] : scaleSets[0];
    }, [activeZoomLevels]);

    const generateTicks = useCallback(() => {
        const tickMap = new Map<number, Tick>();

        const addTick = (tick: Tick) => {
            const existing = tickMap.get(tick.year);
            if (!existing ||
                ['maxi', 'mega', 'major', 'minor'].indexOf(tick.level) <
                ['maxi', 'mega', 'major', 'minor'].indexOf(existing.level)) {
                tickMap.set(tick.year, tick);
            }
        };

        // Add base billion year ticks
        for (let year = 1000000000; year <= 13000000000; year += 1000000000) {
            addTick({
                year,
                label: formatTimeLabel(year),
                level: year % 5000000000 === 0 ? 'major' : 'minor'
            });
        }

        // Add maxi ticks
        addTick({ year: 0, label: 'TODAY', level: 'maxi' });
        addTick({ year: 13800000000, label: '13.8B', level: 'maxi', dotted: true });

        // Process each active zoom level
        const scaleSets = generateScaleSets();
        activeZoomLevels.forEach((isActive, index) => {
            if (isActive) {
                const scaleSet = scaleSets[index];

                // Identify ticks that need promotion
                const ticksToPromote = {
                    minors: [] as Tick[],
                    majors: [] as Tick[]
                };

                tickMap.forEach((tick) => {
                    if (tick.year < scaleSet.zoomThreshold) {
                        if (tick.level === 'minor') ticksToPromote.minors.push(tick);
                        if (tick.level === 'major') ticksToPromote.majors.push(tick);
                    }
                });

                // Add new minor ticks
                for (let year = scaleSet.minor; year < scaleSet.zoomThreshold; year += scaleSet.minor) {
                    addTick({
                        year,
                        label: '',
                        level: 'minor'
                    });
                }

                // Promote existing ticks
                ticksToPromote.majors.forEach(tick => {
                    tick.level = 'mega';
                    tick.label = formatTimeLabel(tick.year);
                });

                ticksToPromote.minors.forEach(tick => {
                    if (tick.year % scaleSet.major === 0) {
                        tick.level = 'major';
                        tick.label = formatTimeLabel(tick.year);
                    }
                });
            }
        });

        return Array.from(tickMap.values()).sort((a, b) => a.year - b.year);
    }, [activeZoomLevels]);

    const ticks = generateTicks();

    return (
        <>
            {/* Debug Panel */}
            {showDebugPanel && (
            <div className="fixed left-4 bottom-4 text-xs bg-white/80 p-2 z-10 border border-gray-200 rounded shadow">
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        id="showDebugLabels"
                        checked={showDebugLabels}
                        onChange={(e) => setShowDebugLabels(e.target.checked)}
                    />
                    <label htmlFor="showDebugLabels">Show position labels</label>
                </div>
                <div>Zoom Level: {zoomLevel.toFixed(2)}</div>
                <div>Active Levels: {activeZoomLevels.filter(l => l).length}</div>
                {currentScaleSet && (
                    <>
                        <div>Threshold: {formatTimeLabel(currentScaleSet.zoomThreshold)}</div>
                        <div>Mega: {formatTimeLabel(currentScaleSet.mega)}</div>
                        <div>Major: {formatTimeLabel(currentScaleSet.major)}</div>
                        <div>Minor: {formatTimeLabel(currentScaleSet.minor)}</div>
                    </>
                )}
            </div>
            )}
            <div
                className="w-full max-w-6xl mx-auto px-10 pt-8 pb-32 overflow-hidden relative mt-[175px]"
                onWheel={handleWheel}
            >
                <div className="relative h-48">
                    <div 
                        className="absolute top-24 left-0 right-0 h-px bg-black"
                        style={{
                            transform: `scaleX(${getLineScale(zoomLevel)})`, // Replace the existing scaleX
                            transformOrigin: 'right'
                        }}
                    />

                    <TimelinePeriods 
                    zoomLevel={zoomLevel} 
                    periods={GEOLOGICAL_EONS}
                    />

                    {ticks.map((tick, index) => {
                        const rightPos = (tick.year / 13800000000 * 100);
                        const scaledRightPos = rightPos * zoomLevel;
                        const { height, width, textStyle, showLabel } = tickStyles[tick.level];

                        return (
                            <div 
                                key={index}
                                className="absolute"
                                style={{
                                    right: `${scaledRightPos}%`,
                                    top: '50%',
                                    transform: 'translate(50%, -50%)',
                                    display: scaledRightPos > 100 ? 'none' : 'block'
                                }}
                            >
                                <div className={`
                                    relative 
                                    ${height} ${width}
                                    ${tick.dotted ? 'border-l-4 border-dashed border-black' : 'bg-black'}
                                    mx-auto
                                `} />

                                {showLabel && tick.label && (
                                    <div className={`
                                        absolute 
                                        w-24 
                                        text-center 
                                        -translate-x-1/2 left-1/2  
                                        ${tickStyles[tick.level].labelSpacing}
                                        ${textStyle}
                                        whitespace-nowrap
                                    `}>
                                        {tick.label}
                                    </div>
                                )}

                                {showDebugLabels && (
                                    <div className="absolute -top-6 text-[8px] opacity-50 w-12 text-center -translate-x-1/2 left-1/2">
                                        {scaledRightPos.toFixed(1)}%
                                        <br />
                                        {tick.year}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
            </div>
        </>
    );
};

export default TimelineBackbone;