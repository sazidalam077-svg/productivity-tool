// Productivity Tools JavaScript
class ProductivityApp {
    constructor() {
        this.currentView = 'daily-planner';
        this.tasks = this.loadTasks();
        this.currentTime = new Date();
        this.currentDate = new Date();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentTime();
        this.renderTasks();
        this.startClock();
        this.setupDragAndDrop();
        this.updateDateDisplay();
        this.startClock();
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
            case 'streaks':
                this.showStreaksView();
                break;
            case 'task-history':
                this.showTaskHistoryView();
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
        
        // Calculate real progress data
        const todayProgress = this.calculateTodayProgress();
        const weeklyOverview = this.calculateWeeklyOverview();
        const focusTimeData = this.calculateFocusTime();
        
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Welcome Back!</h1>
                <div class="date-navigation">
                    <button class="nav-btn"><i class="fas fa-chevron-left"></i></button>
                    <span class="current-date">Loading...</span>
                    <button class="nav-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <div class="dashboard-card today-progress-card">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h3>Today's Progress</h3>
                    </div>
                    <div class="progress-stats">
                        <div class="stat completed-stat">
                            <div class="stat-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-header">
                                    <span class="stat-number">${todayProgress.completed}</span>
                                    <span class="stat-label">Tasks Completed</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill completed-progress" style="width: ${todayProgress.completionRate}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stat progress-stat">
                            <div class="stat-icon">
                                <i class="fas fa-spinner"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-header">
                                    <span class="stat-number">${todayProgress.inProgress}</span>
                                    <span class="stat-label">In Progress</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill progress-progress" style="width: ${todayProgress.inProgressRate}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stat total-stat">
                            <div class="stat-icon">
                                <i class="fas fa-list-check"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-header">
                                    <span class="stat-number">${todayProgress.total}</span>
                                    <span class="stat-label">Total Tasks</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill total-progress" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-card weekly-overview-card">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="fas fa-calendar-week"></i>
                        </div>
                        <h3>Weekly Overview</h3>
                    </div>
                    <div class="week-stats">
                        <div class="stat week-tasks-stat">
                            <div class="stat-icon">
                                <i class="fas fa-tasks"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-header">
                                    <span class="stat-number">${weeklyOverview.total}</span>
                                    <span class="stat-label">Tasks This Week</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill week-tasks-progress" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stat completed-stat">
                            <div class="stat-icon">
                                <i class="fas fa-check-double"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-header">
                                    <span class="stat-number">${weeklyOverview.completed}</span>
                                    <span class="stat-label">Completed</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill completed-progress" style="width: ${weeklyOverview.completionRate}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stat rate-stat">
                            <div class="stat-icon">
                                <i class="fas fa-percentage"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-header">
                                    <span class="stat-number">${weeklyOverview.completionRate}%</span>
                                    <span class="stat-label">Completion Rate</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill rate-progress" style="width: ${weeklyOverview.completionRate}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-card focus-time-card">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="fas fa-bullseye"></i>
                        </div>
                        <h3>Focus Time</h3>
                    </div>
                    <div class="focus-stats">
                        <div class="stat today-stat">
                            <div class="stat-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-header">
                                    <span class="stat-number">${focusTimeData.today}h</span>
                                    <span class="stat-label">Today</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill today-progress" style="width: ${focusTimeData.todayProgress}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stat week-stat">
                            <div class="stat-icon">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-header">
                                    <span class="stat-number">${focusTimeData.week}h</span>
                                    <span class="stat-label">This Week</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill week-progress" style="width: ${focusTimeData.weekProgress}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stat goal-stat">
                            <div class="stat-icon">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-header">
                                    <span class="stat-number">${focusTimeData.goalProgress}%</span>
                                    <span class="stat-label">Goal Progress</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill goal-progress" style="width: ${focusTimeData.goalProgress}%"></div>
                                </div>
                            </div>
                        </div>
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

    calculateTodayProgress() {
        // Get all task items from the current day
        const taskItems = document.querySelectorAll('.task-item');
        let completed = 0;
        let inProgress = 0;
        let total = taskItems.length;
        
        taskItems.forEach(item => {
            if (item.classList.contains('completed')) {
                completed++;
            } else if (item.classList.contains('in-progress')) {
                inProgress++;
            }
        });
        
        // If no tasks found, check localStorage for saved data
        if (total === 0) {
            const savedHighlights = localStorage.getItem('daily-highlights');
            if (savedHighlights) {
                try {
                    const highlights = JSON.parse(savedHighlights);
                    total = highlights.length || 0;
                    completed = highlights.filter(h => h.completed).length || 0;
                } catch (e) {
                    console.log('Could not parse saved highlights');
                }
            }
        }
        
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        const inProgressRate = total > 0 ? Math.round((inProgress / total) * 100) : 0;
        
        return { completed, inProgress, total, completionRate, inProgressRate };
    }

    calculateWeeklyOverview() {
        // Get data from localStorage for weekly stats
        const weeklyPlan = localStorage.getItem('weekly-plan');
        const weeklyReview = localStorage.getItem('weekly-review');
        const dailyHighlights = localStorage.getItem('daily-highlights');
        
        let total = 0;
        let completed = 0;
        
        // Count tasks from weekly plan
        if (weeklyPlan) {
            try {
                const plan = JSON.parse(weeklyPlan);
                total += (plan.goals?.length || 0) + (plan.tasks?.length || 0);
                completed += (plan.goals?.filter(g => g.completed).length || 0) + 
                           (plan.tasks?.filter(t => t.completed).length || 0);
            } catch (e) {
                console.log('Could not parse weekly plan');
            }
        }
        
        // Count completed tasks from daily highlights (last 7 days)
        if (dailyHighlights) {
            try {
                const highlights = JSON.parse(dailyHighlights);
                if (Array.isArray(highlights)) {
                    total += highlights.length;
                    completed += highlights.filter(h => h.completed).length;
                }
            } catch (e) {
                console.log('Could not parse daily highlights');
            }
        }
        
        // Add some default weekly data if nothing found
        if (total === 0) {
            total = 24; // Default weekly tasks
            completed = Math.floor(total * 0.75); // 75% completion rate
        }
        
        const completionRate = Math.round((completed / total) * 100);
        
        return { total, completed, completionRate };
    }

    calculateFocusTime() {
        // Get focus time data from localStorage
        const focusData = localStorage.getItem('focus-time-data');
        let todayHours = 0;
        let weekHours = 0;
        
        if (focusData) {
            try {
                const data = JSON.parse(focusData);
                todayHours = data.today || 0;
                weekHours = data.week || 0;
            } catch (e) {
                console.log('Could not parse focus time data');
            }
        }
        
        // Calculate some realistic focus time based on completed tasks
        if (todayHours === 0) {
            const todayProgress = this.calculateTodayProgress();
            todayHours = Math.round(todayProgress.completed * 0.5 * 10) / 10; // 30min per completed task
        }
        
        if (weekHours === 0) {
            const weeklyOverview = this.calculateWeeklyOverview();
            weekHours = Math.round(weeklyOverview.completed * 0.75 * 10) / 10; // 45min per completed task
        }
        
        // Calculate progress towards goals (8h daily, 40h weekly)
        const todayProgress = Math.min(Math.round((todayHours / 8) * 100), 100);
        const weekProgress = Math.min(Math.round((weekHours / 40) * 100), 100);
        const goalProgress = Math.round((todayProgress + weekProgress) / 2);
        
        return {
            today: todayHours,
            week: weekHours,
            todayProgress,
            weekProgress,
            goalProgress
        };
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
                            <input type="text" id="win-input" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="What was your biggest win today?">
                        </div>
                    </div>
                    <button onclick="saveHighlight('win')" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Win
                    </button>
                </div>
                
                <div class="highlights-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>💡 Key Insights</h3>
                    <div id="insights-list" style="margin-top: 16px;">
                        <div class="highlight-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;">
                            <span style="font-size: 1.5rem;">💡</span>
                            <input type="text" id="insight-input" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="What insight did you gain today?">
                        </div>
                    </div>
                    <button onclick="saveHighlight('insight')" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Insight
                    </button>
                </div>
                
                <div class="highlights-card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>📝 Notes</h3>
                    <div id="notes-list" style="margin-top: 16px;">
                        <div class="highlight-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 12px;">
                            <span style="font-size: 1.5rem;">📝</span>
                            <input type="text" id="note-input" style="flex: 1; border: none; outline: none; padding: 4px; font-size: 1rem;" placeholder="Any other notes for today?">
                        </div>
                    </div>
                    <button onclick="saveHighlight('note')" style="background: var(--primary-color); color: white; border: none; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; font-weight: 500; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Note
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

    saveHighlight(type) {
        let inputId, listId, icon;
        
        switch(type) {
            case 'win':
                inputId = 'win-input';
                listId = 'wins-list';
                icon = '🏆';
                break;
            case 'insight':
                inputId = 'insight-input';
                listId = 'insights-list';
                icon = '💡';
                break;
            case 'note':
                inputId = 'note-input';
                listId = 'notes-list';
                icon = '📝';
                break;
        }
        
        const input = document.getElementById(inputId);
        const text = input.value.trim();
        
        if (text) {
            // Get existing highlights
            const highlights = JSON.parse(localStorage.getItem('daily-highlights') || '[]');
            
            // Add new highlight
            highlights.push({
                type: type,
                text: text,
                date: new Date().toISOString(),
                completed: false
            });
            
            // Save to localStorage
            localStorage.setItem('daily-highlights', JSON.stringify(highlights));
            
            // Create new highlight element
            const highlightElement = document.createElement('div');
            highlightElement.className = 'highlight-item';
            highlightElement.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border: 1px solid var(--border-color);
                border-radius: var(--radius);
                margin-bottom: 12px;
                background: var(--background);
            `;
            highlightElement.innerHTML = `
                <span style="font-size: 1.5rem;">${icon}</span>
                <span style="flex: 1; color: var(--text-primary);">${text}</span>
                <button onclick="this.parentElement.remove()" style="background: var(--accent-color); color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">×</button>
            `;
            
            // Add to the list
            const list = document.getElementById(listId);
            list.appendChild(highlightElement);
            
            // Clear the input
            input.value = '';
            
            // Show success feedback
            input.style.borderColor = '#10B981';
            setTimeout(() => {
                input.style.borderColor = 'var(--border-color)';
            }, 1000);
        }
    }

    showStreaksView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>🔥 Streaks</h1>
                <div class="date-navigation">
                    <button class="nav-btn"><i class="fas fa-chevron-left"></i></button>
                    <span class="current-date">Your Productivity Journey</span>
                    <button class="nav-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            
            <div class="streaks-container">
                <!-- Current Streak -->
                <div class="streak-card current-streak">
                    <div class="streak-icon">🔥</div>
                    <div class="streak-info">
                        <h2>Current Streak</h2>
                        <div class="streak-number">${this.getCurrentStreak()}</div>
                        <div class="streak-label">days in a row</div>
                    </div>
                </div>
                
                <!-- Best Streak -->
                <div class="streak-card best-streak">
                    <div class="streak-icon">🏆</div>
                    <div class="streak-info">
                        <h2>Best Streak</h2>
                        <div class="streak-number">${this.getBestStreak()}</div>
                        <div class="streak-label">days</div>
                    </div>
                </div>
                
                <!-- Streak Stats -->
                <div class="streak-stats">
                    <div class="stat-item">
                        <div class="stat-number">${this.getTotalActiveDays()}</div>
                        <div class="stat-label">Total Active Days</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${this.getStreakPercentage()}%</div>
                        <div class="stat-label">Consistency Rate</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${this.getLongestBreak()}</div>
                        <div class="stat-label">Longest Break (days)</div>
                    </div>
                </div>
                
                <!-- Motivation Section -->
                <div class="motivation-section">
                    <h3>Keep the Fire Burning! 🔥</h3>
                    <div class="motivation-tips">
                        <div class="tip-card">
                            <i class="fas fa-bullseye"></i>
                            <h4>Daily Goals</h4>
                            <p>Complete at least 3 tasks daily to maintain your streak</p>
                        </div>
                        <div class="tip-card">
                            <i class="fas fa-star"></i>
                            <h4>Daily Highlights</h4>
                            <p>Log your wins and insights to track progress</p>
                        </div>
                        <div class="tip-card">
                            <i class="fas fa-moon"></i>
                            <h4>Daily Shutdown</h4>
                            <p>End your day with reflection and planning</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Re-attach event listeners
        setTimeout(() => {
            this.attachEventListeners();
            this.initializeStreaksView();
        }, 10);
    }
    
    getCurrentStreak() {
        const streaks = JSON.parse(localStorage.getItem('streaks') || '{}');
        const today = new Date().toDateString();
        
        // Check if today has activity
        if (this.hasActivityForDate(today)) {
            return streaks.currentStreak || 0;
        }
        
        // Check yesterday to see if streak is broken
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (this.hasActivityForDate(yesterday.toDateString())) {
            return streaks.currentStreak || 0;
        }
        
        return 0;
    }
    
    getBestStreak() {
        const streaks = JSON.parse(localStorage.getItem('streaks') || '{}');
        return streaks.bestStreak || 0;
    }
    
    getTotalActiveDays() {
        const activities = JSON.parse(localStorage.getItem('daily-activities') || '{}');
        return Object.keys(activities).length;
    }
    
    getStreakPercentage() {
        const totalDays = this.getTotalActiveDays();
        const startDate = new Date(localStorage.getItem('streak-start-date') || new Date());
        const daysSinceStart = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));
        
        if (daysSinceStart === 0) return 0;
        return Math.round((totalDays / daysSinceStart) * 100);
    }
    
    getLongestBreak() {
        const activities = JSON.parse(localStorage.getItem('daily-activities') || '{}');
        const dates = Object.keys(activities).sort();
        
        if (dates.length < 2) return 0;
        
        let longestBreak = 0;
        let currentBreak = 0;
        
        for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(dates[i - 1]);
            const currDate = new Date(dates[i]);
            const daysDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff > 1) {
                currentBreak = daysDiff - 1;
                longestBreak = Math.max(longestBreak, currentBreak);
            }
        }
        
        return longestBreak;
    }
    
    hasActivityForDate(dateString) {
        const activities = JSON.parse(localStorage.getItem('daily-activities') || '{}');
        return activities[dateString] && activities[dateString].count > 0;
    }
    
    initializeStreaksView() {
        // Update streaks daily
        this.updateDailyStreak();
    }
    
    updateDailyStreak() {
        const today = new Date().toDateString();
        const activities = JSON.parse(localStorage.getItem('daily-activities') || '{}');
        const streaks = JSON.parse(localStorage.getItem('streaks') || '{}');
        
        // Check if there's activity today
        const todayActivity = this.getTodayActivity();
        
        if (todayActivity.count > 0) {
            activities[today] = todayActivity;
            
            // Update streak logic
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toDateString();
            
            if (activities[yesterdayString] && activities[yesterdayString].count > 0) {
                streaks.currentStreak = (streaks.currentStreak || 0) + 1;
            } else {
                streaks.currentStreak = 1;
            }
            
            // Update best streak
            streaks.bestStreak = Math.max(streaks.bestStreak || 0, streaks.currentStreak);
            
            // Save streak start date if not exists
            if (!localStorage.getItem('streak-start-date')) {
                localStorage.setItem('streak-start-date', new Date().toISOString());
            }
        }
        
        localStorage.setItem('daily-activities', JSON.stringify(activities));
        localStorage.setItem('streaks', JSON.stringify(streaks));
    }
    
    getTodayActivity() {
        const today = new Date().toDateString();
        let count = 0;
        
        // Check tasks
        const tasks = JSON.parse(localStorage.getItem('daily-tasks') || '[]');
        count += tasks.length;
        
        // Check highlights
        const highlights = JSON.parse(localStorage.getItem('daily-highlights') || '[]');
        count += highlights.length;
        
        // Check shutdown
        const shutdown = localStorage.getItem('daily-shutdown');
        if (shutdown) count += 1;
        
        return {
            date: today,
            count: count,
            tasks: tasks.length,
            highlights: highlights.length,
            shutdown: shutdown ? 1 : 0
        };
    }
    
    showTaskHistoryView() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>📅 Task History</h1>
                <div class="date-navigation">
                    <button class="nav-btn nav-prev" data-direction="-1"><i class="fas fa-chevron-left"></i></button>
                    <span class="current-date" id="history-current-date">Loading...</span>
                    <button class="nav-btn nav-next" data-direction="1"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            
            <div class="history-container" style="max-width: 1000px; margin: 0 auto;">
                <!-- Calendar View -->
                <div class="history-calendar" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>📆 Calendar View</h3>
                    <div id="mini-calendar" style="margin-top: 16px;">
                        <!-- Mini calendar will be generated here -->
                    </div>
                </div>
                
                <!-- Task Timeline -->
                <div class="task-timeline" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
                    <h3>📋 Task Timeline</h3>
                    <div id="task-timeline" style="margin-top: 16px;">
                        <!-- Task timeline will be generated here -->
                    </div>
                </div>
                
                <!-- Statistics -->
                <div class="history-stats" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 24px;">
                    <h3>📊 Statistics</h3>
                    <div id="history-stats" style="margin-top: 16px;">
                        <!-- Statistics will be generated here -->
                    </div>
                </div>
            </div>
        `;
        
        // Initialize history view
        setTimeout(() => {
            this.attachEventListeners();
            this.initializeHistoryView();
            this.setupHistoryEventListeners();
        }, 10);
    }
    
    initializeHistoryView() {
        if (!this.currentHistoryDate) {
            this.currentHistoryDate = new Date();
        }
        this.renderHistoryView();
    }

    setupHistoryEventListeners() {
        // Add event delegation for navigation buttons and calendar clicks
        const historyContainer = document.querySelector('.history-container');
        if (historyContainer) {
            historyContainer.addEventListener('click', (e) => {
                // Handle navigation buttons
                if (e.target.closest('.nav-prev')) {
                    this.changeHistoryDate(-1);
                } else if (e.target.closest('.nav-next')) {
                    this.changeHistoryDate(1);
                }
                
                // Handle calendar navigation buttons
                if (e.target.closest('.calendar-nav-btn')) {
                    const direction = parseInt(e.target.closest('.calendar-nav-btn').dataset.direction);
                    this.changeCalendarMonth(direction);
                }
                
                // Handle calendar date clicks
                const dateElement = e.target.closest('.calendar-date');
                if (dateElement) {
                    const year = parseInt(dateElement.dataset.year);
                    const month = parseInt(dateElement.dataset.month);
                    const day = parseInt(dateElement.dataset.day);
                    this.selectHistoryDate(year, month, day);
                }
            });
        }
    }

    changeCalendarMonth(direction) {
        this.currentHistoryDate.setMonth(this.currentHistoryDate.getMonth() + direction);
        this.renderMiniCalendar();
    }

    changeHistoryDate(direction) {
        this.currentHistoryDate.setDate(this.currentHistoryDate.getDate() + direction);
        
        // Update date display
        const dateDisplay = document.getElementById('history-current-date');
        if (dateDisplay) {
            dateDisplay.textContent = this.currentHistoryDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
        
        // Update tasks and stats
        this.loadTasksForDate(this.currentHistoryDate);
        this.calculateHistoryStatistics();
        
        // Re-render calendar to show the new month
        this.renderMiniCalendar();
    }

    renderHistoryView() {
        // Render mini calendar first
        this.renderMiniCalendar();
        
        // Load tasks for selected date
        this.loadTasksForDate(this.currentHistoryDate);
        
        // Calculate statistics
        this.calculateHistoryStatistics();
        
        // Update current date display last
        const dateDisplay = document.getElementById('history-current-date');
        if (dateDisplay) {
            dateDisplay.textContent = this.currentHistoryDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    }

    renderMiniCalendar() {
        const calendarContainer = document.getElementById('mini-calendar');
        if (!calendarContainer) return;

        const year = this.currentHistoryDate.getFullYear();
        const month = this.currentHistoryDate.getMonth();
        const today = new Date();
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Get task data for this month
        const monthTasks = this.getTasksForMonth(year, month);
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        console.log('Month value:', month, 'Type:', typeof month);
        console.log('Month name:', monthNames[month]);
        
        let calendarHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <button class="calendar-nav-btn" data-direction="-1" style="background: none; border: none; cursor: pointer; padding: 8px; border-radius: 4px;">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h4 style="margin: 0; color: var(--text-primary);">${monthNames[month] || 'Invalid Month'} ${year}</h4>
                <button class="calendar-nav-btn" data-direction="1" style="background: none; border: none; cursor: pointer; padding: 8px; border-radius: 4px;">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; margin-bottom: 8px;">
                <div style="font-weight: 600; color: var(--text-secondary); font-size: 12px;">Sun</div>
                <div style="font-weight: 600; color: var(--text-secondary); font-size: 12px;">Mon</div>
                <div style="font-weight: 600; color: var(--text-secondary); font-size: 12px;">Tue</div>
                <div style="font-weight: 600; color: var(--text-secondary); font-size: 12px;">Wed</div>
                <div style="font-weight: 600; color: var(--text-secondary); font-size: 12px;">Thu</div>
                <div style="font-weight: 600; color: var(--text-secondary); font-size: 12px;">Fri</div>
                <div style="font-weight: 600; color: var(--text-secondary); font-size: 12px;">Sat</div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">
        `;
        
        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<div></div>';
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayTasks = monthTasks[dateStr] || [];
            const hasTasks = dayTasks.length > 0;
            const isToday = currentDate.toDateString() === today.toDateString();
            const isSelected = currentDate.toDateString() === this.currentHistoryDate.toDateString();
            
            let bgColor = 'var(--background)';
            if (isSelected) {
                bgColor = '#6366F1'; // Hardcoded primary color
            }
            else if (isToday) bgColor = '#FEF3C7';
            else if (hasTasks) bgColor = '#D1FAE5';
            
            let textColor = 'var(--text-primary)';
            if (isSelected) {
                textColor = 'white';
            }
            
            const selectedClass = isSelected ? ' selected' : '';
            
            calendarHTML += `
                <div class="calendar-date${selectedClass}" data-year="${year}" data-month="${month}" data-day="${day}" 
                     style="padding: 8px; border-radius: 6px; cursor: pointer; background: ${bgColor}; color: ${textColor}; 
                            font-weight: ${isToday || isSelected ? '600' : '400'}; font-size: 14px; position: relative;">
                    ${day}
                    ${hasTasks ? `<div class="task-indicator" style="position: absolute; bottom: 2px; right: 2px; width: 6px; height: 6px; background: ${isSelected ? 'white' : '#10B981'}; border-radius: 50%;"></div>` : ''}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        calendarContainer.innerHTML = calendarHTML;
    }

    selectHistoryDate(year, month, day) {
        this.currentHistoryDate = new Date(year, month, day);
        
        // Update only the date display first
        const dateDisplay = document.getElementById('history-current-date');
        if (dateDisplay) {
            dateDisplay.textContent = this.currentHistoryDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
        
        // Update tasks and stats
        this.loadTasksForDate(this.currentHistoryDate);
        this.calculateHistoryStatistics();
        
        // Re-render calendar to show the selected date's month
        this.renderMiniCalendar();
    }

    getTasksForMonth(year, month) {
        const monthTasks = {};
        
        // Get all task types
        const taskTypes = ['productivityTasks', 'daily-schedule', 'daily-highlights'];
        
        taskTypes.forEach(type => {
            const data = localStorage.getItem(type);
            if (data) {
                try {
                    if (type === 'productivityTasks') {
                        // Handle the tasks object structure (stored by day names)
                        const tasksByDay = JSON.parse(data);
                        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                        
                        // Get all days in the specified month
                        const firstDay = new Date(year, month, 1);
                        const lastDay = new Date(year, month + 1, 0);
                        
                        for (let day = 1; day <= lastDay.getDate(); day++) {
                            const currentDate = new Date(year, month, day);
                            const dayName = dayNames[currentDate.getDay()];
                            const dateStr = currentDate.toISOString().split('T')[0];
                            
                            // Check if there are tasks for this day name
                            if (tasksByDay[dayName] && tasksByDay[dayName].length > 0) {
                                if (!monthTasks[dateStr]) monthTasks[dateStr] = [];
                                
                                tasksByDay[dayName].forEach(task => {
                                    monthTasks[dateStr].push({ 
                                        ...task, 
                                        type: 'Tasks',
                                        date: dateStr // Add date property for consistency
                                    });
                                });
                            }
                        }
                    } else {
                        // Handle array-based data
                        const items = JSON.parse(data);
                        items.forEach(item => {
                            if (item.date) {
                                const itemDate = new Date(item.date);
                                if (itemDate.getFullYear() === year && itemDate.getMonth() === month) {
                                    const dateStr = itemDate.toISOString().split('T')[0];
                                    if (!monthTasks[dateStr]) monthTasks[dateStr] = [];
                                    monthTasks[dateStr].push({ ...item, type: type.replace('daily-', '').charAt(0).toUpperCase() + type.replace('daily-', '').slice(1) });
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.error('Error processing task data for', type, e);
                }
            }
        });
        
        return monthTasks;
    }

    loadTasksForDate(date) {
        const tasksContainer = document.getElementById('task-timeline');
        if (!tasksContainer) return;

        const dateStr = date.toISOString().split('T')[0];
        const allTasks = [];
        
        // Get all task types for this date
        const taskTypes = [
            { key: 'productivityTasks', name: 'Tasks', icon: '📋' },
            { key: 'daily-schedule', name: 'Schedule', icon: '📅' },
            { key: 'daily-highlights', name: 'Highlights', icon: '🌟' }
        ];

        taskTypes.forEach(type => {
            const data = localStorage.getItem(type.key);
            if (data) {
                try {
                    if (type.key === 'productivityTasks') {
                        // Handle the tasks object structure (stored by day names)
                        const tasksByDay = JSON.parse(data);
                        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                        const dayName = dayNames[date.getDay()];
                        
                        if (tasksByDay[dayName] && tasksByDay[dayName].length > 0) {
                            tasksByDay[dayName].forEach(task => {
                                allTasks.push({ 
                                    ...task, 
                                    category: type.name, 
                                    icon: type.icon,
                                    date: dateStr // Add date for consistency
                                });
                            });
                        }
                    } else {
                        // Handle array-based data
                        const items = JSON.parse(data);
                        const dateTasks = items.filter(item => {
                            if (item.date) {
                                const itemDate = new Date(item.date).toISOString().split('T')[0];
                                return itemDate === dateStr;
                            }
                            return false;
                        });
                        
                        dateTasks.forEach(task => {
                            allTasks.push({ ...task, category: type.name, icon: type.icon });
                        });
                    }
                } catch (e) {
                    console.error('Error parsing task data:', e);
                }
            }
        });

        if (allTasks.length === 0) {
            tasksContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No tasks found for this date.</p>';
            return;
        }

        // Sort tasks by time if available
        allTasks.sort((a, b) => {
            if (a.time && b.time) {
                return a.time.localeCompare(b.time);
            }
            return 0;
        });

        let tasksHTML = '';
        allTasks.forEach((task, index) => {
            const taskTime = task.time || '';
            const taskDescription = task.description || task.text || task.task || 'No description';
            
            const statusBadge = task.completed ? 
                '<span style="background: #10B981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Completed</span>' :
                '';

            tasksHTML += `
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 8px; background: var(--background);">
                    <div style="font-size: 1.2rem;">${task.icon}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: var(--text-primary);">${taskDescription}</div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                            ${task.category} ${taskTime ? '• ' + taskTime : ''}
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${statusBadge}
                        <button onclick="app.removeTaskFromHistory('${task.category}', ${index})" style="background: #EF4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        tasksContainer.innerHTML = tasksHTML;
    }

    removeTaskFromHistory(category, taskIndex) {
        if (!confirm('Are you sure you want to remove this task?')) {
            return;
        }

        let storageKey;
        if (category === 'Tasks') {
            storageKey = 'productivityTasks';
        } else if (category === 'Schedule') {
            storageKey = 'daily-schedule';
        } else if (category === 'Highlights') {
            storageKey = 'daily-highlights';
        }

        if (storageKey) {
            try {
                const data = localStorage.getItem(storageKey);
                if (data) {
                    if (storageKey === 'productivityTasks') {
                        // Handle day-based tasks
                        const tasksByDay = JSON.parse(data);
                        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                        const dayName = dayNames[this.currentHistoryDate.getDay()];
                        
                        if (tasksByDay[dayName] && tasksByDay[dayName].length > taskIndex) {
                            tasksByDay[dayName].splice(taskIndex, 1);
                            localStorage.setItem(storageKey, JSON.stringify(tasksByDay));
                        }
                    } else {
                        // Handle array-based data
                        const items = JSON.parse(data);
                        const dateStr = this.currentHistoryDate.toISOString().split('T')[0];
                        const dateItems = items.filter(item => {
                            if (item.date) {
                                const itemDate = new Date(item.date).toISOString().split('T')[0];
                                return itemDate === dateStr;
                            }
                            return false;
                        });
                        
                        if (dateItems.length > taskIndex) {
                            // Find the actual index in the full array
                            const itemToRemove = dateItems[taskIndex];
                            const fullIndex = items.findIndex(item => item === itemToRemove);
                            if (fullIndex !== -1) {
                                items.splice(fullIndex, 1);
                                localStorage.setItem(storageKey, JSON.stringify(items));
                            }
                        }
                    }
                    
                    // Refresh the display
                    this.loadTasksForDate(this.currentHistoryDate);
                    this.calculateHistoryStatistics();
                    this.renderMiniCalendar();
                }
            } catch (e) {
                console.error('Error removing task:', e);
                alert('Error removing task. Please try again.');
            }
        }
    }

    calculateHistoryStatistics() {
        const statsContainer = document.getElementById('history-stats');
        if (!statsContainer) return;

        // Get all tasks
        const allTasks = [];
        const taskTypes = ['productivityTasks', 'daily-schedule', 'daily-highlights'];
        
        taskTypes.forEach(type => {
            const data = localStorage.getItem(type);
            if (data) {
                try {
                    if (type === 'productivityTasks') {
                        // Handle the tasks object structure (stored by day names)
                        const tasksByDay = JSON.parse(data);
                        Object.keys(tasksByDay).forEach(dayName => {
                            const tasks = tasksByDay[dayName];
                            if (Array.isArray(tasks)) {
                                tasks.forEach(task => {
                                    allTasks.push({ ...task, type: 'Tasks' });
                                });
                            }
                        });
                    } else {
                        // Handle array-based data
                        const items = JSON.parse(data);
                        if (Array.isArray(items)) {
                            allTasks.push(...items);
                        }
                    }
                } catch (e) {
                    console.error('Error parsing task data:', e);
                }
            }
        });

        // Calculate statistics
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(task => task.completed).length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Get tasks for current week (using day-based tasks)
        const today = new Date();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDayIndex = today.getDay();
        
        let thisWeekTasks = [];
        for (let i = 0; i <= currentDayIndex; i++) {
            const dayName = dayNames[i];
            const productivityTasks = JSON.parse(localStorage.getItem('productivityTasks') || '{}');
            if (productivityTasks[dayName]) {
                thisWeekTasks.push(...productivityTasks[dayName]);
            }
        }

        // Get tasks for current month
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const thisMonthTasks = allTasks.filter(task => {
            if (task.date) {
                return new Date(task.date) >= monthStart;
            }
            // For day-based tasks without dates, count them all for current month
            return true;
        });

        const statsHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
                <div style="background: var(--background); padding: 16px; border-radius: var(--radius); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">${totalTasks}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">Total Tasks</div>
                </div>
                <div style="background: var(--background); padding: 16px; border-radius: var(--radius); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: #10B981;">${completedTasks}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">Completed</div>
                </div>
                <div style="background: var(--background); padding: 16px; border-radius: var(--radius); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: #8B5CF6;">${completionRate}%</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">Completion Rate</div>
                </div>
                <div style="background: var(--background); padding: 16px; border-radius: var(--radius); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: #3B82F6;">${thisWeekTasks.length}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">This Week</div>
                </div>
                <div style="background: var(--background); padding: 16px; border-radius: var(--radius); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: #EC4899;">${thisMonthTasks.length}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">This Month</div>
                </div>
            </div>
        `;

        statsContainer.innerHTML = statsHTML;
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
            // Add status indicator if not already present
            if (!item.querySelector('.task-status')) {
                const statusIndicator = document.createElement('div');
                statusIndicator.className = 'task-status';
                statusIndicator.style.cssText = `
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: ${item.classList.contains('completed') ? '#10B981' : '#F59E0B'};
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 600;
                    z-index: 10;
                `;
                statusIndicator.textContent = item.classList.contains('completed') ? 'Completed' : 'Pending';
                item.style.position = 'relative';
                item.appendChild(statusIndicator);
            }
            
            item.addEventListener('click', function() {
                this.classList.toggle('completed');
                const isCompleted = this.classList.contains('completed');
                
                // Update status indicator
                const statusIndicator = this.querySelector('.task-status');
                if (statusIndicator) {
                    statusIndicator.style.background = isCompleted ? '#10B981' : '#F59E0B';
                    statusIndicator.textContent = isCompleted ? 'Completed' : 'Pending';
                }
                
                this.showNotification(isCompleted ? 'Task completed!' : 'Task marked as incomplete');
            }.bind(this));
        });

        // Date navigation buttons
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const isNext = this.querySelector('.fa-chevron-right');
                if (isNext) {
                    this.navigateNextDay();
                } else {
                    this.navigatePreviousDay();
                }
            }.bind(this));
        });

        // Scheduled items (routine tasks)
        const scheduledItems = document.querySelectorAll('.scheduled-item');
        scheduledItems.forEach(item => {
            item.addEventListener('click', function() {
                this.toggleRoutineItem(this);
            }.bind(this));
        });
    }

    showNotification(message) {
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

    toggleRoutineItem(element) {
        const checkIcon = element.querySelector('.fa-check');
        if (checkIcon) {
            const isCompleted = checkIcon.style.opacity === '1';
            checkIcon.style.opacity = isCompleted ? '0' : '1';
            
            if (isCompleted) {
                element.style.background = 'linear-gradient(135deg, #FEF3C7, #FDE68A)';
                this.showNotification('Morning routine marked as incomplete');
            } else {
                element.style.background = 'linear-gradient(135deg, #D1FAE5, #A7F3D0)';
                this.showNotification('Morning routine completed! Great start to the day! 🌅');
            }
        }
    }

    // Date navigation functionality
    updateDateDisplay() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = this.currentDate.toLocaleDateString('en-US', options);
        
        // Update all date displays
        const dateElements = document.querySelectorAll('.current-date');
        dateElements.forEach(element => {
            element.textContent = dateString;
        });
    }

    navigatePreviousDay() {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.updateDateDisplay();
        this.showNotification('Navigated to previous day');
    }

    navigateNextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.updateDateDisplay();
        this.showNotification('Navigated to next day');
    }

    updateTime() {
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ProductivityApp();
    
    // Update time every minute
    setInterval(() => app.updateTime(), 60000);
    app.updateTime();
});

// Simple, working calendar fix
document.addEventListener('DOMContentLoaded', function() {
    // Calendar items click handler
    const scheduledItems = document.querySelectorAll('.scheduled-item');
    scheduledItems.forEach(item => {
        item.addEventListener('click', function() {
            const checkIcon = this.querySelector('.fa-check');
            if (checkIcon) {
                const isCompleted = checkIcon.style.opacity === '1';
                checkIcon.style.opacity = isCompleted ? '0' : '1';
                
                if (isCompleted) {
                    this.style.background = 'linear-gradient(135deg, #FEF3C7, #FDE68A)';
                    alert('Morning routine marked as incomplete');
                } else {
                    this.style.background = 'linear-gradient(135deg, #D1FAE5, #A7F3D0)';
                    alert('Morning routine completed! Great start to the day! 🌅');
                }
            }
        });
    });
});

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

// View Saved Data Function
function showSavedData() {
    const savedData = {
        'Daily Highlights': localStorage.getItem('daily-highlights'),
        'Weekly Plan': localStorage.getItem('weekly-plan'),
        'Weekly Review': localStorage.getItem('weekly-review'),
        'Daily Shutdown': localStorage.getItem('daily-shutdown')
    };
    
    let modalContent = '<div class="saved-data-modal"><h2>📊 Saved Data</h2>';
    
    for (const [section, data] of Object.entries(savedData)) {
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                modalContent += '<div class="data-section"><h3>' + section + '</h3><div class="data-content"><pre>' + JSON.stringify(parsedData, null, 2) + '</pre></div></div>';
            } catch (e) {
                modalContent += '<div class="data-section"><h3>' + section + '</h3><div class="data-content"><pre>' + data + '</pre></div></div>';
            }
        }
    }
    
    if (!Object.values(savedData).some(data => data)) {
        modalContent += '<p>No saved data found. Start adding data to see it here!</p>';
    }
    
    modalContent += '<div class="modal-actions"><button class="clear-data-btn" onclick="clearAllData()">Clear All Data</button><button class="close-modal-btn" onclick="this.closest(\'.modal-overlay\').remove()">Close</button></div></div>';
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    modal.innerHTML = '<div style="background: var(--surface); padding: 30px; border-radius: 12px; max-width: 600px; max-height: 80vh; overflow-y: auto; position: relative; color: var(--text-primary);">' + modalContent + '</div>';
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Clear all data function
window.clearAllData = function() {
    if (confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
        localStorage.removeItem('daily-highlights');
        localStorage.removeItem('weekly-plan');
        localStorage.removeItem('weekly-review');
        localStorage.removeItem('daily-shutdown');
        localStorage.removeItem('focus-time-data');
        alert('All saved data has been cleared!');
        document.querySelector('.modal-overlay').remove();
    }
};

// Add View Saved Data button event listener
document.addEventListener('click', function(e) {
    if (e.target.closest('#view-saved-data-nav')) {
        e.preventDefault();
        e.stopPropagation();
        showSavedData();
        return;
    }
});

// Make saveHighlight globally accessible for Daily Highlights buttons
window.saveHighlight = function(type) {
    let inputId, listId, icon;
    
    switch(type) {
        case 'win':
            inputId = 'win-input';
            listId = 'wins-list';
            icon = '🏆';
            break;
        case 'insight':
            inputId = 'insight-input';
            listId = 'insights-list';
            icon = '💡';
            break;
        case 'note':
            inputId = 'note-input';
            listId = 'notes-list';
            icon = '📝';
            break;
    }
    
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    
    if (!input || !list) {
        console.error('Missing elements for saveHighlight. Input:', !!input, 'List:', !!list);
        alert('Please make sure you are on the Daily Highlights page and the input fields are visible.');
        return;
    }
    
    const text = input.value.trim();
    
    if (text) {
        const highlights = JSON.parse(localStorage.getItem('daily-highlights') || '[]');
        highlights.push({
            type: type,
            text: text,
            date: new Date().toISOString(),
            completed: false
        });
        localStorage.setItem('daily-highlights', JSON.stringify(highlights));
        
        const highlightElement = document.createElement('div');
        highlightElement.className = 'highlight-item';
        highlightElement.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
            margin-bottom: 12px;
            background: var(--background);
        `;
        highlightElement.innerHTML = `
            <span style="font-size: 1.5rem;">${icon}</span>
            <span style="flex: 1; color: var(--text-primary);">${text}</span>
            <button onclick="this.parentElement.remove()" style="background: var(--accent-color); color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">×</button>
        `;
        
        list.appendChild(highlightElement);
        
        input.value = '';
        input.style.borderColor = '#10B981';
        setTimeout(() => {
            input.style.borderColor = 'var(--border-color)';
        }, 1000);
        
        console.log('Highlight saved successfully');
    } else {
        console.log('No text to save');
        alert('Please enter some text before adding a highlight.');
    }
};

// Make app globally accessible for onclick handlers
window.app = new ProductivityApp();
