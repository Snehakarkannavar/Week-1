# IoT Building Maintenance Dashboard

A modern, interactive 3D building maintenance dashboard for monitoring Japanese apartment buildings with real-time IoT sensor data.

## Features

- **3D Building Visualization**: Interactive 3D model with camera controls
- **IoT Sensor Monitoring**: Real-time data from multiple sensor types
- **Interactive Hotspots**: Click on sensor locations for detailed information
- **Multiple Camera Views**: Overview, floor-specific, and rooftop views
- **Dynamic Data Updates**: Simulated real-time sensor data
- **Emergency Controls**: Emergency mode activation
- **Maintenance Scheduling**: View alerts and schedule maintenance

## Quick Start

1. **Open the Dashboard**
   ```bash
   # Serve the files using a local server
   python -m http.server 8000
   # or
   npx serve .
   ```
   
2. **Access the Application**
   Open your browser and navigate to `http://localhost:8000`

## Adding Your Own 3D Model

### Recommended Sources for Japanese Building Models

1. **Sketchfab** (Free with registration)
   - [Traditional Japanese Houses](https://sketchfab.com/3d-models/traditional-japanese-housescurrent-museum-74640f7e468e4c29bb20ef360b89fd68)
   - [Modern Apartment Buildings](https://sketchfab.com/search?q=japanese+apartment&type=models&sort_by=-likesCount)

2. **CGTrader** (Various free models available)
   - Search for "Japanese apartment" or "Japanese house"

3. **Free3D** (Open source models)
   - Multiple Japanese architecture models

### Model Requirements

- **Format**: GLTF (.gltf) or GLB (.glb) preferred
- **Size**: Under 50MB for optimal loading
- **Geometry**: Low to medium poly count (under 100k triangles)
- **Textures**: PBR materials work best

### Installation Steps

1. **Download Model**: Get your chosen model in GLTF/GLB format
2. **Place File**: Copy the model file to the `models/` directory
3. **Update Code**: Modify the model path in `index.html`:

```javascript
// In the loadBuildingModel() function, change this line:
const modelPath = 'models/your-model-name.glb';
```

### Model Setup Tips

- **Scale Adjustment**: Modify the scale in the loading success callback:
  ```javascript
  model.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed
  ```

- **Position Adjustment**: Center the model properly:
  ```javascript
  model.position.set(0, 0, 0); // Adjust position
  ```

- **Sensor Hotspot Positions**: Update sensor locations in `addSensorHotspots()` based on your model

## Sensor Data Customization

### Adding New Sensor Types

1. **Define Sensor Location**:
```javascript
{ 
  x: 10, y: 15, z: 5, 
  type: 'new_sensor', 
  floor: 2, 
  name: 'New Sensor Type', 
  value: 'Initial Value' 
}
```

2. **Add Sensor Color**:
```javascript
// In getSensorColor() function
case 'new_sensor': return 0x00ff00; // Green color
```

3. **Update Value Generator**:
```javascript
// In getSensorValue() function
case 'new_sensor': return `${Math.random().toFixed(1)} units`;
```

### Customizing Data Updates

Modify the `updateSensorData()` function to connect to real IoT APIs:

```javascript
async function updateSensorData() {
    try {
        const response = await fetch('/api/sensors');
        const data = await response.json();
        sensorData = data;
    } catch (error) {
        console.error('Failed to fetch sensor data:', error);
        // Fallback to simulated data
        generateSimulatedData();
    }
}
```

## Camera Controls

- **Orbit**: Left click + drag to rotate around the building
- **Pan**: Right click + drag to move the view
- **Zoom**: Mouse wheel to zoom in/out
- **Reset**: Click "Reset Camera View" button

## Sensor Interaction

- **Hover**: Move mouse over sensors to see basic info
- **Click**: Click on sensors for detailed information
- **Toggle**: Use "Toggle Sensor Hotspots" to show/hide sensors

## Browser Compatibility

- **Chrome**: Recommended
- **Firefox**: Supported
- **Safari**: Supported (may require HTTPS for some features)
- **Edge**: Supported

## Performance Optimization

- Keep 3D models under 100k triangles
- Use compressed textures when possible
- Limit the number of active sensors (currently optimized for 7)
- Use LOD (Level of Detail) models for better performance

## Troubleshooting

### Model Not Loading
1. Check console for error messages
2. Verify model file path and format
3. Ensure model file is not corrupted
4. Try a smaller/simpler model first

### Poor Performance
1. Reduce model complexity
2. Lower texture resolution
3. Reduce number of lights
4. Check browser GPU acceleration

### Sensor Hotspots Not Visible
1. Check if "Toggle Sensor Hotspots" is enabled
2. Verify sensor positions are within camera view
3. Ensure hotspots aren't hidden behind building geometry

## License

This project is open source. Please check individual 3D model licenses before commercial use.

## Support

For issues or questions, please check the console for error messages and ensure all file paths are correct.