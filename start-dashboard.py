#!/usr/bin/env python3
"""
Quick Start Script for IoT Building Maintenance Dashboard

This script starts a local HTTP server to serve the dashboard.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

def find_available_port(start_port=8000):
    """Find an available port starting from start_port."""
    import socket
    for port in range(start_port, start_port + 100):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            sock.bind(('localhost', port))
            sock.close()
            return port
        except OSError:
            continue
    return None

def main():
    print("🏢 IoT Building Maintenance Dashboard")
    print("=" * 40)
    
    # Check if index.html exists
    if not Path("index.html").exists():
        print("❌ Error: index.html not found!")
        print("   Make sure you're running this script from the project directory.")
        sys.exit(1)
    
    # Find available port
    port = find_available_port(8000)
    if port is None:
        print("❌ Error: No available ports found!")
        sys.exit(1)
    
    # Check for 3D models
    models_dir = Path("models")
    model_files = []
    if models_dir.exists():
        model_files = list(models_dir.glob("*.glb")) + list(models_dir.glob("*.gltf"))
    
    print(f"\n📂 Project Status:")
    print(f"   - Dashboard: ✓ Found index.html")
    print(f"   - Models: {len(model_files)} found")
    
    if model_files:
        print(f"   - Model files:")
        for model in model_files:
            print(f"     • {model.name}")
    else:
        print(f"   - No 3D models found - using enhanced placeholder building")
        print(f"   - Run 'python3 download-model.py' for model download guide")
    
    print(f"\n🚀 Starting server on port {port}...")
    
    try:
        # Create HTTP server
        handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer(("", port), handler) as httpd:
            url = f"http://localhost:{port}"
            print(f"   Dashboard URL: {url}")
            print(f"\n📱 Controls:")
            print(f"   - Mouse: Orbit camera around building")
            print(f"   - Wheel: Zoom in/out")
            print(f"   - Click sensors: View detailed information")
            print(f"   - Use UI panels: Control lighting, camera views, etc.")
            
            print(f"\n💡 Tips:")
            print(f"   - Try different camera views from the top-right panel")
            print(f"   - Click on the glowing sensor spheres for details")
            print(f"   - Toggle sensor visibility with the button")
            print(f"   - Watch for real-time data updates every 2 seconds")
            
            print(f"\n🔗 Opening browser...")
            
            # Try to open browser
            try:
                webbrowser.open(url)
                print(f"   Browser opened automatically")
            except:
                print(f"   Please manually open: {url}")
            
            print(f"\n⏹️  Press Ctrl+C to stop the server")
            print("=" * 40)
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print(f"\n\n⏹️  Server stopped by user")
        print(f"   Thank you for using the IoT Building Dashboard!")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()