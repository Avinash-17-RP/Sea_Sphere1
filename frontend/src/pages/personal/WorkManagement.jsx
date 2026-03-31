import React, { useMemo, useState, useEffect } from 'react';
import PersonalSidebar from '../../components/PersonalSidebar';
import RightSidebar from '../../components/RightSidebar';
import { useUser } from '../../context/UserContext';

const WorkManagement = () => {
    const { user } = useUser();
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('seasphere_kanban_tasks');
        if (!savedTasks) {
            return [];
        }
        try {
            return JSON.parse(savedTasks);
        } catch {
            return [];
        }
    });
    const [newTask, setNewTask] = useState({ title: '', desc: '', status: 'todo' });

    useEffect(() => {
        localStorage.setItem('seasphere_kanban_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const groupedTasks = useMemo(() => ({
        todo: tasks.filter((task) => task.status === 'todo'),
        progress: tasks.filter((task) => task.status === 'progress'),
        completed: tasks.filter((task) => task.status === 'completed'),
    }), [tasks]);

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) {
            return;
        }
        const task = {
            id: Date.now(),
            title: newTask.title.trim(),
            desc: newTask.desc.trim(),
            status: newTask.status,
            avatar: user?.avatar || 'U',
        };
        setTasks((prev) => [task, ...prev]);
        setNewTask({ title: '', desc: '', status: 'todo' });
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const moveTask = (id, status) => {
        setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)));
    };

    return (
        <div className="dashboard-container">
            <PersonalSidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Work Management</h1>
                    <span className="text-muted-sm">Create and manage your own tasks</span>
                </div>

                <form onSubmit={addTask} className="glass-card fade-in" style={{ padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr auto', gap: '10px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Task title"
                            value={newTask.title}
                            onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                        />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Task description"
                            value={newTask.desc}
                            onChange={(e) => setNewTask((prev) => ({ ...prev, desc: e.target.value }))}
                        />
                        <select
                            className="form-input"
                            value={newTask.status}
                            onChange={(e) => setNewTask((prev) => ({ ...prev, status: e.target.value }))}
                        >
                            <option value="todo">To Do</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <button type="submit" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add</button>
                    </div>
                </form>

                <div className="kanban-board fade-in">
                    <KanbanColumn title="To Do" count={groupedTasks.todo.length}>
                        {groupedTasks.todo.length === 0 && <EmptyState />}
                        {groupedTasks.todo.map((task) => (
                            <TaskCard key={task.id} task={task} onDelete={deleteTask} onMove={moveTask} />
                        ))}
                    </KanbanColumn>
                    <KanbanColumn title="In Progress" count={groupedTasks.progress.length}>
                        {groupedTasks.progress.length === 0 && <EmptyState />}
                        {groupedTasks.progress.map((task) => (
                            <TaskCard key={task.id} task={task} onDelete={deleteTask} onMove={moveTask} />
                        ))}
                    </KanbanColumn>
                    <KanbanColumn title="Completed" count={groupedTasks.completed.length}>
                        {groupedTasks.completed.length === 0 && <EmptyState />}
                        {groupedTasks.completed.map((task) => (
                            <TaskCard key={task.id} task={task} onDelete={deleteTask} onMove={moveTask} />
                        ))}
                    </KanbanColumn>
                </div>
            </main>
            <RightSidebar />
        </div>
    );
};

const KanbanColumn = ({ title, count, children }) => (
    <div className="kanban-column">
        <div className="column-header">
            <span>{title}</span>
            <span className="text-muted-sm">{count}</span>
        </div>
        {children}
    </div>
);

const EmptyState = () => (
    <div className="task-card">
        <p className="text-muted-sm">No tasks yet. Add one above.</p>
    </div>
);

const TaskCard = ({ task, onDelete, onMove }) => (
    <div className="task-card">
        <h4 className="mb-5">{task.title}</h4>
        <p className="text-muted-sm mb-12">{task.desc || 'No description provided.'}</p>
        <div className="d-flex-between-center">
            <span className={`status-badge status-${task.status}`}>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
            <div className="user-avatar avatar-xs">{task.avatar}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            {task.status !== 'todo' && <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => onMove(task.id, 'todo')}>To Do</button>}
            {task.status !== 'progress' && <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => onMove(task.id, 'progress')}>In Progress</button>}
            {task.status !== 'completed' && <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => onMove(task.id, 'completed')}>Done</button>}
            <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '4px 8px', color: '#ef4444' }} onClick={() => onDelete(task.id)}>Delete</button>
        </div>
    </div>
);

export default WorkManagement;
