import React, { useRef, useState, useEffect } from 'react';
import PersonalSidebar from '../../components/PersonalSidebar';
import RightSidebar from '../../components/RightSidebar';
import { supabase } from '../../lib/supabase';

const Planner = () => {
    // Canvas State
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectedTool, setSelectedTool] = useState('brush'); // brush, eraser, line, rect, circle, fill
    const [color, setColor] = useState('#ef4444');
    const [brushSize, setBrushSize] = useState(6);
    const [snapshot, setSnapshot] = useState(null);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    // Text Editor State
    const editorRef = useRef(null);

    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    useEffect(() => {
        initCanvas();
    }, []);

    const getMousePos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        setIsDrawing(true);
        const { x, y } = getMousePos(e);
        setStartX(x);
        setStartY(y);
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
        setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { x, y } = getMousePos(e);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (selectedTool !== 'brush' && selectedTool !== 'eraser') {
            ctx.putImageData(snapshot, 0, 0);
        }

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = selectedTool === 'eraser' ? '#ffffff' : color;
        ctx.fillStyle = color;

        if (selectedTool === 'brush' || selectedTool === 'eraser') {
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (selectedTool === 'rect') {
            ctx.beginPath();
            ctx.rect(startX, startY, x - startX, y - startY);
            ctx.stroke();
        } else if (selectedTool === 'circle') {
            ctx.beginPath();
            const radius = Math.sqrt(Math.pow(startX - x, 2) + Math.pow(startY - y, 2));
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (selectedTool === 'line') {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.closePath();
    };

    const clearCanvas = () => {
        if (window.confirm("Are you sure you want to clear the canvas?")) {
            initCanvas();
        }
    };

    const downloadCanvas = () => {
        const link = document.createElement('a');
        link.download = `canvas-drawing-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const copyText = () => {
        if (editorRef.current) {
            navigator.clipboard.writeText(editorRef.current.innerText);
            alert("Text copied to clipboard!");
        }
    };

    return (
        <div className="dashboard-container">
            <PersonalSidebar />

            <main className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="page-header" style={{ marginBottom: '0' }}>
                    <h1 className="page-title">Creative Planner</h1>
                    <p className="text-muted">Sketch your ideas and draft your content below.</p>
                </div>

                {/* --- CANVAS SECTION --- */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                    {/* Dark Toolbar */}
                    <div style={{ background: '#0f172a', padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
                        
                        {/* Tools Group */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <ToolButton icon="fa-solid fa-pen" active={selectedTool === 'brush'} onClick={() => setSelectedTool('brush')} />
                            <ToolButton icon="fa-solid fa-paintbrush" active={selectedTool === 'brush2'} onClick={() => setSelectedTool('brush')} />
                            <ToolButton icon="fa-solid fa-eraser" active={selectedTool === 'eraser'} onClick={() => setSelectedTool('eraser')} />
                            <ToolButton icon="fa-solid fa-minus" active={selectedTool === 'line'} onClick={() => setSelectedTool('line')} />
                            <ToolButton icon="fa-regular fa-square" active={selectedTool === 'rect'} onClick={() => setSelectedTool('rect')} />
                            <ToolButton icon="fa-regular fa-circle" active={selectedTool === 'circle'} onClick={() => setSelectedTool('circle')} />
                            <ToolButton icon="fa-solid fa-caret-up" active={selectedTool === 'triangle'} onClick={() => setSelectedTool('line')} /> {/* Pseudo triangle */}
                            <ToolButton icon="fa-solid fa-fill-drip" active={selectedTool === 'fill'} onClick={() => setSelectedTool('fill')} />
                        </div>

                        {/* Colors */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <ColorSwatch c="#1e293b" active={color} onClick={setColor} />
                            <ColorSwatch c="#ef4444" active={color} onClick={setColor} />
                            <ColorSwatch c="#f97316" active={color} onClick={setColor} />
                            <ColorSwatch c="#eab308" active={color} onClick={setColor} />
                            <ColorSwatch c="#22c55e" active={color} onClick={setColor} />
                            <ColorSwatch c="#06b6d4" active={color} onClick={setColor} />
                            <ColorSwatch c="#6366f1" active={color} onClick={setColor} />
                            <ColorSwatch c="#ec4899" active={color} onClick={setColor} />
                            <ColorSwatch c="#ffffff" active={color} onClick={setColor} hasBorder />
                            <ColorSwatch c="#ef4444" active={color} onClick={setColor} isSquare />
                        </div>

                        {/* Size Slider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontSize: '13px' }}>
                            <span>Size</span>
                            <input 
                                type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(e.target.value)}
                                style={{ width: '80px', accentColor: '#ef4444' }}
                            />
                            <span style={{ color: '#ef4444', minWidth: '20px' }}>{brushSize}</span>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                            <button className="btn-icon-sm" style={{ background: '#1e3a8a', color: '#60a5fa', border: 'none', borderRadius: '6px', width: '32px', height: '32px' }} title="Undo (Coming soon)">
                                <i className="fa-solid fa-rotate-left"></i>
                            </button>
                            <button onClick={clearCanvas} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', padding: '0 16px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                Clear
                            </button>
                            <button onClick={downloadCanvas} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', padding: '0 16px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                Save PNG
                            </button>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div style={{ background: '#ffffff', width: '100%', height: '500px', cursor: 'crosshair' }}>
                        <canvas 
                            ref={canvasRef} 
                            width={1200} height={500} 
                            style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }} 
                            onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing} 
                        />
                    </div>
                </div>

                {/* --- TEXT EDITOR SECTION --- */}
                <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
                    
                    {/* Rich Editor Toolbar */}
                    <div style={{ display: 'flex', gap: '15px', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', flexWrap: 'wrap', alignItems: 'center' }}>
                        
                        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                            <EditorBtn icon="fa-solid fa-bold" onClick={() => execCmd('bold')} />
                            <EditorBtn icon="fa-solid fa-italic" onClick={() => execCmd('italic')} />
                            <EditorBtn icon="fa-solid fa-underline" onClick={() => execCmd('underline')} />
                            <EditorBtn icon="fa-solid fa-strikethrough" onClick={() => execCmd('strikeThrough')} />
                        </div>

                        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                            <EditorBtn icon="fa-regular fa-face-smile" />
                            <EditorBtn icon="fa-regular fa-image" />
                            <EditorBtn icon="fa-solid fa-globe" />
                        </div>

                        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                            <EditorBtn icon="fa-solid fa-rotate-left" onClick={() => execCmd('undo')} />
                            <EditorBtn icon="fa-solid fa-rotate-right" onClick={() => execCmd('redo')} />
                            <EditorBtn icon="fa-solid fa-eraser" onClick={() => execCmd('removeFormat')} />
                        </div>

                        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                            <EditorBtn icon="fa-solid fa-list-ul" onClick={() => execCmd('insertUnorderedList')} />
                            <EditorBtn icon="fa-solid fa-list-ol" onClick={() => execCmd('insertOrderedList')} />
                            <EditorBtn icon="fa-solid fa-indent" onClick={() => execCmd('indent')} />
                        </div>

                    </div>

                    {/* Editor Content Area */}
                    <div 
                        ref={editorRef}
                        contentEditable 
                        style={{ flex: 1, padding: '24px', outline: 'none', fontSize: '1rem', color: '#1e293b', minHeight: '300px', lineHeight: '1.6' }}
                        data-placeholder="Write here..."
                        onFocus={(e) => { if(e.target.innerText.trim() === 'Write here...') e.target.innerText = ''; }}
                        onBlur={(e) => { if(e.target.innerText.trim() === '') e.target.innerText = 'Write here...'; }}
                        suppressContentEditableWarning={true}
                    >
                        Write here...
                    </div>

                    {/* Bottom Action Bar */}
                    <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '15px' }}>
                        <button onClick={copyText} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }}>
                            <i className="fa-regular fa-copy"></i> Copy text
                        </button>
                        
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
                            <button style={{ background: '#f97316', color: '#ffffff', border: 'none', padding: '12px 32px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                                <i className="fa-regular fa-calendar-check"></i> Schedule
                            </button>
                            <button 
                                onClick={async () => {
                                    const content = editorRef.current.innerHTML;
                                    if (content.trim() === '' || content === 'Write here...') {
                                        alert("Please write something first!");
                                        return;
                                    }
                                    const { error } = await supabase.from('posts').insert([{ content, category: 'personal' }]);
                                    if (error) {
                                        alert("Error saving post: " + error.message);
                                    } else {
                                        alert("Post saved to database!");
                                        editorRef.current.innerHTML = 'Write here...';
                                    }
                                }}
                                style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '12px 32px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                            >
                                <i className="fa-solid fa-rocket"></i> Post now
                            </button>
                        </div>
                    </div>

                </div>

            </main>
            
            <RightSidebar />
        </div>
    );
};

// Canvas Sub-components
const ToolButton = ({ icon, active, onClick }) => (
    <button 
        onClick={onClick}
        style={{ 
            background: active ? '#1e293b' : 'transparent',
            color: active ? '#ef4444' : '#64748b',
            border: active ? '1px solid #ef4444' : '1px solid transparent',
            borderRadius: '6px', width: '36px', height: '36px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s'
        }}
    >
        <i className={icon}></i>
    </button>
);

const ColorSwatch = ({ c, active, onClick, hasBorder, isSquare }) => (
    <div 
        onClick={() => onClick(c)}
        style={{ 
            width: '24px', height: '24px', background: c, 
            borderRadius: isSquare ? '4px' : '50%', cursor: 'pointer',
            border: hasBorder ? '1px solid #cbd5e1' : 'none',
            outline: active === c ? '2px solid white' : 'none',
            outlineOffset: '2px', transition: 'all 0.2s'
        }}
    />
);

// Editor Sub-components
const EditorBtn = ({ icon, onClick }) => (
    <button onClick={onClick} style={{ background: 'transparent', border: 'none', color: '#475569', padding: '8px 12px', cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s' }}>
        <i className={icon}></i>
    </button>
);

export default Planner;
