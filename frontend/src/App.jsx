import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { ShieldAlert, Users, Clock, Bus, Car, Siren, Accessibility, Info, Phone, LifeBuoy, Building, MapPin, Search } from 'lucide-react';

// Register Chart.js components we'll use
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- MOCK API SERVICE ---
// This object simulates your entire backend, providing realistic fake data for every widget.
const MockAPI = {
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    getEmergencyAlerts: async function() {
        await MockAPI.sleep(300);
        return [
            { time: "14:32", message: "High crowd density detected in Zone A", type: "high" },
            { time: "14:28", message: "Parking Level 1 at 95% capacity", type: "medium" },
            { time: "14:25", message: "All systems operating normally", type: "low" },
        ];
    },
    getLiveDensity: async function() {
        await MockAPI.sleep(400);
        return [
            { id: 'main_temple', name: 'Main Temple', visitors: MockAPI.random(3000, 3400), status: 'high' },
            { id: 'queue_area', name: 'Queue Area', visitors: MockAPI.random(2600, 3000), status: 'medium' },
            { id: 'parking', name: 'Parking', visitors: MockAPI.random(1300, 1700), status: 'low' },
            { id: 'food_court', name: 'Food Court', visitors: MockAPI.random(1000, 1400), status: 'medium' }
        ];
    },
    getForecastChart: async function() {
        await MockAPI.sleep(600);
        return {
            labels: ["6:00", "8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
            predicted: [4000, 6500, 9000, 12500, 11000, 9500, 6000, 3000],
            actual: [3800, 6200, 8800, 12800, 11500, 9800, null, null],
            maxCapacity: 15000
        };
    },
    getParking: async function() {
        await MockAPI.sleep(350);
        return {
            recommendedLevel: "Basement 2",
            levels: [
                { name: "Ground Floor", occupied: MockAPI.random(175, 195), total: 200 },
                { name: "Basement 1", occupied: 295, total: 300 },
                { name: "Basement 2", occupied: MockAPI.random(100, 150), total: 350 },
                { name: "Basement 3", occupied: MockAPI.random(40, 60), total: 250 },
            ]
        };
    },
    getQueues: async function() {
        await MockAPI.sleep(450);
        return [
            { name: "General Darshan", waitTime: MockAPI.random(20, 30), status: "normal" },
            { name: "VIP Pass", waitTime: MockAPI.random(5, 10), status: "low" },
            { name: "Prasad Counter", waitTime: MockAPI.random(40, 50), status: "high" },
            { name: "Special Services", waitTime: MockAPI.random(10, 15), status: "normal" },
        ];
    },
    getShuttles: async function() {
        await MockAPI.sleep(500);
        const statuses = ["Active", "Loading", "Offline"];
        return [
            { id: "Bus #1", status: statuses[0], details: "En route to Gate 2" },
            { id: "Bus #2", status: statuses[1], details: "At Parking Level B1" },
            { id: "Bus #3", status: statuses[2], details: "Maintenance" },
        ];
    },
    getTempleInfo: async function() {
        await MockAPI.sleep(200);
        return {
            timings: [
                { name: "Morning Darshan", time: "6:00 AM - 12:00 PM" },
                { name: "Special Pooja", time: "7:00 PM - 8:00 PM" },
                { name: "Evening Darshan", time: "4:00 PM - 9:00 PM" },
                { name: "Aarti", time: "8:30 PM" },
            ],
            facilities: [
                { name: "Restrooms", location: "Near Main Gate & Food Court" },
                { name: "Water Stations", location: "Every 100m along pilgrim path" },
                { name: "Medical Aid", location: "Emergency Station, Gate 1" },
                { name: "Lost & Found", location: "Information Desk, Main Entrance"},
                { name: "Prasad Shop", location: "Exit Plaza, Level 1"},
            ]
        };
    },
};

// --- HELPER HOOK for auto-refreshing data ---
const useLiveData = (apiCall, interval = 5000) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = () => apiCall().then(setData);
        fetchData();
        const timer = setInterval(fetchData, interval);
        return () => clearInterval(timer);
    }, [apiCall, interval]);
    return data;
};

