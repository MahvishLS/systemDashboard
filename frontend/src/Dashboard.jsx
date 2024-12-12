import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import { FaClock, FaPython, FaBatteryHalf, FaMicrochip, FaMemory, FaThermometerHalf, FaMapMarkerAlt } from 'react-icons/fa';

const Dashboard = () => {
    const [systemInfo, setSystemInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchSystemInfo = async () => {
        try {
            const response = await axios.get('http://localhost:8000/system_info');
            setSystemInfo(response.data);
            setLoading(false);
        } catch (error) {
            console.error("There was an error fetching the system info!", error);
        }
    };

    useEffect(() => {
        fetchSystemInfo();
        const intervalId = setInterval(fetchSystemInfo, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const cards = [
        { title: 'Python Version', content: systemInfo.python_version, icon: <FaPython /> },
        {
            title: 'CPU Usage',
            content: systemInfo.cpu_usage,
            icon: <FaMicrochip />,
        },
        {
            title: 'RAM Usage',
            content: systemInfo.ram_usage,
            icon: <FaMemory />,
        },
        { title: 'Battery Status', content: systemInfo.battery_status, icon: <FaBatteryHalf /> },
        { title: 'CPU Temperature', content: systemInfo.cpu_temp, icon: <FaThermometerHalf /> },
        { title: 'GPU Usage', content: systemInfo.gpu_usage, icon: <FaMicrochip /> },

    ];

    return (

        <div className="container">
            
            <header className="header">
                <div className="header-item">
                    <FaClock /> {systemInfo.current_time || 'Fetching time...'}
                </div>
                <div className="header-item">
                    <FaMapMarkerAlt /> {systemInfo.location || 'Fetching location...'}
                </div>
            </header>

            <h1>System Resource Dashboard</h1>

            {loading ? (
                <div className="text-center">
                    <h3>Loading...</h3>
                </div>
            ) : (
                <div className="row-cards">
                    {cards.map((card, index) => (
                        <div key={index}>
                            <Card
                                title={card.title}
                                content={card.content}
                                icon={card.icon}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
