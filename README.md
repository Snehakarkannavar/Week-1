# IoT Building Maintenance Dashboard

A comprehensive 3D IoT dashboard for monitoring and managing a Japanese-style apartment building with real-time sensor data visualization and maintenance tracking.

## Features

### 🏢 Realistic 3D Building Model
- **Multi-story Structure**: Ground floor commercial space + 3 residential floors + penthouse
- **Detailed Architecture**: Realistic windows with frames, balconies with railings, entrance with overhang
- **Building Equipment**: HVAC units, solar panels, satellite dish, security cameras
- **External Details**: Air conditioning units, utility meters, pipes, and realistic textures

### 📊 Comprehensive IoT Sensors
- **Temperature Sensors**: Multi-zone monitoring with HVAC integration
- **Humidity Control**: Real-time moisture level tracking
- **Air Quality**: Indoor environmental monitoring
- **Occupancy Detection**: Room-by-room presence tracking
- **Energy Management**: Power consumption and solar generation
- **Security Systems**: Motion detection and access control
- **Weather Station**: Rooftop environmental monitoring
- **HVAC Monitoring**: Temperature and status for each unit
- **Power Meters**: Individual circuit monitoring
- **Window Sensors**: Open/close status tracking

### 🎮 Interactive Controls
- **Camera Views**: Overview, floor-specific, and rooftop perspectives
- **Lighting Modes**: Day, night, and maintenance lighting
- **Sensor Visualization**: Toggle hotspots on/off
- **Real-time Data**: Live updating sensor readings
- **Emergency Mode**: Quick access to emergency protocols

### 📈 Data Visualization
- **Animated Sensors**: Different animation patterns for each sensor type
  - Temperature: Heat simulation with pulsing
  - Energy: Rapid pulse indicating power flow
  - Security: Sweeping motion for monitoring
  - Occupancy: Vertical movement showing activity
- **Interactive Tooltips**: Detailed sensor information on click
- **Status Indicators**: Color-coded system status
- **Real-time Updates**: Data refreshes every 2 seconds

### 🚨 Maintenance & Alerts
- **Active Alerts**: Real-time system notifications
- **Maintenance Scheduling**: Automated maintenance reminders
- **Emergency Protocols**: Quick emergency response activation
- **System Status**: Overall building health monitoring

## Technical Implementation

### Technologies Used
- **Three.js**: 3D rendering and visualization
- **WebGL**: Hardware-accelerated graphics
- **HTML5/CSS3**: Modern web interface
- **JavaScript ES6**: Interactive functionality

### Building Structure
```
Penthouse Floor (17.5m)    - Premium units with enhanced sensors
├── Floor 3 (12m)          - Residential units C1, C2
├── Floor 2 (9m)           - Residential units B1, B2  
├── Floor 1 (6m)           - Residential units A1, A2
└── Ground Floor (2m)      - Commercial space + utilities
```

### Sensor Network
- **13 Active Sensors** strategically placed throughout the building
- **Real-time Monitoring** with battery level tracking
- **Unit-specific Identification** for precise maintenance
- **Multi-protocol Support** for various IoT devices

## Usage Instructions

1. **Navigation**: Use mouse to orbit around the building (left-click + drag)
2. **Zoom**: Mouse wheel to zoom in/out
3. **Camera Presets**: Use dropdown menu for quick view changes
4. **Sensor Interaction**: Click on glowing sensor hotspots for details
5. **Lighting Control**: Switch between day/night/maintenance modes
6. **Emergency Mode**: Quick access for emergency situations

## Sensor Data Types

| Sensor Type | Units | Range | Update Frequency |
|------------|-------|--------|------------------|
| Temperature | °C | 20-28°C | 2 seconds |
| Humidity | % | 40-60% | 2 seconds |
| Air Quality | Index | Good/Fair/Poor | 5 seconds |
| Occupancy | Count | 0-4 per unit | 1 second |
| Energy | kW | 2-5 kW | 1 second |
| HVAC | Status | Running/Idle/Maintenance | 10 seconds |
| Security | Status | Secure/Motion Detected | Real-time |

## Building Specifications

- **Total Floors**: 4 + Penthouse
- **Residential Units**: 8 apartments
- **Commercial Space**: Ground floor
- **Roof Equipment**: 2x HVAC units, Solar panels, Weather station
- **Security**: 2x Front cameras, Multiple sensors
- **Utilities**: Electrical meters, Gas connections, Water monitoring

## Future Enhancements

- [ ] Real IoT device integration via MQTT/WebSocket
- [ ] Historical data charts and analytics
- [ ] Mobile responsive design
- [ ] Voice control integration
- [ ] AR/VR compatibility
- [ ] Machine learning predictions
- [ ] Energy optimization algorithms
- [ ] Tenant portal integration

## Installation

1. Download the `iot-dashboard.html` file
2. Open in a modern web browser (Chrome, Firefox, Safari, Edge)
3. No additional installation required - runs entirely in browser
4. For local server: Use any HTTP server (e.g., Python's `python -m http.server`)

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ⚠️ Mobile browsers (limited performance)

## Performance Notes

- **Recommended**: Dedicated GPU for smooth 3D rendering
- **RAM**: Minimum 4GB for optimal performance
- **Network**: Lightweight - all assets load from CDN
- **Responsive**: Adapts to different screen sizes

## License

This project is open source and available under the MIT License.

---

*Built with modern web technologies for the future of smart building management.*