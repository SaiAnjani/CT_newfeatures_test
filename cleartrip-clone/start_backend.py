#!/usr/bin/env python3
"""
Startup script for the Flight Data API Backend
"""

import os
import sys
import subprocess
import time

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def install_requirements():
    """Install required packages"""
    print("📦 Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install requirements")
        sys.exit(1)

def check_csv_file():
    """Check if flights_data.csv exists"""
    if not os.path.exists("flights_data.csv"):
        print("❌ flights_data.csv not found!")
        print("Please ensure the CSV file is in the current directory")
        sys.exit(1)
    print("✅ flights_data.csv found")

def start_server():
    """Start the Flask server"""
    print("🚀 Starting Flight Data API Server...")
    print("📍 Server will be available at: http://localhost:5000")
    print("🌐 API Base URL: http://localhost:5000/api")
    print("📱 Main Page: http://localhost:5000/")
    print("\n" + "="*50)
    
    try:
        # Import and run the Flask app
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

def main():
    """Main startup function"""
    print("🎯 Flight Data API Backend Startup")
    print("="*50)
    
    # Check Python version
    check_python_version()
    
    # Check for CSV file
    check_csv_file()
    
    # Install requirements
    install_requirements()
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
