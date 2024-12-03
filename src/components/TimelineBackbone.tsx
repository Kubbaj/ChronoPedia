import React, { useState, useCallback, useMemo } from 'react';

type TickLevel = 'maxi' | 'mega' | 'major' | 'minor';

interface Tick {
    mya: number;
    label: string;
    level: TickLevel;
    dotted?: boolean;
}

interface ZoomLevel {
    zoomThreshold: number;
    minInterval: number;
    label: string;
}

const zoomLevels: ZoomLevel[] = [
    { zoomThreshold: 10000, minInterval: 500, label: "Mya" },
    { zoomThreshold: 5000, minInterval: 100, label: "Mya" },
    { zoomThreshold: 1000, minInterval: 50, label: "Mya" }
];

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

const TimelineBackbone = () => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showDebugLabels, setShowDebugLabels] = useState(false);


    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        if (e.deltaY < 0) {
            setZoomLevel(prev => Math.min(prev * zoomFactor, 50));
        } else {
            setZoomLevel(prev => Math.max(prev / zoomFactor, 0.2));
        }
    }, []);

    const activeZoomLevels = useMemo(() => {
        return zoomLevels.map(level =>
            (level.zoomThreshold / 13800) * zoomLevel > 1
        );
    }, [zoomLevel]);

    const currentLevels = useMemo(() => {
        const levels = {
            minor: activeZoomLevels[0] ? 500 : 1000,
            major: activeZoomLevels[0] ? 1000 : 5000,
            mega: activeZoomLevels[0] ? 5000 : null
        };

        if (activeZoomLevels[1]) {
            levels.minor = 100;
            levels.major = 500;
            levels.mega = 1000;
        }

        if (activeZoomLevels[2]) {
            levels.minor = 50;
            levels.major = 100;
            levels.mega = 500;
        }

        return levels;
    }, [activeZoomLevels]);

    const generateTicks = () => {
        const tickMap = new Map<number, Tick>();

        const addTick = (tick: Tick) => {
            const existing = tickMap.get(tick.mya);
            if (!existing ||
                ['maxi', 'mega', 'major', 'minor'].indexOf(tick.level) <
                ['maxi', 'mega', 'major', 'minor'].indexOf(existing.level)) {
                tickMap.set(tick.mya, tick);
            }
        };

        // Add base 1000 Mya (1 Bya) ticks
        for (let mya = 1000; mya <= 13000; mya += 1000) {
            addTick({
                mya,
                label: `${mya / 1000}B`,
                level: mya % 5000 === 0 ? 'major' : 'minor'
            });
        }

        // Add maxi ticks
        addTick({ mya: 0, label: 'TODAY', level: 'maxi' });
        addTick({ mya: 13800, label: '13.8B', level: 'maxi', dotted: true });

        // Process each zoom level
        // Process each zoom level
        activeZoomLevels.forEach((isActive, index) => {
            if (isActive) {
                const { zoomThreshold, minInterval } = zoomLevels[index];

                // First, identify existing ticks that will need promotion
                const ticksToPromote = {
                    minors: [],
                    majors: []
                };

                tickMap.forEach((tick) => {
                    if (tick.mya < zoomThreshold) {
                        if (tick.level === 'minor') ticksToPromote.minors.push(tick);
                        if (tick.level === 'major') ticksToPromote.majors.push(tick);
                    }
                });

                // Add new minor ticks
                for (let mya = minInterval; mya < zoomThreshold; mya += minInterval) {
                    addTick({
                        mya,
                        label: '',
                        level: 'minor'
                    });
                }

                // Promote existing ticks in order
                ticksToPromote.majors.forEach(tick => {
                    tick.level = 'mega';
                });

                ticksToPromote.minors.forEach(tick => {
                    if (tick.mya % currentLevels.major === 0) {
                        tick.level = 'major';
                        tick.label = `${tick.mya / 1000}B`;  // Make sure label is added for promoted ticks
                    }
                });
            }
        });

        return Array.from(tickMap.values()).sort((a, b) => a.mya - b.mya);
    };

    const ticks = generateTicks();

    return (
        <div
            className="w-full max-w-6xl mx-auto px-10 pt-8 pb-32 overflow-hidden relative mt-[175px]"
            onWheel={handleWheel}
        >
            {/* Debug Panel - Moved lower */}
            <div className="absolute bottom-5 left-0 text-xs bg-white/80 p-2 z-10">
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        id="showDebugLabels"
                        checked={showDebugLabels}
                        onChange={(e) => setShowDebugLabels(e.target.checked)}
                    />
                    <label htmlFor="showDebugLabels">Show position labels</label>
                </div>
                <div>Minor: {currentLevels.minor} Mya</div>
                <div>Major: {currentLevels.major} Mya</div>
                <div>Mega: {currentLevels.mega ? `${currentLevels.mega} Mya` : 'none'}</div>
            </div>

            <div className="relative h-48">
                <div className="absolute top-24 left-0 right-0 h-px bg-black"
                    style={{
                        transform: `scaleX(${zoomLevel})`,
                        transformOrigin: 'right'
                    }}
                />

                {ticks.map((tick, index) => {
                    const rightPos = (tick.mya / 13800 * 100);  // Inverted the position calculation
                    const scaledRightPos = rightPos * zoomLevel;
                    const { height, width, textStyle, showLabel } = tickStyles[tick.level];

                    return (
                        <div key={index}
                            className="absolute"
                            style={{
                                right: `${scaledRightPos}%`,
                                top: '50%',
                                transform: 'translate(50%, -50%)',
                                display: scaledRightPos > 100 ? 'none' : 'block'
                            }}>
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

                            {/* Position Debug Label */}
                            {showDebugLabels && (
                                <div className="absolute -bottom-12 text-[8px] opacity-50 w-12 text-center -translate-x-1/2 left-1/2">
                                    {rightPos.toFixed(1)}%
                                    <br />
                                    {tick.mya}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelineBackbone;