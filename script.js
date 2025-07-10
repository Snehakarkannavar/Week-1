// Global variables
let scene, camera, renderer, controls, mixer, model;
let animationId;
let isWireframe = false;
let sensorHotspots = [];
let sensorData = {};
let alertCount = 3;
let hoveredSensor = null;
let currentChart = null;

// Sensor locations and data
const sensorLocations = [
    { x: -5, y: 3, z: 5.5, type: 'temperature', floor: 1, name: 'Temperature - Lobby', id: 'temp_01' },
    { x: 5, y: 3, z: 5.5, type: 'humidity', floor: 1, name: 'Humidity - Entrance', id: 'hum_01' },
    { x: -3.5, y: 7, z: 5.5, type: 'air_quality', floor: 2, name: 'Air Quality - Unit 2A', id: 'air_01' },
    { x: 3.5, y: 7, z: 5.5, type: 'occupancy', floor: 2, name: 'Occupancy - Floor 2', id: 'occ_01' },
    { x: -5, y: 11, z: 5.5, type: 'energy', floor: 3, name: 'Energy Monitor', id: 'eng_01' },
    { x: 0, y: 11, z: 5.5, type: 'security', floor: 3, name: 'Security Camera', id: 'sec_01' },
    { x: 5, y: 15, z: 5.5, type: 'smoke', floor: 4, name: 'Smoke Detector', id: 'smk_01' },
    { x: 0, y: 20, z: 4, type: 'climate', floor: 'PH', name: 'Climate Control', id: 'clm_01' },
    { x: 0, y: 23, z: 0, type: 'weather', floor: 'Roof', name: 'Weather Station', id: 'wth_01' },
    { x: -3, y: 23, z: -2, type: 'solar', floor: 'Roof', name: 'Solar Monitor', id: 'sol_01' }
];

// Initialize the application
function init() {
    setupScene();
    setupLighting();
    addEnvironment();
    loadBuildingModel();
    setupEventListeners();
    startDataSimulation();
    animate();
}

function setupScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(30, 20, 30);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;
    
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 10;
    controls.maxDistance = 100;
}

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 25);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0xffffff, 0.6, 30);
    pointLight1.position.set(0, 15, 0);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xfff2cc, 0.4, 20);
    pointLight2.position.set(10, 10, 10);
    scene.add(pointLight2);
}

function addEnvironment() {
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x7c9885 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    addTrees();
    addSkybox();
}

function addTrees() {
    const treeGeometry = new THREE.ConeGeometry(2, 8, 8);
    const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5a27 });
    
    const positions = [
        { x: -25, z: -25 }, { x: 25, z: -25 },
        { x: -25, z: 25 }, { x: 30, z: 20 }
    ];
    
    positions.forEach(pos => {
        const tree = new THREE.Mesh(treeGeometry, treeMaterial);
        tree.position.set(pos.x, 4, pos.z);
        tree.castShadow = true;
        scene.add(tree);
    });
}

function addSkybox() {
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
        color: 0x87CEEB,
        side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
}

function loadBuildingModel() {
    const loader = new THREE.GLTFLoader();
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    const progressFill = document.getElementById('progress-fill');
    
    // Try to load GLTF model first, fallback to placeholder
    const modelPaths = [
        'models/building.glb',
        'models/apartment.gltf',
        'models/office.glb'
    ];
    
    let currentModelIndex = 0;
    
    function tryLoadModel(index) {
        if (index >= modelPaths.length) {
            console.log('Using enhanced placeholder building');
            loadingText.textContent = 'Creating building model...';
            createEnhancedBuilding();
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1500);
            return;
        }
        
        const modelPath = modelPaths[index];
        loadingText.textContent = `Loading: ${modelPath.split('/').pop()}...`;
        
        loader.load(
            modelPath,
            function (gltf) {
                model = gltf.scene;
                
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const maxDimension = Math.max(size.x, size.y, size.z);
                const scale = 20 / maxDimension;
                
                model.scale.set(scale, scale, scale);
                
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center.multiplyScalar(scale));
                model.position.y = 0;
                
                model.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material) {
                            child.material.needsUpdate = true;
                        }
                    }
                });
                
                scene.add(model);
                
                if (gltf.animations && gltf.animations.length > 0) {
                    mixer = new THREE.AnimationMixer(model);
                    gltf.animations.forEach(clip => {
                        const action = mixer.clipAction(clip);
                        action.play();
                    });
                }
                
                addSensorHotspots();
                loadingScreen.style.display = 'none';
            },
            function (progress) {
                if (progress.total > 0) {
                    const percentComplete = (progress.loaded / progress.total) * 100;
                    progressFill.style.width = percentComplete + '%';
                    loadingText.textContent = `Loading: ${Math.round(percentComplete)}%`;
                }
            },
            function (error) {
                console.log(`Failed to load ${modelPath}:`, error.message);
                tryLoadModel(index + 1);
            }
        );
    }
    
    tryLoadModel(0);
}

function createEnhancedBuilding() {
    const buildingGroup = new THREE.Group();
    
    // Building materials
    const concreteMaterial = new THREE.MeshLambertMaterial({ color: 0xe8e4d9 });
    const windowMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x87ceeb, 
        transparent: true, 
        opacity: 0.7,
        emissive: 0x001122
    });
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
    const balconyMaterial = new THREE.MeshLambertMaterial({ color: 0xbdc3c7 });
    const accentMaterial = new THREE.MeshLambertMaterial({ color: 0x34495e });
    
    // Main building structure
    const mainGeometry = new THREE.BoxGeometry(14, 18, 10);
    const mainBuilding = new THREE.Mesh(mainGeometry, concreteMaterial);
    mainBuilding.position.y = 9;
    mainBuilding.castShadow = true;
    mainBuilding.receiveShadow = true;
    buildingGroup.add(mainBuilding);
    
    // Penthouse
    const penthouseGeometry = new THREE.BoxGeometry(10, 4, 8);
    const penthouse = new THREE.Mesh(penthouseGeometry, concreteMaterial);
    penthouse.position.y = 20;
    penthouse.castShadow = true;
    buildingGroup.add(penthouse);
    
    // Roof
    const roofGeometry = new THREE.BoxGeometry(12, 0.5, 9);
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 22.5;
    roof.castShadow = true;
    buildingGroup.add(roof);
    
    // Create windows and balconies
    const floors = 4;
    const unitsPerFloor = 4;
    
    for (let floor = 0; floor < floors; floor++) {
        const floorY = 3 + floor * 4;
        
        for (let unit = 0; unit < unitsPerFloor; unit++) {
            const unitX = -5.25 + unit * 3.5;
            
            // Windows
            const windowGeometry = new THREE.PlaneGeometry(2.5, 2.8);
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(unitX, floorY, 5.1);
            buildingGroup.add(window);
            
            // Window frames
            const frameGeometry = new THREE.PlaneGeometry(2.7, 3);
            const frame = new THREE.Mesh(frameGeometry, accentMaterial);
            frame.position.set(unitX, floorY, 5.05);
            buildingGroup.add(frame);
            
            // Balconies (floors 2-4)
            if (floor > 0) {
                const balconyGeometry = new THREE.BoxGeometry(3, 0.15, 1.8);
                const balcony = new THREE.Mesh(balconyGeometry, balconyMaterial);
                balcony.position.set(unitX, floorY - 1.5, 6);
                balcony.castShadow = true;
                buildingGroup.add(balcony);
                
                const railingGeometry = new THREE.BoxGeometry(3, 1, 0.1);
                const railing = new THREE.Mesh(railingGeometry, accentMaterial);
                railing.position.set(unitX, floorY - 0.8, 6.8);
                buildingGroup.add(railing);
            }
        }
        
        // Side windows
        for (let side = 0; side < 2; side++) {
            const sideX = side === 0 ? -7.1 : 7.1;
            const rotation = side === 0 ? -Math.PI / 2 : Math.PI / 2;
            
            for (let window = 0; window < 2; window++) {
                const windowZ = -3 + window * 6;
                
                const sideWindowGeometry = new THREE.PlaneGeometry(2, 2.5);
                const sideWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
                sideWindow.position.set(sideX, floorY, windowZ);
                sideWindow.rotation.y = rotation;
                buildingGroup.add(sideWindow);
            }
        }
    }
    
    // Entrance
    const entranceGeometry = new THREE.BoxGeometry(4, 3.5, 1);
    const entrance = new THREE.Mesh(entranceGeometry, accentMaterial);
    entrance.position.set(0, 1.75, 5.5);
    buildingGroup.add(entrance);
    
    const doorGeometry = new THREE.PlaneGeometry(1.8, 3);
    const door = new THREE.Mesh(doorGeometry, windowMaterial);
    door.position.set(0, 1.5, 6.1);
    buildingGroup.add(door);
    
    // Rooftop equipment
    const equipmentPositions = [
        { x: -3, z: -2 }, { x: 3, z: -2 }, { x: 0, z: 2 }
    ];
    equipmentPositions.forEach(pos => {
        const equipGeometry = new THREE.BoxGeometry(1.5, 1.2, 1);
        const equipment = new THREE.Mesh(equipGeometry, accentMaterial);
        equipment.position.set(pos.x, 23, pos.z);
        equipment.castShadow = true;
        buildingGroup.add(equipment);
    });
    
    scene.add(buildingGroup);
    model = buildingGroup;
    addSensorHotspots();
}

function addSensorHotspots() {
    sensorLocations.forEach(location => {
        const hotspot = createSensorHotspot(location);
        sensorHotspots.push(hotspot);
        scene.add(hotspot);
    });
}

function createSensorHotspot(location) {
    const hotspotGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const hotspotMaterial = new THREE.MeshBasicMaterial({ 
        color: getSensorColor(location.type),
        transparent: true,
        opacity: 0.8
    });
    
    const hotspot = new THREE.Mesh(hotspotGeometry, hotspotMaterial);
    hotspot.position.set(location.x, location.y, location.z);
    hotspot.userData = { 
        type: location.type, 
        floor: location.floor,
        name: location.name,
        id: location.id,
        location: location
    };
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: getSensorColor(location.type),
        transparent: true,
        opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    hotspot.add(glow);
    
    return hotspot;
}

function getSensorColor(type) {
    const colors = {
        temperature: 0xff6b6b,
        humidity: 0x4ecdc4,
        air_quality: 0x45b7d1,
        occupancy: 0xf7dc6f,
        energy: 0xbb8fce,
        security: 0x82e0aa,
        weather: 0xf8c471,
        smoke: 0xff4757,
        climate: 0x00d2d3,
        solar: 0xffb8b8
    };
    return colors[type] || 0x3b82f6;
}

function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);
    
    renderer.domElement.addEventListener('click', onMouseClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    
    // UI Controls
    document.getElementById('cameraView').addEventListener('change', changeCameraView);
    document.getElementById('sensorFilter').addEventListener('change', filterSensors);
    document.getElementById('resetCamera').addEventListener('click', resetCamera);
    document.getElementById('toggleWireframe').addEventListener('click', toggleWireframe);
    document.getElementById('viewAlerts').addEventListener('click', showAlerts);
    document.getElementById('scheduleMain').addEventListener('click', scheduleMaintenanc);
    
    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // Sensor card interactions
    document.querySelectorAll('.sensor-card').forEach(card => {
        card.addEventListener('click', function() {
            const sensorType = this.dataset.sensor;
            highlightSensorType(sensorType);
        });
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(sensorHotspots, false);
    
    if (intersects.length > 0) {
        const sensor = intersects[0].object;
        showSensorModal(sensor.userData);
    }
}

function onMouseMove(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(sensorHotspots, false);
    const tooltip = document.getElementById('sensorTooltip');
    
    if (intersects.length > 0) {
        const sensor = intersects[0].object;
        
        if (hoveredSensor !== sensor) {
            hoveredSensor = sensor;
            showSensorTooltip(sensor.userData, event);
        }
        
        // Update tooltip position
        tooltip.style.left = event.clientX + 15 + 'px';
        tooltip.style.top = event.clientY - 15 + 'px';
        
        renderer.domElement.style.cursor = 'pointer';
    } else {
        if (hoveredSensor) {
            hideSensorTooltip();
            hoveredSensor = null;
        }
        renderer.domElement.style.cursor = 'grab';
    }
}

function showSensorTooltip(sensorData, event) {
    const tooltip = document.getElementById('sensorTooltip');
    const value = generateSensorValue(sensorData.type);
    
    tooltip.querySelector('.tooltip-title').textContent = sensorData.name;
    tooltip.querySelector('.tooltip-status').textContent = 'Online';
    tooltip.querySelector('.tooltip-data').textContent = value;
    tooltip.querySelector('.tooltip-location').textContent = `Floor: ${sensorData.floor}`;
    tooltip.querySelector('.tooltip-timestamp').textContent = `Updated: ${new Date().toLocaleTimeString()}`;
    
    tooltip.style.opacity = '1';
    tooltip.style.left = event.clientX + 15 + 'px';
    tooltip.style.top = event.clientY - 15 + 'px';
}

function hideSensorTooltip() {
    const tooltip = document.getElementById('sensorTooltip');
    tooltip.style.opacity = '0';
}

function showSensorModal(sensorData) {
    const modal = document.getElementById('sensorModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = sensorData.name;
    
    const value = generateSensorValue(sensorData.type);
    const status = 'Online';
    const lastUpdate = new Date().toLocaleString();
    
    modalContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
                <strong>Current Value:</strong><br>
                <span style="font-size: 24px; color: #10b981;">${value}</span>
            </div>
            <div>
                <strong>Status:</strong><br>
                <span style="color: #10b981;">${status}</span>
            </div>
            <div>
                <strong>Location:</strong><br>
                Floor ${sensorData.floor}
            </div>
            <div>
                <strong>Last Update:</strong><br>
                ${lastUpdate}
            </div>
        </div>
        <div style="margin-top: 16px;">
            <strong>Historical Data (Last 24 Hours):</strong>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Create chart
    setTimeout(() => {
        createSensorChart(sensorData.type);
    }, 100);
}

function createSensorChart(sensorType) {
    const canvas = document.getElementById('sensorChart');
    const ctx = canvas.getContext('2d');
    
    // Clear previous chart
    if (currentChart) {
        currentChart.destroy();
    }
    
    // Generate sample data
    const hours = [];
    const values = [];
    
    for (let i = 23; i >= 0; i--) {
        const date = new Date();
        date.setHours(date.getHours() - i);
        hours.push(date.getHours() + ':00');
        values.push(generateRandomSensorValue(sensorType));
    }
    
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: getSensorLabel(sensorType),
                data: values,
                borderColor: `#${getSensorColor(sensorType).toString(16)}`,
                backgroundColor: `#${getSensorColor(sensorType).toString(16)}33`,
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#e2e8f0'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#cbd5e1'
                    },
                    grid: {
                        color: '#374151'
                    }
                },
                y: {
                    ticks: {
                        color: '#cbd5e1'
                    },
                    grid: {
                        color: '#374151'
                    }
                }
            }
        }
    });
}

