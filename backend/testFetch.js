const fetch = require('node-fetch');

async function test() {
    console.log("Testing API endpoint...");
    // Since we don't have a token, what happens if we just pass a random token?
    const response = await fetch('http://localhost:5000/api/practice/questions', {
        headers: {
            'Authorization': `Bearer fake_token_here`
        }
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log(data);
}

test();
