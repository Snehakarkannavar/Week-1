# Enhanced IoT Building Maintenance Dashboard

## 🎯 Quick Start

### Option 1: Open Directly
Simply open `enhanced_building_dashboard.html` in any modern web browser.

### Option 2: Local Server (Recommended)
```bash
# Navigate to the project directory
cd /workspace

# Start a local server
python3 -m http.server 8000

# Open in browser
# http://localhost:8000/enhanced_building_dashboard.html
```

## ✨ Features Overview

### 🏢 Realistic 3D Building
- **Japanese apartment complex** with authentic architectural details
- **4 floors + rooftop** with 12 residential units
- **Detailed textures** including brick walls and reflective windows
- **Complete infrastructure** with balconies, utilities, and solar panels

### 🌐 Smart Sensor Network
- **21 IoT sensors** strategically placed throughout the building
- **Real-time monitoring** of temperature, humidity, air quality, security
- **Color-coded visualization** for easy identification
- **Interactive sensor details** with click-to-view information

### 🎮 Interactive Controls

#### Camera Views
- **Overview**: Complete building perspective
- **Ground Floor**: Lobby and entrance monitoring
- **Residential Floors**: Individual floor inspection
- **Rooftop**: Solar panels and weather station

#### Visualization Modes
- **Normal**: Standard sensor display
- **Thermal Mapping**: Temperature sensor focus
- **Occupancy**: Motion and presence detection
- **Energy Flow**: Power consumption visualization
- **Maintenance**: Critical system highlighting

### 📊 Live Dashboard Panels

#### Building Overview (Top Left)
- Building name and status
- Total floors and units
- Active sensor count
- Last inspection time

#### Smart Controls (Top Right)
- Camera position controls
- Visualization mode selection
- Day/night time settings
- Data flow toggles

#### Sensor Network (Bottom Left)
- Real-time sensor readings
- Network connectivity status
- Security system monitoring
- Environmental data

#### Maintenance System (Bottom Right)
- Active alerts counter
- Predictive maintenance issues
- AI-optimized scheduling
- Emergency protocol access

## 🎯 How to Use

### Navigation
1. **Rotate**: Click and drag to rotate around the building
2. **Zoom**: Scroll wheel to zoom in/out
3. **Pan**: Right-click and drag to pan view
4. **Reset**: Click "Reset View" button to return to default

### Sensor Interaction
1. **Click any sensor** (colored spheres) to view detailed information
2. **Sensor tooltip** shows:
   - Sensor type and ID
   - Current readings
   - Location details
   - Online status
   - Critical alerts (if any)

### View Modes
1. **Camera Views**: Select different floors from dropdown
2. **Visualization**: Switch between data analysis modes
3. **Time Controls**: Toggle day/night or use auto mode

### Monitoring
1. **Real-time data** updates every 2 seconds
2. **Alert notifications** appear for critical issues
3. **Status indicators** show system health
4. **Emergency button** for crisis situations

## 🚨 Alert System

### Alert Types
- 🔥 **Critical**: Smoke, fire, water leaks
- ⚠️ **Warning**: Temperature, humidity anomalies
- ℹ️ **Info**: Routine maintenance notifications
- 🤖 **Predictive**: AI-detected potential issues

### Emergency Features
- **One-click emergency activation**
- **Visual alarm system**
- **Automatic emergency services contact**
- **Building lockdown procedures**

## 🔧 Technical Details

### Sensor Types
- **Temperature**: 6 sensors (18-26°C range)
- **Humidity**: 4 sensors (35-65% range)
- **Smoke Detection**: 4 critical sensors
- **Motion/Occupancy**: 3 sensors
- **Air Quality**: 3 sensors (Excellent/Good/Fair/Poor)
- **Security**: 2 access control points
- **Utilities**: Power, water, solar monitoring

### Building Specifications
- **Floors**: Ground + 3 residential + rooftop
- **Units**: 12 apartments (3 per floor)
- **Height**: Approximately 20 meters
- **Features**: Balconies, solar panels, weather station
- **Safety**: Full fire detection and security systems

### Performance
- **3D Rendering**: Hardware-accelerated WebGL
- **Frame Rate**: Smooth 60fps animation
- **Memory Usage**: Optimized for web browsers
- **Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 🎨 Visual Features

### Realistic Elements
- **Brick textures** with authentic patterns
- **Reflective windows** with proper lighting
- **Architectural details** including balcony railings
- **Environmental context** with trees and parking
- **Weather effects** and atmospheric lighting

### UI Design
- **Glassmorphism interface** with backdrop blur
- **Smooth animations** and hover effects
- **Color-coded status indicators**
- **Responsive design** for different screen sizes

## 📱 Browser Compatibility

### Recommended Browsers
- **Chrome**: 90+ (Best performance)
- **Firefox**: 88+ (Full compatibility)
- **Safari**: 14+ (Good performance)
- **Edge**: 90+ (Full compatibility)

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Graphics**: Hardware-accelerated WebGL support
- **Internet**: Not required (runs locally)

## 🔍 Troubleshooting

### Common Issues
1. **Slow performance**: Try reducing browser zoom or closing other tabs
2. **Missing 3D model**: Ensure WebGL is enabled in browser
3. **Sensor not clickable**: Make sure you're clicking directly on the colored spheres
4. **Loading stuck**: Refresh the page and wait for all assets to load

### Debug Information
- Open browser developer tools (F12) to see console messages
- Check for any JavaScript errors in the console
- Ensure all Three.js libraries are loading properly

## 🚀 Advanced Features

### Data Analysis
- **Real-time correlation** between sensor readings
- **Historical trends** and pattern recognition
- **Predictive analytics** for maintenance scheduling
- **Energy optimization** recommendations

### Customization
- **Sensor threshold** adjustment
- **Alert notification** preferences
- **Visualization color** schemes
- **Dashboard layout** options

## 📈 Future Enhancements

### Planned Features
- **Historical data graphs**
- **Mobile app integration**
- **Voice control interface**
- **AR/VR compatibility**
- **Machine learning insights**

### Integration Options
- **MQTT broker** connectivity
- **REST API** endpoints
- **Database integration** (MySQL, PostgreSQL)
- **Cloud platform** support (AWS, Azure, GCP)

---

## 🆘 Support

If you encounter any issues or have questions about the Enhanced IoT Building Maintenance Dashboard, please refer to the `Enhanced_Dashboard_Features.md` file for detailed feature descriptions.

**Enjoy exploring your smart building! 🏢✨**