# Waste Detection System - Frontend Dashboard

A clean, responsive frontend dashboard for monitoring waste detection in real-time.

## 📁 Project Structure

```
/frontend
├── index.html          # Main dashboard with SPA navigation
├── /pages
│   ├── live.html       # Standalone live detection page
│   ├── logs.html       # Standalone detection history page
│   └── billing.html    # Standalone billing summary page
├── /css
│   └── style.css       # Complete responsive stylesheet
└── /js
    ├── live.js         # Live detection functionality
    ├── logs.js         # Logs page functionality
    └── billing.js      # Billing page functionality
```

## 🎯 Features

### 📹 Live View Page
- **Real-time detection display** with auto-refresh every 1 second
- **Live image feed** from backend (snapshot_path)
- **Detection details panel** showing:
  - Waste class (plastic, organic, metal, glass, paper)
  - Wet/Dry category
  - Confidence percentage
  - Mixed waste indicator
  - Violation status
  - Timestamp
- **Visual status indicators** with color coding

### 📋 Logs Page
- **Detection history table** with sortable data
- **Thumbnail images** for each detection
- **Filtering and search** capabilities
- **Auto-refresh** every 30 seconds
- **Responsive table** that adapts to mobile screens

### 💰 Billing Page
- **Summary cards** displaying:
  - Total items processed
  - Correct detections
  - Incorrect detections
  - Penalty amount
  - Final bill amount
- **Visual indicators** with color-coded performance
- **Auto-refresh** every 60 seconds

## 🎨 UI Design

### Dashboard Layout
- **Left sidebar navigation** with active page highlighting
- **Responsive design** for laptop and mobile
- **Clean, modern UI** with light colors
- **Smooth animations** and transitions

### Color Scheme
- **Primary**: #3498db (Blue)
- **Success**: #28a745 (Green)
- **Warning**: #ffc107 (Yellow)
- **Error**: #dc3545 (Red)
- **Background**: #f8f9fa (Light gray)
- **Text**: #2c3e50 (Dark blue)

## 🔗 API Integration

### Backend Endpoints
The frontend is configured to connect to these backend APIs:

1. **GET /live** - Live detection data
   ```json
   {
     "class": "plastic",
     "wet_dry": "dry",
     "confidence": 0.92,
     "is_mixed": false,
     "is_violation": false,
     "snapshot_path": "snapshots/live.jpg",
     "timestamp": "2025-12-06T18:32:10"
   }
   ```

2. **GET /logs** - Detection history array
   ```json
   [
     {
       "class": "organic",
       "wet_dry": "wet",
       "confidence": 0.88,
       "is_mixed": false,
       "is_violation": false,
       "snapshot_path": "snapshots/org_1.jpg",
       "timestamp": "2025-12-06T14:22:10"
     }
   ]
   ```

3. **GET /billing** - Billing summary
   ```json
   {
     "total_items": 120,
     "correct": 100,
     "incorrect": 20,
     "penalty": 200,
     "final_bill": 400
   }
   ```

### Configuration
Update the `API_BASE_URL` in each JavaScript file to match your backend:
```javascript
const API_BASE_URL = 'http://localhost:8000'; // Change this to your backend URL
```

## 🚀 Getting Started

### 1. Serve the files
You can serve the frontend using any web server:

```bash
# Using Python 3
python -m http.server 8080

# Using Node.js (http-server)
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

### 2. Access the dashboard
- **Main Dashboard**: `http://localhost:8080/index.html`
- **Live Page**: `http://localhost:8080/pages/live.html`
- **Logs Page**: `http://localhost:8080/pages/logs.html`
- **Billing Page**: `http://localhost:8080/pages/billing.html`

### 3. Connect to backend
Make sure your backend is running and update the API URLs in the JavaScript files.

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px (Full layout)
- **Tablet**: 768px - 1024px (Adjusted grid)
- **Mobile**: < 768px (Collapsed sidebar, stacked layout)
- **Small Mobile**: < 600px (Icon-only sidebar)

## 🔄 Auto-Refresh Intervals

- **Live Detection**: 1 second
- **Logs**: 30 seconds
- **Billing**: 60 seconds

All auto-refresh functions pause when the page is not active or browser tab is hidden.

## 🛠️ Dummy Data

When the backend is not available, the frontend automatically falls back to dummy data for testing:
- **Live detection**: Randomly generated detection data
- **Logs**: 15 sample log entries
- **Billing**: Calculated billing summary

## 🎯 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📝 Notes

- All images are handled with fallback placeholders
- Error states are gracefully handled with user-friendly messages
- The dashboard works offline with dummy data for development
- Clean, semantic HTML structure for accessibility
- Modern CSS Grid and Flexbox layouts
- ES6+ JavaScript with async/await for API calls

## 🔧 Customization

### Styling
Modify `/css/style.css` to change colors, fonts, or layout.

### API Endpoints
Update the `API_BASE_URL` constant in each JavaScript file.

### Refresh Intervals
Modify the interval values in the respective JavaScript files.

### Data Format
The frontend expects the exact JSON structure as specified in the API documentation.