// --- REUSABLE WIDGET COMPONENTS ---
const Widget = ({ children, className = '' }) => <div className={`bg-white p-6 rounded-xl shadow-sm ${className}`}>{children}</div>;
const WidgetTitle = ({ icon, title }) => (
    <div className="flex items-center text-gray-500 font-semibold mb-4 text-xs uppercase tracking-wider">
        {icon}
        <h3 className="ml-2">{title}</h3>
    </div>
);

// --- ADMIN DASHBOARD WIDGETS ---
const EmergencyAlerts = () => {
    const alerts = useLiveData(MockAPI.getEmergencyAlerts, 7000);
    if (!alerts) return <Widget>Loading Alerts...</Widget>;
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg">
            <WidgetTitle icon={<Siren className="text-red-600" />} title="Emergency & Safety Alerts" />
            <div className="space-y-3 h-24 overflow-y-auto pr-2">
                {alerts.map((alert, i) => (
                    <div key={i} className={`flex items-start text-sm ${alert.type === 'high' ? 'text-red-800 font-semibold' : 'text-gray-600'}`}>
                        <span className="font-medium text-gray-500 mr-4">{alert.time}</span>
                        <span>{alert.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LiveDensityWidget = () => {
    const densityData = useLiveData(MockAPI.getLiveDensity);
    const statusColors = { high: 'bg-red-500', medium: 'bg-yellow-400', low: 'bg-green-500' };
    if (!densityData) return <Widget>Loading Density...</Widget>;
    return (
        <Widget>
            <WidgetTitle icon={<MapPin size={16} />} title="Live Crowd Density Map" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {densityData.map(zone => (
                    <div key={zone.id}>
                        <div className="flex items-center text-sm text-gray-500"><span className={`w-3 h-3 rounded-full mr-2 ${statusColors[zone.status]}`}></span>{zone.name}</div>
                        <div className="text-2xl font-bold text-gray-800">{zone.visitors.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">visitors</div>
                    </div>
                ))}
            </div>
             <div className="flex items-center space-x-4 text-xs mt-4 text-gray-400 pt-4 border-t">
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>Low Density</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5"></span>Medium</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>High</div>
            </div>
        </Widget>
    );
};

const ForecastChart = () => {
    const forecastData = useLiveData(MockAPI.getForecastChart, 60000);
    if (!forecastData) return <Widget className="h-full min-h-[400px]">Loading Chart...</Widget>;
    const chartConfig = {
        data: {
            labels: forecastData.labels,
            datasets: [
                { label: 'Predicted', data: forecastData.predicted, borderColor: 'rgb(255, 159, 64)', borderDash: [5, 5], tension: 0.4, pointBackgroundColor: 'rgb(255, 159, 64)' },
                { label: 'Actual', data: forecastData.actual, borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.1)', tension: 0.4, fill: true, pointBackgroundColor: 'rgb(54, 162, 235)' },
                { label: 'Max Capacity', data: Array(forecastData.labels.length).fill(forecastData.maxCapacity), borderColor: 'rgb(255, 99, 132)', borderDash: [10, 5], pointRadius: 0, borderWidth: 1.5 },
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 20000 } } }
    };
    return (
        <Widget className="h-full flex flex-col">
            <WidgetTitle icon={<Clock size={16} />} title="Crowd Forecast vs Reality" />
            <div className="flex-grow relative"><Line options={chartConfig.options} data={chartConfig.data} /></div>
            <p className="text-xs text-gray-400 mt-2 text-center">Peak expected at 4:30 PM. Based on historical data.</p>
        </Widget>
    );
};

const ParkingManagement = () => {
    const parkingData = useLiveData(MockAPI.getParking);
    if (!parkingData) return <Widget>Loading Parking...</Widget>;
    return (
        <Widget>
            <WidgetTitle icon={<Car size={16} />} title="Parking Management" />
            <div className="bg-orange-50 text-orange-800 p-3 rounded-lg text-center mb-4">
                <div className="text-xs uppercase font-semibold">Recommended Level</div>
                <div className="font-bold text-lg">{parkingData.recommendedLevel}</div>
            </div>
            <div className="space-y-3">
                {parkingData.levels.map(level => (
                    <div key={level.name}>
                        <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{level.name}</span><span className="font-semibold text-gray-800">{level.occupied}/{level.total}</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(level.occupied / level.total) * 100}%` }}></div></div>
                    </div>
                ))}
            </div>
        </Widget>
    );
};

const QueueStatus = ({ isPilgrimPortal = false }) => {
    const queueData = useLiveData(MockAPI.getQueues);
    const statusStyles = { high: 'text-red-500', normal: 'text-yellow-500', low: 'text-green-500' };
    if (!queueData) return <Widget>Loading Queues...</Widget>;
    const Wrapper = isPilgrimPortal ? 'div' : Widget;
    return (
        <Wrapper>
            {!isPilgrimPortal && <WidgetTitle icon={<Users size={16} />} title="Queue Status" />}
            <div className="space-y-4">
                {queueData.map(q => (
                    <div key={q.name} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                        <div>
                            <div className="text-gray-800 font-medium">{q.name}</div>
                            <div className="text-xs text-gray-400">{isPilgrimPortal ? 'Estimated wait' : 'Wait Time'}</div>
                        </div>
                        <div className="text-right">
                             <div className={`text-xl font-bold ${statusStyles[q.status]}`}>{q.waitTime}min</div>
                             <div className={`text-xs capitalize font-semibold ${statusStyles[q.status]}`}>{q.status}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Wrapper>
    );
};

const ShuttleTracker = () => {
    const shuttleData = useLiveData(MockAPI.getShuttles);
    const statusStyles = { Active: 'bg-green-100 text-green-800', Loading: 'bg-yellow-100 text-yellow-800', Offline: 'bg-gray-100 text-gray-800' };
    if (!shuttleData) return <Widget>Loading Shuttles...</Widget>;
    return (
        <Widget>
            <WidgetTitle icon={<Bus size={16} />} title="Shuttle Tracker" />
            <div className="space-y-4">
                {shuttleData.map(s => (
                     <div key={s.id} className="flex justify-between items-center">
                        <div>
                            <div className="font-semibold text-gray-800">{s.id}</div>
                            <div className="text-xs text-gray-500">{s.details}</div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusStyles[s.status]}`}>{s.status}</span>
                    </div>
                ))}
            </div>
        </Widget>
    );
};

// --- PILGRIM PORTAL WIDGETS ---
const DigitalDarshanPass = () => (
    <Widget>
        <WidgetTitle icon={<Users className="text-orange-500"/>} title="Digital Darshan Pass" />
        <p className="text-gray-500 mb-4">Reserve your place in line and receive SMS updates about your queue status.</p>
        <button className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition">Book Queue Slot</button>
        <div className="mt-6 border-t pt-6"><h4 className="font-semibold mb-4 text-gray-700">Current Wait Times</h4><QueueStatus isPilgrimPortal={true} /></div>
    </Widget>
);

const TempleInformation = () => {
    const info = useLiveData(MockAPI.getTempleInfo, 3600000);
    if (!info) return <Widget>Loading Info...</Widget>;
    return (
        <Widget>
             <WidgetTitle icon={<Building className="text-orange-500"/>} title="Temple Information" />
            <div className="mb-6"><h4 className="font-semibold mb-3 text-gray-600">Today's Timings</h4><div className="space-y-2 text-sm text-gray-500">{info.timings.map(t => <div key={t.name} className="flex justify-between"><span>{t.name}</span><span className="font-semibold text-gray-700">{t.time}</span></div>)}</div></div>
             <div><h4 className="font-semibold mb-3 text-gray-600">Facility Locations</h4><div className="space-y-2 text-sm text-gray-500">{info.facilities.map(f => <div key={f.name} className="flex justify-between"><span>{f.name}</span><span className="font-semibold text-gray-700">{f.location}</span></div>)}</div></div>
        </Widget>
    );
};

const EmergencyContacts = () => (
     <Widget>
        <WidgetTitle icon={<Siren className="text-red-600"/>} title="Emergency Contacts"/>
        <div className="space-y-4">
            <div className="flex justify-between items-center text-gray-600"><span><LifeBuoy className="inline mr-2 h-5 w-5"/>Medical</span><span className="font-bold text-lg text-gray-800">108</span></div>
            <div className="flex justify-between items-center text-gray-600"><span><ShieldAlert className="inline mr-2 h-5 w-5"/>Security</span><span className="font-bold text-gray-800">+91-9876543210</span></div>
            <div className="flex justify-between items-center text-gray-600"><span><Info className="inline mr-2 h-5 w-5"/>Information</span><span className="font-bold text-gray-800">+91-9876543211</span></div>
        </div>
        <div className="mt-6 p-3 bg-red-50 text-red-700 rounded-lg text-center text-sm font-semibold">In case of emergency, call 108 immediately</div>
    </Widget>
);

const AccessibilityServices = () => (
     <Widget>
        <WidgetTitle icon={<Accessibility className="text-orange-500"/>} title="Accessibility Services" />
        <div className="mb-6"><h4 className="font-semibold text-gray-600">Priority Services Available</h4><ul className="list-disc list-inside text-sm text-gray-500 mt-2 space-y-1"><li>Wheelchair assistance and accessible routes</li><li>Priority queue for elderly and differently-abled</li><li>Dedicated parking spaces near entrances</li></ul></div>
        <form className="space-y-4"><h4 className="font-semibold text-gray-600 border-t pt-6">Request Assistance</h4><div><label className="text-sm font-medium text-gray-500">Full Name</label><input type="text" className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your name"/></div><div><label className="text-sm font-medium text-gray-500">Phone Number</label><input type="tel" className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your phone number"/></div><div><label className="text-sm font-medium text-gray-500">Type of Assistance Needed</label><select className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"><option>Wheelchair</option><option>Guide Assistance</option><option>Other</option></select></div><button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">Request Assistance</button></form>
    </Widget>
);

// --- PAGE COMPONENTS: The main layouts for each portal ---
const AdminDashboard = () => (
    <>
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6"><div><h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1><p className="text-gray-500 mt-1">Real-time temple management and crowd monitoring</p></div><div className="text-right mt-4 sm:mt-0"><div className="text-gray-500 text-sm">Current Visitors</div><div className="font-bold text-blue-600 text-2xl sm:text-3xl">12,450</div></div></div>
        <EmergencyAlerts />
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"><LiveDensityWidget /><ParkingManagement /><QueueStatus /><ShuttleTracker /></div>
            <div className="xl:col-span-1 h-[400px] md:h-auto"><ForecastChart /></div>
        </div>
    </>
);

const PilgrimPortal = () => (
     <>
        <div className="mb-8"><div className="flex items-center"><Users className="w-10 h-10 text-orange-500 mr-4"/><div><h1 className="text-3xl font-bold text-gray-800">Pilgrim Portal</h1><p className="text-gray-500 mt-1">Your digital companion for a smooth temple visit</p></div></div></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6"><DigitalDarshanPass/><AccessibilityServices/></div>
            <div className="lg:col-span-1 space-y-6"><TempleInformation/><EmergencyContacts/></div>
        </div>
    </>
);

// --- MAIN APP COMPONENT ---
// This is the root of your application. It controls the layout and which portal is visible.
export default function App() {
    const [activePortal, setActivePortal] = useState('admin'); // 'admin' or 'pilgrim'

    return (
        <div className="h-screen w-screen bg-gray-100 font-sans text-gray-800 flex flex-col overflow-hidden">
            <header className="h-20 bg-white border-b flex-shrink-0 flex items-center justify-between px-4 sm:px-8 z-10">
                <div className="flex items-center text-xl sm:text-2xl font-bold"><Building className="text-orange-500 h-6 w-6 sm:h-8 sm:w-8"/><span className="ml-3 hidden sm:inline">Smart Temple</span></div>
                <nav className="flex items-center space-x-1 bg-gray-100 p-1 rounded-full"><button onClick={() => setActivePortal('admin')} className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition ${activePortal === 'admin' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}>Admin Dashboard</button><button onClick={() => setActivePortal('pilgrim')} className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition ${activePortal === 'pilgrim' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}>Pilgrim Portal</button></nav>
                <div className="flex items-center space-x-2 sm:space-x-4"><div className="relative hidden md:block"><input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 text-sm border rounded-full focus:ring-2 focus:ring-blue-500 outline-none w-40 lg:w-64"/><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/></div><button className="bg-orange-500 text-white px-4 sm:px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition text-sm">Publish</button></div>
            </header>
            
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
                     {activePortal === 'admin' ? <AdminDashboard /> : <PilgrimPortal />}
                </div>
            </main>
        </div>
    );
}

