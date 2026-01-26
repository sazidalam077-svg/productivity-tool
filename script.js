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

        // Scheduled items (routine tasks)
        document.querySelectorAll('.scheduled-item').forEach(item => {
            item.addEventListener('click', (e) => {
                toggleRoutineItem(item);
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
                this.showHomeView();
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
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Daily Planning</h1>
                <div class="date-navigation">
                    <button class="nav-btn"><i class="fas fa-chevron-left"></i></button>
                    <span class="current-date">Loading...</span>
                    <button class="nav-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            
            <div class="planning-container" style="max-width: 900px; margin: 0 auto;">
                <div class="planning-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>Today's Focus</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">What is the single most important thing you need to accomplish today?</p>
                    <textarea id="focus-input" style="width: 100%; height: 80px; border: 1px solid var(--border-color); border-radius: var(--radius); padding: 12px; margin-top: 16px; font-family: inherit; font-size: 1rem;" placeholder="e.g., Finalize Q2 product roadmap presentation"></textarea>
                </div>
                
                <div class="planning-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>Schedule Overview</h3>
                    <div id="schedule-list" style="margin-top: 16px;">
                        <div class="schedule-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed var(--border-color); margin-bottom: 10px;">
                            <input type="time" style="border: 1px solid var(--border-color); border-radius: 4px; padding: 4px 8px;" value="09:00">
                            <input type="text" style="border: 1px solid var(--border-color); border-radius: 4px; padding: 4px 8px; flex: 1; margin: 0 10px;" placeholder="Activity description">
                            <button onclick="removeScheduleItem(this)" style="background: #EF4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">Remove</button>
                        </div>
                    </div>
                    <button onclick="addScheduleItem()" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Schedule Item
                    </button>
                </div>
                
                <div class="planning-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px;">
                    <h3>Tasks for Today</h3>
                    <div id="tasks-list" style="margin-top: 16px;">
                        <div class="task-item" style="display: flex; align-items: center; margin-bottom: 10px; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius);">
                            <input type="checkbox" style="margin-right: 12px;">
                            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="Enter a task...">
                        </div>
                    </div>
                    <button onclick="addTaskItem()" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Task
                    </button>
                </div>
            </div>
        `;
        
        // Re-attach event listeners
        setTimeout(() => {
            this.attachEventListeners();
            updateDateDisplay();
        }, 10);
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
                <div class="date-navigation">
                    <button class="nav-btn"><i class="fas fa-chevron-left"></i></button>
                    <span class="current-date">Loading...</span>
                    <button class="nav-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            
            <div class="shutdown-container" style="max-width: 800px; margin: 0 auto;">
                <div class="shutdown-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>Today's Accomplishments</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">What did you accomplish today?</p>
                    <textarea id="accomplishments" style="width: 100%; height: 120px; border: 1px solid var(--border-color); border-radius: var(--radius); padding: 12px; margin-top: 16px; font-family: inherit; font-size: 1rem;" placeholder="List your key achievements and wins today..."></textarea>
                </div>
                
                <div class="shutdown-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>Lessons Learned</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">What did you learn today?</p>
                    <textarea id="lessons" style="width: 100%; height: 100px; border: 1px solid var(--border-color); border-radius: var(--radius); padding: 12px; margin-top: 16px; font-family: inherit; font-size: 1rem;" placeholder="Key insights, challenges overcome, or skills learned..."></textarea>
                </div>
                
                <div class="shutdown-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>Tomorrow's Priorities</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">What are your top priorities for tomorrow?</p>
                    <textarea id="priorities" style="width: 100%; height: 100px; border: 1px solid var(--border-color); border-radius: var(--radius); padding: 12px; margin-top: 16px; font-family: inherit; font-size: 1rem;" placeholder="List your top 3-5 priorities for tomorrow..."></textarea>
                </div>
                
                <div class="shutdown-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px;">
                    <h3>Mood & Energy Check</h3>
                    <div style="margin-top: 16px;">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">How was your energy today?</label>
                            <div style="display: flex; gap: 12px;">
                                <button class="mood-btn" data-mood="low" style="flex: 1; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius); background: var(--surface); cursor: pointer;">😴 Low</button>
                                <button class="mood-btn" data-mood="medium" style="flex: 1; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius); background: var(--surface); cursor: pointer;">😐 Medium</button>
                                <button class="mood-btn" data-mood="high" style="flex: 1; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius); background: var(--surface); cursor: pointer;">⚡ High</button>
                            </div>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">How do you feel overall?</label>
                            <div style="display: flex; gap: 12px;">
                                <button class="feeling-btn" data-feeling="stressed" style="flex: 1; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius); background: var(--surface); cursor: pointer;">😰 Stressed</button>
                                <button class="feeling-btn" data-feeling="neutral" style="flex: 1; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius); background: var(--surface); cursor: pointer;">😐 Neutral</button>
                                <button class="feeling-btn" data-feeling="happy" style="flex: 1; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius); background: var(--surface); cursor: pointer;">😊 Happy</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 32px;">
                    <button onclick="saveShutdown()" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 12px 32px; cursor: pointer; font-weight: 500; font-size: 1.1rem;">
                        <i class="fas fa-check"></i> Complete Daily Shutdown
                    </button>
                </div>
            </div>
        `;
        
        // Re-attach event listeners
        setTimeout(() => {
            this.attachEventListeners();
            updateDateDisplay();
        }, 10);
    }

    showDailyHighlightsView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Daily Highlights</h1>
                <div class="date-navigation">
                    <button class="nav-btn"><i class="fas fa-chevron-left"></i></button>
                    <span class="current-date">Loading...</span>
                    <button class="nav-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            
            <div class="highlights-container" style="max-width: 800px; margin: 0 auto;">
                <div class="highlights-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>🌟 Today's Wins</h3>
                    <div id="wins-list" style="margin-top: 16px;">
                        <div class="highlight-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;">
                            <span style="font-size: 1.5rem;">🏆</span>
                            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="What was your biggest win today?">
                        </div>
                    </div>
                    <button onclick="addHighlight('win')" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Win
                    </button>
                </div>
                
                <div class="highlights-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>💡 Key Insights</h3>
                    <div id="insights-list" style="margin-top: 16px;">
                        <div class="highlight-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;">
                            <span style="font-size: 1.5rem;">💡</span>
                            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="What insight did you gain today?">
                        </div>
                    </div>
                    <button onclick="addHighlight('insight')" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Insight
                    </button>
                </div>
                
                <div class="highlights-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>🙏 Gratitude Moments</h3>
                    <div id="gratitude-list" style="margin-top: 16px;">
                        <div class="highlight-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;">
                            <span style="font-size: 1.5rem;">🙏</span>
                            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="What are you grateful for today?">
                        </div>
                    </div>
                    <button onclick="addHighlight('gratitude')" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Gratitude
                    </button>
                </div>
                
                <div class="highlights-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px;">
                    <h3>📊 Daily Summary</h3>
                    <div style="margin-top: 16px; text-align: center;">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);" id="wins-count">0</div>
                                <div style="font-size: 0.875rem; color: var(--text-secondary);">Wins</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);" id="insights-count">0</div>
                                <div style="font-size: 0.875rem; color: var(--text-secondary);">Insights</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);" id="gratitude-count">0</div>
                                <div style="font-size: 0.875rem; color: var(--text-secondary);">Gratitude</div>
                            </div>
                        </div>
                        <button onclick="saveHighlights()" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 12px 32px; cursor: pointer; font-weight: 500;">
                            <i class="fas fa-save"></i> Save Highlights
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Re-attach event listeners
        setTimeout(() => {
            this.attachEventListeners();
            updateDateDisplay();
        }, 10);
    }

    showWeeklyPlanningView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Weekly Planning</h1>
                <div class="date-navigation">
                    <button class="nav-btn"><i class="fas fa-chevron-left"></i></button>
                    <span class="current-date">Loading...</span>
                    <button class="nav-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            
            <div class="weekly-container" style="max-width: 1000px; margin: 0 auto;">
                <div class="weekly-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>🎯 Weekly Goals</h3>
                    <div id="weekly-goals" style="margin-top: 16px;">
                        <div class="goal-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;">
                            <input type="checkbox" style="margin-right: 8px;">
                            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="Enter weekly goal...">
                            <select style="padding: 4px 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                                <option>High Priority</option>
                                <option>Medium Priority</option>
                                <option>Low Priority</option>
                            </select>
                        </div>
                    </div>
                    <button onclick="addWeeklyGoal()" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Goal
                    </button>
                </div>
                
                <div class="weekly-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <div class="day-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 16px;">
                        <h4>Monday</h4>
                        <div class="day-tasks" style="margin-top: 8px;">
                            <input type="text" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; margin-bottom: 8px;" placeholder="Key task for Monday...">
                        </div>
                    </div>
                    <div class="day-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 16px;">
                        <h4>Tuesday</h4>
                        <div class="day-tasks" style="margin-top: 8px;">
                            <input type="text" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; margin-bottom: 8px;" placeholder="Key task for Tuesday...">
                        </div>
                    </div>
                    <div class="day-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 16px;">
                        <h4>Wednesday</h4>
                        <div class="day-tasks" style="margin-top: 8px;">
                            <input type="text" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; margin-bottom: 8px;" placeholder="Key task for Wednesday...">
                        </div>
                    </div>
                    <div class="day-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 16px;">
                        <h4>Thursday</h4>
                        <div class="day-tasks" style="margin-top: 8px;">
                            <input type="text" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; margin-bottom: 8px;" placeholder="Key task for Thursday...">
                        </div>
                    </div>
                    <div class="day-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 16px;">
                        <h4>Friday</h4>
                        <div class="day-tasks" style="margin-top: 8px;">
                            <input type="text" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; margin-bottom: 8px;" placeholder="Key task for Friday...">
                        </div>
                    </div>
                </div>
                
                <div class="weekly-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px;">
                    <h3>📋 Weekly Focus Areas</h3>
                    <div style="margin-top: 16px;">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Primary Focus</label>
                            <input type="text" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="What's your main focus this week?">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Secondary Focus</label>
                            <input type="text" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="What's your secondary focus?">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Personal Development</label>
                            <input type="text" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="What skill will you develop?">
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 24px;">
                    <button onclick="saveWeeklyPlan()" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 12px 32px; cursor: pointer; font-weight: 500;">
                        <i class="fas fa-save"></i> Save Weekly Plan
                    </button>
                </div>
            </div>
        `;
        
        // Re-attach event listeners
        setTimeout(() => {
            this.attachEventListeners();
            updateDateDisplay();
        }, 10);
    }

    showWeeklyReviewView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Weekly Review</h1>
                <div class="date-navigation">
                    <button class="nav-btn"><i class="fas fa-chevron-left"></i></button>
                    <span class="current-date">Loading...</span>
                    <button class="nav-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            
            <div class="review-container" style="max-width: 900px; margin: 0 auto;">
                <div class="review-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>📊 Week Performance</h3>
                    <div style="margin-top: 16px;">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Goals Completed</label>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <input type="number" style="width: 80px; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="0" value="0">
                                    <span>/</span>
                                    <input type="number" style="width: 80px; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="0" value="0">
                                </div>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Focus Time (hours)</label>
                                <input type="number" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="0" value="0">
                            </div>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Overall Rating</label>
                            <div style="display: flex; gap: 8px;">
                                <button class="rating-btn" data-rating="1" style="flex: 1; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); background: var(--surface); cursor: pointer; font-size: 1.2rem;">⭐</button>
                                <button class="rating-btn" data-rating="2" style="flex: 1; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); background: var(--surface); cursor: pointer; font-size: 1.2rem;">⭐⭐</button>
                                <button class="rating-btn" data-rating="3" style="flex: 1; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); background: var(--surface); cursor: pointer; font-size: 1.2rem;">⭐⭐⭐</button>
                                <button class="rating-btn" data-rating="4" style="flex: 1; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); background: var(--surface); cursor: pointer; font-size: 1.2rem;">⭐⭐⭐⭐</button>
                                <button class="rating-btn" data-rating="5" style="flex: 1; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); background: var(--surface); cursor: pointer; font-size: 1.2rem;">⭐⭐⭐⭐⭐</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="review-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>🎯 Key Achievements</h3>
                    <div id="achievements-list" style="margin-top: 16px;">
                        <div class="achievement-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;">
                            <span style="font-size: 1.5rem;">🏆</span>
                            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="What was your biggest achievement this week?">
                        </div>
                    </div>
                    <button onclick="addAchievement()" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Achievement
                    </button>
                </div>
                
                <div class="review-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>🧠 Lessons Learned</h3>
                    <div id="lessons-list" style="margin-top: 16px;">
                        <div class="lesson-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;">
                            <span style="font-size: 1.5rem;">💡</span>
                            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="What did you learn this week?">
                        </div>
                    </div>
                    <button onclick="addLesson()" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Lesson
                    </button>
                </div>
                
                <div class="review-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>🔄 Areas for Improvement</h3>
                    <div id="improvements-list" style="margin-top: 16px;">
                        <div class="improvement-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;">
                            <span style="font-size: 1.5rem;">🎯</span>
                            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="What could be improved next week?">
                        </div>
                    </div>
                    <button onclick="addImprovement()" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Improvement
                    </button>
                </div>
                
                <div class="review-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px;">
                    <h3>📈 Next Week Planning</h3>
                    <div style="margin-top: 16px;">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Top 3 Priorities</label>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <input type="text" style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="Priority #1">
                                <input type="text" style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="Priority #2">
                                <input type="text" style="padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="Priority #3">
                            </div>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Weekly Focus</label>
                            <input type="text" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="What will be your main focus next week?">
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 24px;">
                    <button onclick="saveWeeklyReview()" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 12px 32px; cursor: pointer; font-weight: 500;">
                        <i class="fas fa-save"></i> Save Weekly Review
                    </button>
                </div>
            </div>
        `;
        
        // Re-attach event listeners
        setTimeout(() => {
            this.attachEventListeners();
            updateDateDisplay();
        }, 10);
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

    attachEventListeners() {
        // Task items
        const taskItems = document.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            item.addEventListener('click', function() {
                this.classList.toggle('completed');
                const isCompleted = this.classList.contains('completed');
                showNotification(isCompleted ? 'Task completed!' : 'Task marked as incomplete');
            });
        });

        // Date navigation buttons
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const isNext = this.querySelector('.fa-chevron-right');
                if (isNext) {
                    navigateNextDay();
                } else {
                    navigatePreviousDay();
                }
            });
        });

        // Scheduled items (routine tasks)
        const scheduledItems = document.querySelectorAll('.scheduled-item');
        scheduledItems.forEach(item => {
            item.addEventListener('click', function() {
                toggleRoutineItem(this);
            });
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ProductivityApp();
    
    // Initialize date display
    updateDateDisplay();
    
    // Update time every minute
    setInterval(updateTime, 60000);
    updateTime();
});

