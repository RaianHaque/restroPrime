const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'restroPrime.html'));
});

// Helper functions to read/write data.json
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return { users: [], bookings: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// User Signup
app.post('/api/signup', (req, res) => {
    const { fname, lname, email, phone, pass } = req.body;

    if (!fname || !lname || !email || !phone || !pass) {
        return res.status(400).json({ error: 'All fields required' });
    }

    const data = readData();

    // Check for duplicate email or phone
    if (data.users.some(u => u.email === email || u.phone === phone)) {
        return res.status(400).json({ error: 'Email or Phone already registered!' });
    }

    // Add new user
    data.users.push({ fname, lname, email, phone, pass });
    writeData(data);

    res.json({ message: 'Registration Successful!' });
});

// User Login
app.post('/api/login', (req, res) => {
    const { identifier, pass, isAdmin } = req.body;

    const data = readData();
    
    if (isAdmin) {
        // Check admin credentials
        const admin = data.admins && data.admins.find(a => a.username === identifier && a.pass === pass);
        if (admin) {
            res.json({ success: true, user: { name: admin.username, role: 'admin' } });
        } else {
            res.status(401).json({ success: false, error: 'Invalid Admin Username or Password' });
        }
    } else {
        // Check user credentials
        const user = data.users.find(u => (u.email === identifier || u.phone === identifier) && u.pass === pass);
        if (user) {
            res.json({ success: true, user: { ...user, role: 'user' } });
        } else {
            res.status(401).json({ success: false, error: 'Invalid Email/Phone or Password' });
        }
    }
});

// Admin Signup
app.post('/api/admin-signup', (req, res) => {
    const { username, pass, masterCode } = req.body;

    if (masterCode !== 'RaianHaque') {
        return res.status(400).json({ error: 'Invalid Master Code!' });
    }

    if (!username || !pass) {
        return res.status(400).json({ error: 'Username and Password required' });
    }

    const data = readData();
    if (!data.admins) data.admins = [];

    // Check if admin already exists
    if (data.admins.some(a => a.username === username)) {
        return res.status(400).json({ error: 'Admin username already exists!' });
    }

    // Add new admin
    data.admins.push({ username, pass });
    writeData(data);

    res.json({ message: 'Admin Registration Successful!' });
});

// Get all users (for admin)
app.get('/api/users', (req, res) => {
    const data = readData();
    res.json(data.users);
});

// Table Bookings
app.post('/api/bookings', (req, res) => {
    const { tableId } = req.body;

    const data = readData();
    if (!data.bookings.includes(tableId)) {
        data.bookings.push(tableId);
        writeData(data);
        res.json({ message: 'Table booked successfully!' });
    } else {
        res.status(400).json({ error: 'Table already booked' });
    }
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
    const data = readData();
    res.json(data.bookings);
});

// Release booking
app.delete('/api/bookings/:tableId', (req, res) => {
    const tableId = parseInt(req.params.tableId);

    const data = readData();
    data.bookings = data.bookings.filter(id => id !== tableId);
    writeData(data);

    res.json({ message: 'Table released successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
