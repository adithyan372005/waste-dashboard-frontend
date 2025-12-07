// Billing JavaScript
const API_BASE_URL = 'http://localhost:8000'; // Adjust this to your backend URL

// Initialize billing page functionality
function initializeBilling() {
    console.log('Initializing billing page...');
    
    // Set up refresh button event listener
    const refreshButton = document.getElementById('refresh-billing');
    if (refreshButton) {
        refreshButton.addEventListener('click', fetchBillingData);
    }
    
    // Initial load of billing data
    fetchBillingData();
}

// Fetch billing data from backend
async function fetchBillingData() {
    const refreshButton = document.getElementById('refresh-billing');
    
    try {
        // Show loading state
        if (refreshButton) {
            refreshButton.innerHTML = '<div class="loading"></div> Loading...';
            refreshButton.disabled = true;
        }
        
        // Show loading in cards
        showLoadingState();
        
        const response = await fetch(`${API_BASE_URL}/billing`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayBillingData(data);
        
    } catch (error) {
        console.error('Error fetching billing data:', error);
        displayBillingError(error.message);
    } finally {
        // Reset refresh button
        if (refreshButton) {
            refreshButton.innerHTML = '🔄 Refresh';
            refreshButton.disabled = false;
        }
    }
}

// Show loading state in billing cards
function showLoadingState() {
    const cardValues = [
        'total-items',
        'correct-items', 
        'incorrect-items',
        'penalty-amount',
        'final-bill'
    ];
    
    cardValues.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '<div class="loading"></div>';
        }
    });
}

// Display billing data in the UI
function displayBillingData(billing) {
    try {
        // Update total items
        document.getElementById('total-items').textContent = 
            formatNumber(billing.total_items || 0);
        
        // Update correct items
        document.getElementById('correct-items').textContent = 
            formatNumber(billing.correct || 0);
        
        // Update incorrect items
        document.getElementById('incorrect-items').textContent = 
            formatNumber(billing.incorrect || 0);
        
        // Update penalty amount
        document.getElementById('penalty-amount').textContent = 
            formatCurrency(billing.penalty || 0);
        
        // Update final bill
        document.getElementById('final-bill').textContent = 
            formatCurrency(billing.final_bill || 0);
        
        // Calculate and show accuracy percentage
        updateAccuracyIndicators(billing);
        
        console.log('Billing data updated successfully');
        
    } catch (error) {
        console.error('Error displaying billing data:', error);
        displayBillingError('Error displaying billing information');
    }
}

// Update accuracy indicators and styling
function updateAccuracyIndicators(billing) {
    const totalItems = billing.total_items || 0;
    const correctItems = billing.correct || 0;
    const incorrectItems = billing.incorrect || 0;
    
    // Calculate accuracy percentage
    const accuracy = totalItems > 0 ? (correctItems / totalItems) * 100 : 0;
    
    // Update card styling based on performance
    updateCardStyling('correct-items', correctItems, 'success');
    updateCardStyling('incorrect-items', incorrectItems, 'error');
    
    // Update penalty styling based on amount
    const penaltyCard = document.querySelector('#penalty-amount').closest('.billing-card');
    if (billing.penalty > 0) {
        penaltyCard.style.borderLeftColor = '#dc3545';
    } else {
        penaltyCard.style.borderLeftColor = '#28a745';
    }
    
    // Update final bill styling based on amount
    const finalBillCard = document.querySelector('#final-bill').closest('.billing-card');
    if (billing.final_bill > 1000) {
        finalBillCard.style.borderLeftColor = '#dc3545';
    } else if (billing.final_bill > 500) {
        finalBillCard.style.borderLeftColor = '#ffc107';
    } else {
        finalBillCard.style.borderLeftColor = '#28a745';
    }
    
    console.log(`Accuracy: ${accuracy.toFixed(1)}%`);
}

// Update individual card styling
function updateCardStyling(elementId, value, type) {
    const element = document.getElementById(elementId);
    const card = element.closest('.billing-card');
    
    if (type === 'success' && value > 0) {
        card.style.borderLeftColor = '#28a745';
    } else if (type === 'error' && value > 0) {
        card.style.borderLeftColor = '#dc3545';
    }
}

// Display error message for billing
function displayBillingError(message) {
    // Reset all values to show error state
    const cardValues = [
        'total-items',
        'correct-items',
        'incorrect-items',
        'penalty-amount',
        'final-bill'
    ];
    
    cardValues.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = 'Error';
            element.style.color = '#dc3545';
        }
    });
    
    // Use dummy data when backend is not available
    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
        console.log('Backend not available, using dummy billing data...');
        const dummyBilling = generateDummyBillingData();
        displayBillingData(dummyBilling);
    }
}

// Generate dummy billing data for testing when backend is not available
function generateDummyBillingData() {
    const totalItems = 120 + Math.floor(Math.random() * 50); // 120-170 items
    const correctPercentage = 0.75 + Math.random() * 0.20; // 75-95% accuracy
    const correctItems = Math.floor(totalItems * correctPercentage);
    const incorrectItems = totalItems - correctItems;
    const penalty = incorrectItems * 10; // $10 per incorrect item
    const baseRate = 2; // $2 per item
    const finalBill = (totalItems * baseRate) + penalty;
    
    return {
        total_items: totalItems,
        correct: correctItems,
        incorrect: incorrectItems,
        penalty: penalty,
        final_bill: finalBill
    };
}

// Utility Functions
function formatNumber(num) {
    if (typeof num !== 'number') return '0';
    return num.toLocaleString('en-US');
}

function formatCurrency(amount) {
    if (typeof amount !== 'number') return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatPercentage(value) {
    if (typeof value !== 'number') return '0%';
    return `${Math.round(value)}%`;
}

// Auto-refresh billing every 60 seconds when page is active
let billingRefreshInterval = null;

function startBillingAutoRefresh() {
    // Clear existing interval
    if (billingRefreshInterval) {
        clearInterval(billingRefreshInterval);
    }
    
    // Set up new interval
    billingRefreshInterval = setInterval(() => {
        const billingPage = document.getElementById('billing-page');
        if (billingPage && billingPage.classList.contains('active')) {
            fetchBillingData();
        }
    }, 60000); // 60 seconds
}

function stopBillingAutoRefresh() {
    if (billingRefreshInterval) {
        clearInterval(billingRefreshInterval);
        billingRefreshInterval = null;
    }
}

// Add billing summary calculations
function calculateBillingSummary(billing) {
    const summary = {
        accuracy: 0,
        penaltyRate: 0,
        avgCostPerItem: 0
    };
    
    if (billing.total_items > 0) {
        summary.accuracy = (billing.correct / billing.total_items) * 100;
        summary.penaltyRate = (billing.penalty / billing.final_bill) * 100;
        summary.avgCostPerItem = billing.final_bill / billing.total_items;
    }
    
    return summary;
}

// Start auto-refresh when billing is initialized
document.addEventListener('DOMContentLoaded', function() {
    startBillingAutoRefresh();
});

// Handle page visibility for auto-refresh
document.addEventListener('visibilitychange', function() {
    const billingPage = document.getElementById('billing-page');
    if (document.hidden || !billingPage.classList.contains('active')) {
        stopBillingAutoRefresh();
    } else if (billingPage.classList.contains('active')) {
        startBillingAutoRefresh();
    }
});

// Export functions for use in other scripts
window.billingPage = {
    initialize: initializeBilling,
    refresh: fetchBillingData,
    startAutoRefresh: startBillingAutoRefresh,
    stopAutoRefresh: stopBillingAutoRefresh,
    calculateSummary: calculateBillingSummary
};