function generateRandomSensorValue(type) {
    switch(type) {
        case 'temperature': return 18 + Math.random() * 10;
        case 'humidity': return 35 + Math.random() * 30;
        case 'air_quality': return 50 + Math.random() * 50;
        case 'occupancy': return Math.random() * 100;
        case 'energy': return 100 + Math.random() * 50;
        default: return Math.random() * 100;
    }
}

function getSensorLabel(type) {
    const labels = {
        temperature: 'Temperature (°C)',
        humidity: 'Humidity (%)',
        air_quality: 'Air Quality Index',
        occupancy: 'Occupancy (%)',
        energy: 'Energy (kW)',
        security: 'Security Level',
        weather: 'Temperature (°C)',
        smoke: 'Smoke Level',
        climate: 'Climate Index',
        solar: 'Solar Output (kW)'
    };
    return labels[type] || 'Sensor Value';
}

function generateSensorValue(type) {
    switch(type) {
        case 'temperature': return `${(20 + Math.random() * 8).toFixed(1)}°C`;
        case 'humidity': return `${(40 + Math.random() * 20).toFixed(0)}%`;
        case 'air_quality': return ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)];
        case 'occupancy': return `${Math.floor(Math.random() * 100)}%`;
        case 'energy': return `${(100 + Math.random() * 50).toFixed(1)} kW`;
        case 'security': return 'Active';
        case 'weather': return `${(15 + Math.random() * 15).toFixed(1)}°C`;
        case 'smoke': return 'Normal';
        case 'climate': return `${(22 + Math.random() * 4).toFixed(1)}°C`;
        case 'solar': return `${(1 + Math.random() * 3).toFixed(1)} kW`;
        default: return 'N/A';
    }
}

function closeModal() {
    document.getElementById('sensorModal').style.display = 'none';
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
}

function changeCameraView() {
    const view = document.getElementById('cameraView').value;
    
    switch(view) {
        case 'overview':
            camera.position.set(30, 20, 30);
            controls.target.set(0, 8, 0);
            break;
        case 'floor1':
            camera.position.set(15, 6, 15);
            controls.target.set(0, 6, 0);
            break;
        case 'floor2':
            camera.position.set(15, 10, 15);
            controls.target.set(0, 10, 0);
            break;
        case 'floor3':
            camera.position.set(15, 14, 15);
            controls.target.set(0, 14, 0);
            break;
        case 'rooftop':
            camera.position.set(10, 25, 10);
            controls.target.set(0, 18, 0);
            break;
    }
    controls.update();
}

