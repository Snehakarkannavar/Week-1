#!/usr/bin/env python3
"""
3D Model Downloader for IoT Building Maintenance Dashboard

This script helps you download suitable 3D models for your Japanese apartment building dashboard.
"""

import os
import sys
import urllib.request
import zipfile
from pathlib import Path

def create_models_directory():
    """Create the models directory if it doesn't exist."""
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    return models_dir

def download_file(url, filename):
    """Download a file from URL with progress indication."""
    try:
        print(f"Downloading {filename}...")
        
        def progress_hook(block_num, block_size, total_size):
            downloaded = block_num * block_size
            if total_size > 0:
                percent = min(100, (downloaded * 100) // total_size)
                sys.stdout.write(f"\rProgress: {percent}% [{downloaded}/{total_size} bytes]")
                sys.stdout.flush()
        
        urllib.request.urlretrieve(url, filename, progress_hook)
        print(f"\n✓ Downloaded: {filename}")
        return True
    except Exception as e:
        print(f"\n✗ Failed to download: {e}")
        return False

def extract_archive(archive_path, extract_to):
    """Extract zip archive and find model files."""
    try:
        with zipfile.ZipFile(archive_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        
        # Look for model files
        model_extensions = ['.glb', '.gltf', '.fbx', '.obj']
        model_files = []
        
        for ext in model_extensions:
            model_files.extend(list(extract_to.glob(f"**/*{ext}")))
        
        return model_files
    except Exception as e:
        print(f"Error extracting archive: {e}")
        return []

def main():
    print("🏢 IoT Building Dashboard - 3D Model Downloader")
    print("=" * 50)
    
    models_dir = create_models_directory()
    
    # Sample free models (these are examples - you'll need to find actual download links)
    sample_models = {
        "Simple Apartment Building": {
            "description": "A basic modern apartment building",
            "note": "You'll need to find and replace this URL with a real download link"
        },
        "Japanese Style Building": {
            "description": "Traditional Japanese architecture",
            "note": "Check Sketchfab for Japanese building models"
        }
    }
    
    print("\n📋 Recommended Sources for 3D Models:")
    print("\n1. Sketchfab (https://sketchfab.com)")
    print("   - Search for 'Japanese apartment' or 'modern building'")
    print("   - Filter by 'Downloadable' and 'Free'")
    print("   - Look for GLTF/GLB format")
    
    print("\n2. CGTrader (https://www.cgtrader.com)")
    print("   - Free 3D Models section")
    print("   - Search for 'apartment building' or 'Japanese house'")
    
    print("\n3. Free3D (https://free3d.com)")
    print("   - Architecture section")
    print("   - Japanese building models")
    
    print("\n4. OpenGameArt (https://opengameart.org)")
    print("   - 3D Art section")
    print("   - Building models")
    
    print("\n📁 Model Requirements:")
    print("   - Format: GLTF (.gltf) or GLB (.glb) preferred")
    print("   - Size: Under 50MB")
    print("   - Poly count: Under 100k triangles")
    print("   - License: Compatible with your use case")
    
    print(f"\n📂 Place downloaded models in: {models_dir.absolute()}")
    
    print("\n🔧 After downloading a model:")
    print("1. Place the .glb or .gltf file in the 'models/' directory")
    print("2. Rename it to 'japanese_apartment.glb' (or update the code)")
    print("3. Start your local server and reload the page")
    
    print("\n💡 Quick Test:")
    print("   python -m http.server 8000")
    print("   Then open: http://localhost:8000")
    
    # Check if there are any models already
    existing_models = list(models_dir.glob("*.glb")) + list(models_dir.glob("*.gltf"))
    if existing_models:
        print(f"\n✓ Found existing models:")
        for model in existing_models:
            print(f"   - {model.name}")
    else:
        print(f"\n⚠️  No models found in {models_dir}/")
        print("   The dashboard will use the enhanced placeholder building.")

if __name__ == "__main__":
    main()