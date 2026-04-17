const axios = require('axios');
require('dotenv').config();

async function testFetch() {
    try {
        // Need a token
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'maira210507@gmail.com',
            password: 'password123'
        });
        
        const token = loginRes.data.token;
        console.log('Login successful, token obtained.');
        
        const res = await axios.get('http://localhost:5000/api/practice/questions?limit=50', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('Response status:', res.status);
        console.log('Response count:', res.data.count);
        console.log('Number of items in data:', res.data.data.length);
        
        const types = res.data.data.reduce((acc, q) => {
            acc[q.type] = (acc[q.type] || 0) + 1;
            return acc;
        }, {});
        
        console.log('Types returned in API:', types);
        
    } catch (error) {
        console.error('Fetch failed:', error.response ? error.response.data : error.message);
    }
}

testFetch();
