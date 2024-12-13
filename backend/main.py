from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
import psutil
import platform
import requests
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

def get_system_info():
    current_time = datetime.now().strftime("%d-%m-%Y %H:%M")

    python_version = platform.python_version()
    cpu_usage = psutil.cpu_percent(interval=1)
    cpu_temp = None
    try:
        cpu_temp = psutil.sensors_temperatures().get('coretemp', [{}])[0].get('current', 'N/A')
    except Exception as e:
        cpu_temp = 'N/A'


    # w = wmi.WMI(namespace="root\\OpenHardwareMonitor")
    # temperature_infos = w.Sensor()
    # for sensor in temperature_infos:
    #    if sensor.SensorType == 'Temperature':
    #      print(f"Sensor Name: {sensor.Name}")
    #      print(f"Sensor Value: {sensor.Value} °C")

    
    ram = psutil.virtual_memory()
    ram_usage = ram.percent

    battery = psutil.sensors_battery()
    battery_status = battery.percent if battery else None

    gpu_usage = 'N/A'
    try:
        import subprocess
        result = subprocess.run(['nvidia-smi', '--query-gpu=utilization.gpu', '--format=csv,noheader,nounits'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.stdout:
            gpu_usage = result.stdout.decode().strip() + '%'
    except FileNotFoundError:
        gpu_usage = 'No NVIDIA GPU'

    try:
        ip_data = requests.get('https://ipinfo.io').json()
        location = ip_data.get('city', 'Unknown') + ', ' + ip_data.get('region', 'Unknown') + ', ' + ip_data.get('country', 'Unknown')
    except requests.exceptions.RequestException:
        location = 'Unable to fetch location'

    return {
        "current_time": current_time,
        "python_version": python_version,
        "cpu_usage": cpu_usage,
        "cpu_temp": cpu_temp,
        "ram_usage": ram_usage,
        "battery_status": battery_status,
        "gpu_usage": gpu_usage,
        "location": location
    }

@app.get("/system_info")
async def system_info():
    return get_system_info()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
