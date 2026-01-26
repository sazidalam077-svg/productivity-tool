// Simple Productivity Tools JavaScript
console.log('Script loaded');

// Simple event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    console.log('Found nav items:', navItems.length);
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigation clicked:', this.dataset.page);
            
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');
            
            // Show simple feedback
            const pageName = this.textContent.trim();
            showNotification('Navigated to: ' + pageName);
        });
    });

    // Task items
    const taskItems = document.querySelectorAll('.task-item');
    console.log('Found task items:', taskItems.length);
    
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
            showNotification(isNext ? 'Next day' : 'Previous day');
        });
    });

    // Mobile navigation
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            mobileNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    console.log('All event listeners attached');
});

// Simple notification function
function showNotification(message) {
    console.log('Notification:', message);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4F46E5;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-family: Inter, sans-serif;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Update current time
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

// Update time every minute
setInterval(updateTime, 60000);
updateTime();

console.log('Simple script setup complete');