function filterSensors() {
    const filter = document.getElementById('sensorFilter').value;
    
    sensorHotspots.forEach(hotspot => {
        if (filter === 'all' || hotspot.userData.type === filter) {
            hotspot.visible = true;
        } else {
            hotspot.visible = false;
        }
    });
}

function highlightSensorType(sensorType) {
    sensorHotspots.forEach(hotspot => {
        if (hotspot.userData.type === sensorType) {
            // Highlight animation
            hotspot.scale.setScalar(1.5);
            setTimeout(() => {
                hotspot.scale.setScalar(1);
            }, 1000);
        }
    });
    
    // Highlight corresponding UI card
    const card = document.querySelector(`[data-sensor="${sensorType}"]`);
    if (card) {
        card.classList.add('sensor-highlight');
        setTimeout(() => {
            card.classList.remove('sensor-highlight');
        }, 1000);
    }
}

function resetCamera() {
    camera.position.set(30, 20, 30);
    controls.target.set(0, 8, 0);
    controls.update();
}

function toggleWireframe() {
    isWireframe = !isWireframe;
    
    if (model) {
        model.traverse(function (child) {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => {
                        material.wireframe = isWireframe;
                    });
                } else {
                    child.material.wireframe = isWireframe;
                }
            }
        });
    }
}

function showAlerts() {
    alert('Active Alerts:\n• HVAC System - Filter replacement due\n• Fire Safety - Monthly inspection required\n• Energy Monitor - High consumption detected');
}

function scheduleMaintenanc() {
    alert('Maintenance Scheduler:\n• HVAC Filter: Scheduled for tomorrow\n• Fire Safety Check: Scheduled for next week\n• Energy Audit: Scheduled for Friday');
}

function startDataSimulation() {
    setInterval(() => {
        updateSensorData();
        updateUI();
        animateHotspots();
    }, 3000);
}

function updateSensorData() {
    sensorData = {
        temperature: (20 + Math.random() * 8).toFixed(1),
        humidity: (40 + Math.random() * 20).toFixed(0),
        airQuality: ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)],
        occupancy: Math.floor(Math.random() * 100),
        energy: (100 + Math.random() * 50).toFixed(1),
        water: (1000 + Math.random() * 500).toFixed(0),
        activeAlerts: Math.floor(Math.random() * 6),
        maintenanceDue: Math.floor(Math.random() * 5) + 1
    };
}

function updateUI() {
    document.getElementById('temperature').textContent = sensorData.temperature + '°C';
    document.getElementById('humidity').textContent = sensorData.humidity + '%';
    document.getElementById('airQuality').textContent = sensorData.airQuality;
    document.getElementById('occupancy').textContent = sensorData.occupancy + '%';
    document.getElementById('energy').textContent = sensorData.energy + ' kW';
    document.getElementById('water').textContent = sensorData.water + ' L';
    document.getElementById('activeAlerts').textContent = sensorData.activeAlerts;
    document.getElementById('maintenanceDue').textContent = sensorData.maintenanceDue + ' items';
    document.getElementById('activeSensors').textContent = sensorLocations.length;
    
    // Update alert styling
    const alertsElement = document.getElementById('activeAlerts');
    alertsElement.className = 'stat-value';
    if (sensorData.activeAlerts > 4) {
        alertsElement.classList.add('critical');
    } else if (sensorData.activeAlerts > 2) {
        alertsElement.classList.add('warning');
    }
    
    // Update air quality color
    const airQualityElement = document.getElementById('airQuality');
    if (sensorData.airQuality === 'Poor') {
        airQualityElement.style.color = '#ef4444';
    } else if (sensorData.airQuality === 'Fair') {
        airQualityElement.style.color = '#f59e0b';
    } else {
        airQualityElement.style.color = '#10b981';
    }
}

function animateHotspots() {
    const time = Date.now() * 0.001;
    sensorHotspots.forEach((hotspot, index) => {
        hotspot.scale.setScalar(1 + Math.sin(time * 2 + index) * 0.1);
        hotspot.rotation.y += 0.01;
    });
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    controls.update();
    
    if (mixer) {
        mixer.update(0.016);
    }
    
    renderer.render(scene, camera);
}

// Initialize the application
init();