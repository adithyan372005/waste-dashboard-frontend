// Logs JavaScript
const API_BASE_URL = 'http://localhost:8000'; // Adjust this to your backend URL

// Initialize logs page functionality
function initializeLogs() {
    console.log('Initializing logs page...');
    
    // Set up refresh button event listener
    const refreshButton = document.getElementById('refresh-logs');
    if (refreshButton) {
        refreshButton.addEventListener('click', fetchLogsData);
    }
    
    // Initial load of logs data
    fetchLogsData();
}

// Fetch logs data from backend
async function fetchLogsData() {
    const refreshButton = document.getElementById('refresh-logs');
    const logsList = document.getElementById('logs-list');
    
    try {
        // Show loading state
        if (refreshButton) {
            refreshButton.innerHTML = '<div class="loading"></div> Loading...';
            refreshButton.disabled = true;
        }
        
        const response = await fetch(`${API_BASE_URL}/logs`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayLogs(data);
        
    } catch (error) {
        console.error('Error fetching logs data:', error);
        displayLogsError(error.message);
    } finally {
        // Reset refresh button
        if (refreshButton) {
            refreshButton.innerHTML = '🔄 Refresh';
            refreshButton.disabled = false;
        }
    }
}

// Display logs data in the UI
function displayLogs(logs) {
    const logsList = document.getElementById('logs-list');
    
    if (!logs || logs.length === 0) {
        logsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>No Detection History</h3>
                <p>No waste detection logs available yet.</p>
            </div>
        `;
        return;
    }
    
    // Create logs header
    const headerHTML = `
        <div class="log-item" style="background-color: #f8f9fa; font-weight: 600; border-bottom: 2px solid #dee2e6;">
            <div>Image</div>
            <div>Waste Class</div>
            <div>Category</div>
            <div>Confidence</div>
            <div>Mixed</div>
            <div>Violation</div>
            <div>Timestamp</div>
        </div>
    `;
    
    // Sort logs by timestamp (newest first)
    const sortedLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Create log items HTML
    const logsHTML = sortedLogs.map(log => createLogItemHTML(log)).join('');
    
    logsList.innerHTML = headerHTML + logsHTML;
}

// Create HTML for a single log item
function createLogItemHTML(log) {
    const imageHTML = log.snapshot_path ? 
        `<img src="${API_BASE_URL}/${log.snapshot_path}" alt="${log.class}" class="log-thumbnail" 
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
         <div class="log-placeholder" style="display: none;">📷</div>` :
        `<div class="log-placeholder">📷</div>`;
    
    return `
        <div class="log-item">
            <div>${imageHTML}</div>
            <div class="log-class">${capitalizeFirst(log.class || 'Unknown')}</div>
            <div class="log-category">${capitalizeFirst(log.wet_dry || 'Unknown')}</div>
            <div class="log-confidence">${log.confidence ? Math.round(log.confidence * 100) + '%' : 'N/A'}</div>
            <div><span class="badge ${log.is_mixed ? 'yes' : 'no'}">${formatBoolean(log.is_mixed)}</span></div>
            <div><span class="badge ${log.is_violation ? 'yes' : 'no'}">${formatBoolean(log.is_violation)}</span></div>
            <div class="log-timestamp">${formatTimestamp(log.timestamp)}</div>
        </div>
    `;
}

// Display error message for logs
function displayLogsError(message) {
    const logsList = document.getElementById('logs-list');
    
    logsList.innerHTML = `
        <div class="error-message">
            <strong>⚠️ Error Loading Logs</strong><br>
            ${message}
        </div>
    `;
    
    // Use dummy data when backend is not available
    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
        console.log('Backend not available, using dummy logs data...');
        const dummyLogs = generateDummyLogsData();
        displayLogs(dummyLogs);
    }
}

// Generate dummy logs data for testing when backend is not available
function generateDummyLogsData() {
    const classes = ['plastic', 'organic', 'metal', 'glass', 'paper'];
    const wetDry = ['wet', 'dry'];
    const dummyLogs = [];
    
    // Generate 15 dummy log entries
    for (let i = 0; i < 15; i++) {
        const timestamp = new Date();
        timestamp.setHours(timestamp.getHours() - i);
        timestamp.setMinutes(timestamp.getMinutes() - Math.floor(Math.random() * 60));
        
        dummyLogs.push({
            class: classes[Math.floor(Math.random() * classes.length)],
            wet_dry: wetDry[Math.floor(Math.random() * wetDry.length)],
            confidence: 0.60 + Math.random() * 0.40, // 60-100% confidence
            is_mixed: Math.random() < 0.3, // 30% chance of mixed
            is_violation: Math.random() < 0.15, // 15% chance of violation
            snapshot_path: null, // No actual images in dummy data
            timestamp: timestamp.toISOString()
        });
    }
    
    return dummyLogs;
}

// Utility Functions
function capitalizeFirst(str) {
    if (!str) return 'Unknown';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatBoolean(value) {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return 'N/A';
}

function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';
    
    try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        // Show relative time for recent entries
        if (diffInMinutes < 1) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInMinutes < 1440) { // Less than 24 hours
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours}h ago`;
        } else {
            // Show full date for older entries
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return 'Invalid date';
    }
}

// Auto-refresh logs every 30 seconds when page is active
let logsRefreshInterval = null;

function startLogsAutoRefresh() {
    // Clear existing interval
    if (logsRefreshInterval) {
        clearInterval(logsRefreshInterval);
    }
    
    // Set up new interval
    logsRefreshInterval = setInterval(() => {
        const logsPage = document.getElementById('logs-page');
        if (logsPage && logsPage.classList.contains('active')) {
            fetchLogsData();
        }
    }, 30000); // 30 seconds
}

function stopLogsAutoRefresh() {
    if (logsRefreshInterval) {
        clearInterval(logsRefreshInterval);
        logsRefreshInterval = null;
    }
}

// Start auto-refresh when logs are initialized
document.addEventListener('DOMContentLoaded', function() {
    startLogsAutoRefresh();
});

// Export functions for use in other scripts
window.logsPage = {
    initialize: initializeLogs,
    refresh: fetchLogsData,
    startAutoRefresh: startLogsAutoRefresh,
    stopAutoRefresh: stopLogsAutoRefresh
};