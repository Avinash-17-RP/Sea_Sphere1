import React, { useMemo, useState, useEffect } from 'react';

const WorldClocksWidget = ({ gridColumn = '1 / -1' }) => {
    const [time, setTime] = useState(new Date());
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const tzOptions = useMemo(() => {
        if (typeof Intl.supportedValuesOf === 'function') {
            return Intl.supportedValuesOf('timeZone');
        }
        return [localTimeZone];
    }, [localTimeZone]);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const [clocks, setClocks] = useState(() => {
        const saved = localStorage.getItem('seasphere_world_clocks');
        if (!saved) {
            return [];
        }
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                return parsed;
            }
            return [];
        } catch {
            return [];
        }
    });

    const [clockInput, setClockInput] = useState({ name: '', tz: localTimeZone });

    useEffect(() => {
        localStorage.setItem('seasphere_world_clocks', JSON.stringify(clocks));
    }, [clocks]);

    const formatTzLabel = (tz) => tz.replaceAll('_', ' ');

    const addClock = (e) => {
        e.preventDefault();
        if (!clockInput.tz) {
            return;
        }
        const label = clockInput.name.trim() || formatTzLabel(clockInput.tz.split('/').pop() || clockInput.tz);
        setClocks((prev) => [...prev, { id: Date.now(), tz: clockInput.tz, name: label }]);
        setClockInput({ name: '', tz: clockInput.tz });
    };

    const removeClock = (id) => {
        if (clocks.length > 1) {
            setClocks((prev) => prev.filter((c) => c.id !== id));
        }
    };

    return (
        <div className="glass-card clock-widget fade-in" style={{ gridColumn: gridColumn, overflow: 'hidden', padding: '24px' }}>
            {/* Header */}
            <div className="widget-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ color: '#06b6d4', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-regular fa-clock"></i> World Clocks
                </div>
                <form onSubmit={addClock} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        className="form-input"
                        value={clockInput.name}
                        onChange={(e) => setClockInput((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Clock label"
                        style={{ minWidth: '140px', maxWidth: '160px' }}
                    />
                    <select 
                        value={clockInput.tz} 
                        onChange={(e) => setClockInput((prev) => ({ ...prev, tz: e.target.value }))}
                        style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#1e293b', background: '#ffffff', cursor: 'pointer', outline: 'none' }}
                    >
                        {tzOptions.map((tz) => (
                            <option key={tz} value={tz}>{formatTzLabel(tz)}</option>
                        ))}
                    </select>
                    <button type="submit" title="Add clock" style={{ background: '#06b6d4', color: 'white', border: 'none', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}>
                        <i className="fa-solid fa-plus"></i>
                    </button>
                    {clocks.length === 0 && (
                        <button type="button" onClick={() => setClocks([{ id: Date.now(), tz: localTimeZone, name: 'Local Time' }])}
                            className="btn btn-outline" style={{ padding: '6px 10px' }}>
                            Use Local Clock
                        </button>
                    )}
                </form>
            </div>
            
            {/* Clocks Container */}
            {clocks.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '24px', width: '100%' }}>
                    <p className="text-muted-sm" style={{ marginBottom: '8px' }}>No clocks yet. Add one above.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '40px', overflowX: 'auto', paddingBottom: '20px', padding: '10px' }}>
                {clocks.map(clock => {
                    const d = new Date(time.toLocaleString('en-US', { timeZone: clock.tz }));
                    const seconds = d.getSeconds();
                    const minutes = d.getMinutes();
                    const hours = d.getHours();

                    const secondDegrees = (seconds / 60) * 360;
                    const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
                    const hourDegrees = ((hours % 12 + minutes / 60) / 12) * 360;

                    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    // Split the time to style AM/PM slightly differently if desired, or just render it directly
                    const [timeNum, period] = timeStr.split(' ');

                    return (
                        <div key={clock.id} style={{ minWidth: '130px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Title Segment */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: 'bold' }}>{clock.name}</h4>
                                {clocks.length > 1 && (
                                    <button onClick={() => removeClock(clock.id)} title="Remove clock" style={{ background: '#ff4757', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', marginLeft: '5px' }}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                            
                            {/* Analog Face - Neon Styled */}
                            <div style={{ 
                                width: '130px', height: '130px', 
                                background: '#021a32', // Dark navy blue background
                                borderRadius: '50%', 
                                border: '4px solid #06b6d4', // Cyan border
                                boxShadow: '0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 10px rgba(0,0,0,0.5)', // Outer glow
                                position: 'relative',
                                marginBottom: '20px'
                            }}>
                                {/* Numbers */}
                                <span style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>12</span>
                                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>3</span>
                                <span style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>6</span>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>9</span>
                                
                                {/* Center Dot */}
                                <div style={{ 
                                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                                    width: '10px', height: '10px', background: 'white', border: '2px solid #06b6d4', 
                                    borderRadius: '50%', zIndex: 10 
                                }}></div>

                                {/* Hour Hand */}
                                <div style={{ 
                                    position: 'absolute', top: '25%', left: '50%', width: '4px', height: '25%', 
                                    background: '#06b6d4', transformOrigin: 'bottom center', borderRadius: '4px',
                                    transform: `translateX(-50%) rotate(${hourDegrees}deg)`, zIndex: 5
                                }}></div>

                                {/* Minute Hand */}
                                <div style={{ 
                                    position: 'absolute', top: '15%', left: '50%', width: '3px', height: '35%', 
                                    background: '#06b6d4', transformOrigin: 'bottom center', borderRadius: '3px',
                                    transform: `translateX(-50%) rotate(${minuteDegrees}deg)`, zIndex: 6
                                }}></div>

                                {/* Second Hand */}
                                <div style={{ 
                                    position: 'absolute', top: '10%', left: '50%', width: '2px', height: '40%', 
                                    background: '#ef4444', transformOrigin: 'bottom center', borderRadius: '2px',
                                    transform: `translateX(-50%) rotate(${secondDegrees}deg)`, zIndex: 7
                                }}></div>
                            </div>

                            {/* Digital Display */}
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#06b6d4', letterSpacing: '1px' }}>
                                {timeNum} <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{period}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            )}
        </div>
    );
};

export default WorldClocksWidget;
