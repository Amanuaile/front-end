// DOM Element Selectors
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initial setup
document.addEventListener('DOMContentLoaded', updateEmptyState);

// --- 1. Add Task Logic ---
taskForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload
    
    const taskText = taskInput.value.trim();

    // Validation: Check if empty or less than 3 characters
    if (taskText.length < 3) {
        alert('Please enter a task that is at least 3 characters long.');
        return;
    }

    createTaskElement(taskText);
    
    // Clear input after successful addition
    taskInput.value = '';
    
    // Ensure "All" filter is active when adding a new task to see it immediately
    document.querySelector('[data-filter="all"]').click();
    updateEmptyState();
});

// Function to generate the DOM element
function createTaskElement(text) {
    const li = document.createElement('li');
    li.classList.add('task-item');

    // Generate Timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();
    
    // Inject inner HTML (DOM Manipulation)
    li.innerHTML = `
        <div class="task-info">
            <span class="task-title">${text}</span>
            <span class="task-time">${dateString} at ${timeString}</span>
        </div>
        <div class="task-actions">
            <button class="btn-icon complete-btn" title="Complete Task">✔</button>
            <button class="btn-icon delete-btn" title="Delete Task">✖</button>
        </div>
    `;

    taskList.appendChild(li);
}

// --- 2. Event Delegation for Complete & Delete ---
// Instead of adding an event listener to every button, we add one to the parent (UL)
taskList.addEventListener('click', function(e) {
    const target = e.target;
    
    // Find the closest task item container
    const taskItem = target.closest('.task-item');
    if (!taskItem) return;

    // Handle Complete Toggle
    if (target.classList.contains('complete-btn')) {
        taskItem.classList.toggle('completed');
        applyCurrentFilter(); // Re-evaluate if it should be hidden based on current filter
    }

    // Handle Delete Action
    if (target.classList.contains('delete-btn')) {
        // Add fade-out class to trigger CSS transition
        taskItem.classList.add('fade-out');
        
        // Wait for CSS transition to finish before removing from DOM
        taskItem.addEventListener('transitionend', function() {
            taskItem.remove();
            updateEmptyState();
        });
    }
});

// --- 3. Filter Logic ---
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Update active class on buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        applyCurrentFilter();
    });
});

function applyCurrentFilter() {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const tasks = document.querySelectorAll('.task-item');

    tasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');
        
        switch (activeFilter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'active':
                task.style.display = isCompleted ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = isCompleted ? 'flex' : 'none';
                break;
        }
    });
}

// --- 4. State Management (Empty State UI) ---
function updateEmptyState() {
    // Check how many task items currently exist in the DOM
    const taskCount = document.querySelectorAll('.task-item').length;
    
    if (taskCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}