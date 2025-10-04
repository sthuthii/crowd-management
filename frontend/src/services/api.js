const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 1. For the Admin: Emergency & Safety Alerts
export async function getEmergencyAlerts() {
    await sleep(300);
    return [
        { time: "14:32", message: "High crowd density detected in Zone A", type: "high" },
        { time: "14:28", message: "Parking Level 1 at 95% capacity", type: "medium" },
        { time: "14:25", message: "All systems operating normally", type: "low" },
    ];
}

// 2. For the Admin: Live Crowd Density Map
export async function getLiveDensity() {
    await sleep(400);
    return [
        { id: 'main_temple', name: 'Main Temple', visitors: random(3000, 3400), status: 'high' },
        { id: 'queue_area', name: 'Queue Area', visitors: random(2600, 3000), status: 'medium' },
        { id: 'parking', name: 'Parking', visitors: random(1300, 1700), status: 'low' },
        { id: 'food_court', name: 'Food Court', visitors: random(1000, 1400), status: 'medium' }
    ];
}

// 3. For the Admin: Crowd Forecast vs Reality Chart
export async function getForecastChart() {
    await sleep(600);
    return {
        labels: ["6:00", "8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
        predicted: [4000, 6500, 9000, 12500, 11000, 9500, 6000, 3000],
        actual: [3800, 6200, 8800, 12800, 11500, 9800, null, null], // Null for future times
        maxCapacity: 15000
    };
}

// 4. For the Admin: Parking Management
export async function getParking() {
    await sleep(350);
    return {
        recommendedLevel: "Basement 2",
        levels: [
            { name: "Ground Floor", occupied: 180, total: 200 },
            { name: "Basement 1", occupied: 295, total: 300 },
            { name: "Basement 2", occupied: 120, total: 350 },
            { name: "Basement 3", occupied: 45, total: 250 },
        ]
    };
}

// 5. For both Portals: Queue Status
export async function getQueues() {
    await sleep(450);
    return [
        { name: "General Darshan", waitTime: random(20, 30), status: "normal" },
        { name: "VIP Pass", waitTime: random(5, 10), status: "low" },
        { name: "Prasad Counter", waitTime: random(40, 50), status: "high" },
        { name: "Special Services", waitTime: random(10, 15), status: "normal" },
    ];
}

// 6. For the Admin: Shuttle Tracker
export async function getShuttles() {
    await sleep(500);
    return [
        { id: "Bus #1", status: "Active", details: "En route to Gate 2" },
        { id: "Bus #2", status: "Loading", details: "At Parking Level B1" },
        { id: "Bus #3", status: "Offline", details: "Maintenance" },
    ];
}

// 7. For the Pilgrim Portal: Temple Information
export async function getTempleInfo() {
    await sleep(200);
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
}