// Date navigation functionality
let currentDate = new Date();

function updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = currentDate.toLocaleDateString('en-US', options);
    
    // Update all date displays
    const dateElements = document.querySelectorAll('.current-date');
    dateElements.forEach(element => {
        element.textContent = dateString;
    });
}

function navigatePreviousDay() {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateDisplay();
    showNotification('Navigated to previous day');
}

function navigateNextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateDisplay();
    showNotification('Navigated to next day');
}

function updateTime() {
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

// Supporting functions for new features
function showNotification(message) {
    console.log('Notification:', message);
    
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: var(--radius);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function toggleRoutineItem(element) {
    const checkIcon = element.querySelector('.fa-check');
    if (checkIcon) {
        const isCompleted = checkIcon.style.opacity === '1';
        checkIcon.style.opacity = isCompleted ? '0' : '1';
        
        if (isCompleted) {
            element.style.background = 'linear-gradient(135deg, #FEF3C7, #FDE68A)';
            showNotification('Morning routine marked as incomplete');
        } else {
            element.style.background = 'linear-gradient(135deg, #D1FAE5, #A7F3D0)';
            showNotification('Morning routine completed! Great start to the day! 🌅');
        }
    }
}

function addHighlight(type) {
    const listId = type + '-list';
    const list = document.getElementById(listId);
    if (list) {
        const newItem = document.createElement('div');
        newItem.className = 'highlight-item';
        newItem.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;';
        
        const icons = {
            win: '🏆',
            insight: '💡',
            gratitude: '🙏'
        };
        
        newItem.innerHTML = `
            <span style="font-size: 1.5rem;">${icons[type]}</span>
            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="Add another ${type}...">
        `;
        
        list.appendChild(newItem);
        updateHighlightCounts();
        showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} added!`);
    }
}

function updateHighlightCounts() {
    const winsCount = document.querySelectorAll('#wins-list .highlight-item').length;
    const insightsCount = document.querySelectorAll('#insights-list .highlight-item').length;
    const gratitudeCount = document.querySelectorAll('#gratitude-list .highlight-item').length;
    
    const winsElement = document.getElementById('wins-count');
    const insightsElement = document.getElementById('insights-count');
    const gratitudeElement = document.getElementById('gratitude-count');
    
    if (winsElement) winsElement.textContent = winsCount;
    if (insightsElement) insightsElement.textContent = insightsCount;
    if (gratitudeElement) gratitudeElement.textContent = gratitudeCount;
}

function saveHighlights() {
    showNotification('Highlights saved successfully! 🌟');
}

function addWeeklyGoal() {
    const goalsList = document.getElementById('weekly-goals');
    if (goalsList) {
        const newItem = document.createElement('div');
        newItem.className = 'goal-item';
        newItem.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;';
        newItem.innerHTML = `
            <input type="checkbox" style="margin-right: 8px;">
            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="Enter weekly goal...">
            <select style="padding: 4px 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                <option>High Priority</option>
                <option>Medium Priority</option>
                <option>Low Priority</option>
            </select>
        `;
        goalsList.appendChild(newItem);
        showNotification('Weekly goal added! 🎯');
    }
}

function saveWeeklyPlan() {
    showNotification('Weekly plan saved successfully! 📋');
}

function addAchievement() {
    const list = document.getElementById('achievements-list');
    if (list) {
        const newItem = document.createElement('div');
        newItem.className = 'achievement-item';
        newItem.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;';
        newItem.innerHTML = `
            <span style="font-size: 1.5rem;">🏆</span>
            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="What was your biggest achievement this week?">
        `;
        list.appendChild(newItem);
        showNotification('Achievement added! 🏆');
    }
}

function addLesson() {
    const list = document.getElementById('lessons-list');
    if (list) {
        const newItem = document.createElement('div');
        newItem.className = 'lesson-item';
        newItem.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;';
        newItem.innerHTML = `
            <span style="font-size: 1.5rem;">💡</span>
            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="What did you learn this week?">
        `;
        list.appendChild(newItem);
        showNotification('Lesson added! 💡');
    }
}

function addImprovement() {
    const list = document.getElementById('improvements-list');
    if (list) {
        const newItem = document.createElement('div');
        newItem.className = 'improvement-item';
        newItem.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;';
        newItem.innerHTML = `
            <span style="font-size: 1.5rem;">🎯</span>
            <input type="text" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="What could be improved next week?">
        `;
        list.appendChild(newItem);
        showNotification('Improvement area added! 🎯');
    }
}

function saveWeeklyReview() {
    showNotification('Weekly review saved successfully! 📊');
}

function saveShutdown() {
    showNotification('Daily shutdown completed! Great job today! 🎉');
}

// Add event listeners for mood and feeling buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('mood-btn')) {
        // Remove active state from all mood buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.style.background = 'var(--surface)';
        });
        // Add active state to clicked button
        e.target.style.background = 'var(--primary-color)';
        e.target.style.color = 'white';
        showNotification('Energy level: ' + e.target.dataset.mood);
    }
    
    if (e.target.classList.contains('feeling-btn')) {
        // Remove active state from all feeling buttons
        document.querySelectorAll('.feeling-btn').forEach(btn => {
            btn.style.background = 'var(--surface)';
        });
        // Add active state to clicked button
        e.target.style.background = 'var(--primary-color)';
        e.target.style.color = 'white';
        showNotification('Feeling: ' + e.target.dataset.feeling);
    }
    
    if (e.target.classList.contains('rating-btn')) {
        // Remove active state from all rating buttons
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.style.background = 'var(--surface)';
        });
        // Add active state to clicked button
        e.target.style.background = 'var(--primary-color)';
        e.target.style.color = 'white';
        const rating = e.target.dataset.rating;
        showNotification('Week rating: ' + rating + ' stars ⭐');
    }
});

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
