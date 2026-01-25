// Productivity Tools JavaScript
class ProductivityApp {
    constructor() {
        this.currentView = 'daily-planner';
        this.tasks = this.loadTasks();
        this.currentTime = new Date();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentTime();
        this.renderTasks();
        this.startClock();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item);
            });
        });

        // Mobile navigation
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMobileNavigation(item);
            });
        });

        // Date navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleDateNavigation(btn);
            });
        });

        // Task items
        document.querySelectorAll('.task-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleTaskClick(item);
            });
        });

        // Add task functionality
        this.setupAddTaskButtons();
    }

    handleNavigation(navItem) {
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        navItem.classList.add('active');
        
        // Update current view
        this.currentView = navItem.dataset.page;
        this.updateView();
    }

    handleMobileNavigation(navItem) {
        // Remove active class from all items
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        navItem.classList.add('active');
    }

    handleDateNavigation(btn) {
        const isNext = btn.querySelector('.fa-chevron-right');
        const currentDateElement = document.querySelector('.current-date');
        const currentDate = new Date();
        
        if (isNext) {
            currentDate.setDate(currentDate.getDate() + 1);
        } else {
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = currentDate.toLocaleDateString('en-US', options);
        
        this.updateTasksForDate(currentDate);
    }

    handleTaskClick(taskItem) {
        // Toggle task completion
        const isCompleted = taskItem.classList.toggle('completed');
        
        // Update task in storage
        const taskId = taskItem.dataset.taskId;
        if (taskId) {
            this.updateTaskStatus(taskId, isCompleted);
        }
        
        // Show task details modal (optional)
        this.showTaskDetails(taskItem);
    }

    updateView() {
        // Update main content based on current view
        const mainContent = document.querySelector('.main-content');
        
        switch(this.currentView) {
            case 'home':
                this.showHomeView();
                break;
            case 'focus':
                this.showFocusView();
                break;
            case 'daily-planning':
                this.showDailyPlanningView();
                break;
            case 'daily-task-list':
                this.showDailyTaskListView();
                break;
            case 'daily-shutdown':
                this.showDailyShutdownView();
                break;
            case 'daily-highlights':
                this.showDailyHighlightsView();
                break;
            case 'weekly-planning':
                this.showWeeklyPlanningView();
                break;
            case 'weekly-review':
                this.showWeeklyReviewView();
                break;
            default:
                this.showDailyPlanningView();
        }
    }

    showHomeView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Welcome Back!</h1>
                <div class="date-navigation">
                    <button class="nav-btn"><i class="fas fa-chevron-left"></i></button>
                    <span class="current-date">Today, ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <button class="nav-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>Today's Progress</h3>
                    <div class="progress-stats">
                        <div class="stat">
                            <span class="stat-number">8</span>
                            <span class="stat-label">Tasks Completed</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">3</span>
                            <span class="stat-label">In Progress</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">2</span>
                            <span class="stat-label">Upcoming</span>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <h3>Weekly Overview</h3>
                    <div class="week-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 65%"></div>
                        </div>
                        <span>65% Complete</span>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <h3>Focus Time</h3>
                    <div class="focus-stats">
                        <span class="focus-time">4h 32m</span>
                        <span class="focus-label">Total focus time today</span>
                    </div>
                </div>
            </div>
        `;
    }

    showFocusView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Focus Mode</h1>
                <button class="focus-toggle-btn">
                    <i class="fas fa-play"></i> Start Focus Session
                </button>
            </div>
            
            <div class="focus-container">
                <div class="focus-timer">
                    <div class="timer-display">25:00</div>
                    <div class="timer-controls">
                        <button class="timer-btn"><i class="fas fa-play"></i></button>
                        <button class="timer-btn"><i class="fas fa-pause"></i></button>
                        <button class="timer-btn"><i class="fas fa-redo"></i></button>
                    </div>
                </div>
                
                <div class="focus-task">
                    <h3>Current Task</h3>
                    <p class="focus-task-description">Product roadmap planning and prioritization</p>
                </div>
                
                <div class="focus-settings">
                    <h3>Focus Settings</h3>
                    <div class="setting-item">
                        <label>Session Duration</label>
                        <select>
                            <option>25 minutes</option>
                            <option>45 minutes</option>
                            <option>60 minutes</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label>Break Duration</label>
                        <select>
                            <option>5 minutes</option>
                            <option>10 minutes</option>
                            <option>15 minutes</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    showDailyPlanningView() {
        // This is the default view that's already loaded
        location.reload();
    }

    showDailyTaskListView() {
        const mainContent = document.querySelector('.main-content');
        const allTasks = this.getAllTasksForToday();
        
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Daily Task List</h1>
                <button class="add-task-btn">
                    <i class="fas fa-plus"></i> Add Task
                </button>
            </div>
            
            <div class="task-list-container">
                <div class="task-section">
                    <h3>To Do</h3>
                    <div class="task-group" id="todo-tasks">
                        ${allTasks.todo.map(task => this.createTaskElement(task)).join('')}
                    </div>
                </div>
                
                <div class="task-section">
                    <h3>In Progress</h3>
                    <div class="task-group" id="inprogress-tasks">
                        ${allTasks.inProgress.map(task => this.createTaskElement(task)).join('')}
                    </div>
                </div>
                
                <div class="task-section">
                    <h3>Completed</h3>
                    <div class="task-group" id="completed-tasks">
                        ${allTasks.completed.map(task => this.createTaskElement(task)).join('')}
                    </div>
                </div>
            </div>
        `;
        
        this.setupTaskListDragAndDrop();
    }

    showDailyShutdownView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Daily Shutdown</h1>
                <span class="shutdown-time">6:00 PM</span>
            </div>
            
            <div class="shutdown-container">
                <div class="shutdown-checklist">
                    <h3>Complete these before shutting down:</h3>
                    <div class="checklist-items">
                        <label class="checklist-item">
                            <input type="checkbox">
                            <span>Review today's accomplishments</span>
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox">
                            <span>Plan tomorrow's priorities</span>
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox">
                            <span>Clear email inbox</span>
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox">
                            <span>Update project status</span>
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox">
                            <span>Tidy up workspace</span>
                        </label>
                    </div>
                </div>
                
                <div class="shutdown-reflection">
                    <h3>Today's Reflection</h3>
                    <textarea placeholder="What went well today? What could be improved?"></textarea>
                    <button class="save-reflection-btn">Save Reflection</button>
                </div>
            </div>
        `;
    }

    showDailyHighlightsView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Daily Highlights</h1>
                <button class="add-highlight-btn">
                    <i class="fas fa-plus"></i> Add Highlight
                </button>
            </div>
            
            <div class="highlights-container">
                <div class="highlight-item">
                    <div class="highlight-date">Today</div>
                    <div class="highlight-content">
                        <h3>Completed product roadmap planning</h3>
                        <p>Successfully finalized Q2 product roadmap with stakeholder approval.</p>
                        <div class="highlight-tags">
                            <span class="tag">#product</span>
                            <span class="tag">#planning</span>
                        </div>
                    </div>
                </div>
                
                <div class="highlight-item">
                    <div class="highlight-date">Yesterday</div>
                    <div class="highlight-content">
                        <h3>Launched new feature</h3>
                        <p>Successfully deployed the user dashboard update with positive feedback.</p>
                        <div class="highlight-tags">
                            <span class="tag">#development</span>
                            <span class="tag">#launch</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showWeeklyPlanningView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Weekly Planning</h1>
                <span class="week-range">Mar 18 - Mar 24</span>
            </div>
            
            <div class="weekly-planning-container">
                <div class="weekly-goals">
                    <h3>Weekly Goals</h3>
                    <div class="goal-item">
                        <input type="text" placeholder="Add a new goal..." class="goal-input">
                    </div>
                </div>
                
                <div class="weekly-priorities">
                    <h3>Top Priorities</h3>
                    <div class="priority-list">
                        <div class="priority-item high">
                            <span class="priority-title">Complete Q2 roadmap</span>
                            <span class="priority-status">In Progress</span>
                        </div>
                        <div class="priority-item medium">
                            <span class="priority-title">User research analysis</span>
                            <span class="priority-status">To Do</span>
                        </div>
                        <div class="priority-item low">
                            <span class="priority-title">Team building activities</span>
                            <span class="priority-status">To Do</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showWeeklyReviewView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Weekly Review</h1>
                <span class="review-week">Week of Mar 18</span>
            </div>
            
            <div class="weekly-review-container">
                <div class="review-section">
                    <h3>Accomplishments</h3>
                    <div class="accomplishment-list">
                        <div class="accomplishment-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Completed product roadmap planning</span>
                        </div>
                        <div class="accomplishment-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Conducted user research interviews</span>
                        </div>
                        <div class="accomplishment-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Launched new dashboard feature</span>
                        </div>
                    </div>
                </div>
                
                <div class="review-section">
                    <h3>Challenges & Learnings</h3>
                    <textarea placeholder="What challenges did you face? What did you learn?"></textarea>
                </div>
                
                <div class="review-section">
                    <h3>Next Week Focus</h3>
                    <textarea placeholder="What will you focus on next week?"></textarea>
                </div>
            </div>
        `;
    }

    updateCurrentTime() {
        const timeElements = document.querySelectorAll('.current-time');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        timeElements.forEach(element => {
            element.textContent = timeString;
        });
    }

    startClock() {
        setInterval(() => {
            this.updateCurrentTime();
        }, 60000); // Update every minute
    }

    loadTasks() {
        const stored = localStorage.getItem('productivityTasks');
        return stored ? JSON.parse(stored) : this.getDefaultTasks();
    }

    getDefaultTasks() {
        return {
            monday: [
                { id: 1, time: '9:00 AM', description: 'Review Q1 goals and set OKRs for Q2 #planning', duration: '1h', project: 'Product', completed: false },
                { id: 2, time: '10:00 AM', description: 'Team standup and project sync #product', duration: '30m', project: 'Product', completed: false },
                { id: 3, time: '2:00 PM', description: 'User research analysis and insights documentation #product', duration: '2h', project: 'Product', completed: false }
            ],
            tuesday: [
                { id: 4, time: '9:00 AM', description: 'Competitive analysis and market research #growth', duration: '2h', project: 'Growth', completed: false },
                { id: 5, time: '11:00 AM', description: 'Growth strategy brainstorming session #growth', duration: '1.5h', project: 'Growth', completed: false },
                { id: 6, time: '3:00 PM', description: 'Review and optimize conversion funnel #growth', duration: '1h', project: 'Growth', completed: false }
            ],
            wednesday: [
                { id: 7, time: '9:00 AM', description: 'Product roadmap planning and prioritization #product', duration: '2h', project: 'Product', completed: false },
                { id: 8, time: '11:00 AM', description: 'Stakeholder meeting for feature approvals #product', duration: '1h', project: 'Product', completed: false },
                { id: 9, time: '2:00 PM', description: 'Design system review and updates #product', duration: '1.5h', project: 'Product', completed: false },
                { id: 10, time: '4:00 PM', description: 'Weekly team retrospective and planning #planning', duration: '1h', project: 'Planning', completed: false }
            ]
        };
    }

    getAllTasksForToday() {
        const today = new Date().getDay();
        const dayMap = { 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday' };
        const todayKey = dayMap[today] || 'wednesday';
        const todayTasks = this.tasks[todayKey] || [];
        
        return {
            todo: todayTasks.filter(task => !task.completed),
            inProgress: todayTasks.filter(task => !task.completed), // Simplified for demo
            completed: todayTasks.filter(task => task.completed)
        };
    }

    createTaskElement(task) {
        return `
            <div class="task-item" data-task-id="${task.id}">
                <div class="task-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                </div>
                <div class="task-content">
                    <p class="task-description">${task.description}</p>
                    <div class="task-meta">
                        <span class="task-duration">${task.duration}</span>
                        <span class="task-project">${task.project}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn"><i class="fas fa-ellipsis-h"></i></button>
                </div>
            </div>
        `;
    }

    setupDragAndDrop() {
        // Basic drag and drop setup for tasks
        const taskItems = document.querySelectorAll('.task-item');
        
        taskItems.forEach(item => {
            item.draggable = true;
            
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', item.innerHTML);
                item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
            });
        });
    }

    setupTaskListDragAndDrop() {
        const taskGroups = document.querySelectorAll('.task-group');
        
        taskGroups.forEach(group => {
            group.addEventListener('dragover', (e) => {
                e.preventDefault();
                group.classList.add('drag-over');
            });
            
            group.addEventListener('dragleave', (e) => {
                group.classList.remove('drag-over');
            });
            
            group.addEventListener('drop', (e) => {
                e.preventDefault();
                group.classList.remove('drag-over');
                // Handle task drop logic here
            });
        });
    }

    setupAddTaskButtons() {
        // Setup add task functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-task-btn')) {
                this.showAddTaskModal();
            }
        });
    }

    showAddTaskModal() {
        // Create and show add task modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Add New Task</h2>
                <form id="add-task-form">
                    <div class="form-group">
                        <label>Task Description</label>
                        <input type="text" name="description" required>
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="time" name="time" required>
                    </div>
                    <div class="form-group">
                        <label>Duration</label>
                        <input type="text" name="duration" placeholder="e.g., 1h, 30m">
                    </div>
                    <div class="form-group">
                        <label>Project</label>
                        <input type="text" name="project" placeholder="e.g., Product, Growth">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="submit-btn">Add Task</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        modal.querySelector('#add-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewTask(new FormData(e.target));
            modal.remove();
        });
        
        // Handle cancel
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });
    }

    addNewTask(formData) {
        const newTask = {
            id: Date.now(),
            time: formData.get('time'),
            description: formData.get('description'),
            duration: formData.get('duration'),
            project: formData.get('project'),
            completed: false
        };
        
        // Add to today's tasks
        const today = new Date().getDay();
        const dayMap = { 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday' };
        const todayKey = dayMap[today] || 'wednesday';
        
        if (!this.tasks[todayKey]) {
            this.tasks[todayKey] = [];
        }
        
        this.tasks[todayKey].push(newTask);
        this.saveTasks();
        this.renderTasks();
    }

    updateTaskStatus(taskId, completed) {
        // Find and update task
        Object.keys(this.tasks).forEach(day => {
            const task = this.tasks[day].find(t => t.id == taskId);
            if (task) {
                task.completed = completed;
                this.saveTasks();
            }
        });
    }

    saveTasks() {
        localStorage.setItem('productivityTasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        // Re-render tasks if needed
        // This would be called when tasks are updated
    }

    updateTasksForDate(date) {
        // Update task display based on selected date
        // This would filter tasks based on the selected date
    }

    showTaskDetails(taskItem) {
        // Show task details modal or expand task
        console.log('Task details clicked:', taskItem);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductivityApp();
});

// Add some additional CSS for new components
const additionalCSS = `
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 32px;
}

.dashboard-card {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 24px;
}

.dashboard-card h3 {
    margin-bottom: 16px;
    color: var(--text-primary);
}

.progress-stats {
    display: flex;
    justify-content: space-between;
}

.stat {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
}

.stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.week-progress {
    text-align: center;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--border-color);
    border-radius: 4px;
    margin-bottom: 8px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    border-radius: 4px;
}

.focus-stats {
    text-align: center;
}

.focus-time {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
}

.focus-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.focus-container {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
}

.focus-timer {
    margin-bottom: 48px;
}

.timer-display {
    font-size: 4rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 24px;
}

.timer-controls {
    display: flex;
    justify-content: center;
    gap: 16px;
}

.timer-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    background: var(--surface);
    cursor: pointer;
    transition: var(--transition);
}

.timer-btn:hover {
    background: var(--background);
}

.focus-task {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 32px;
}

.focus-settings {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 24px;
    text-align: left;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.setting-item label {
    font-weight: 500;
}

.setting-item select {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    background: var(--surface);
}

.task-list-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
}

.task-section h3 {
    margin-bottom: 16px;
    color: var(--text-primary);
}

.task-group {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 16px;
    min-height: 200px;
}

.task-group.drag-over {
    background: var(--background);
    border-color: var(--primary-color);
}

.task-checkbox {
    margin-right: 12px;
}

.task-actions {
    margin-left: auto;
}

.task-action-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
}

.add-task-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 12px 24px;
    cursor: pointer;
    font-weight: 500;
    transition: var(--transition);
}

.add-task-btn:hover {
    background: var(--secondary-color);
}

.shutdown-container {
    max-width: 800px;
    margin: 0 auto;
}

.shutdown-checklist {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 32px;
}

.checklist-items {
    margin-top: 16px;
}

.checklist-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    cursor: pointer;
}

.checklist-item input {
    margin-right: 12px;
}

.shutdown-reflection {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 24px;
}

.shutdown-reflection textarea {
    width: 100%;
    min-height: 120px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 12px;
    margin-bottom: 16px;
    resize: vertical;
}

.save-reflection-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 12px 24px;
    cursor: pointer;
    font-weight: 500;
}

.highlights-container {
    max-width: 800px;
    margin: 0 auto;
}

.highlight-item {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 16px;
}

.highlight-date {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: 8px;
}

.highlight-content h3 {
    margin-bottom: 8px;
}

.highlight-content p {
    color: var(--text-secondary);
    margin-bottom: 16px;
}

.highlight-tags {
    display: flex;
    gap: 8px;
}

.tag {
    background: var(--background);
    color: var(--primary-color);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
}

.add-highlight-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 12px 24px;
    cursor: pointer;
    font-weight: 500;
}

.weekly-planning-container {
    max-width: 800px;
    margin: 0 auto;
}

.weekly-goals,
.weekly-priorities {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 24px;
}

.goal-input {
    width: 100%;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 12px;
    font-size: 1rem;
}

.priority-list {
    margin-top: 16px;
}

.priority-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-radius: var(--radius);
    margin-bottom: 8px;
}

.priority-item.high {
    background: rgba(239, 68, 68, 0.1);
    border-left: 4px solid #EF4444;
}

.priority-item.medium {
    background: rgba(245, 158, 11, 0.1);
    border-left: 4px solid #F59E0B;
}

.priority-item.low {
    background: rgba(34, 197, 94, 0.1);
    border-left: 4px solid #22C55E;
}

.priority-status {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.weekly-review-container {
    max-width: 800px;
    margin: 0 auto;
}

.review-section {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 24px;
}

.accomplishment-list {
    margin-top: 16px;
}

.accomplishment-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.accomplishment-item i {
    color: #22C55E;
    margin-right: 12px;
}

.review-section textarea {
    width: 100%;
    min-height: 100px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 12px;
    resize: vertical;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 32px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-content h2 {
    margin-bottom: 24px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 12px;
    font-size: 1rem;
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
}

.cancel-btn {
    background: var(--background);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 12px 24px;
    cursor: pointer;
    font-weight: 500;
}

.submit-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 12px 24px;
    cursor: pointer;
    font-weight: 500;
}

.task-item.completed {
    opacity: 0.6;
}

.task-item.completed .task-description {
    text-decoration: line-through;
}

.focus-toggle-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 12px 24px;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
}

.focus-toggle-btn:hover {
    background: var(--secondary-color);
}
`;

// Add the additional CSS to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);
