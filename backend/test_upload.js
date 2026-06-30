const fs = require('fs');
async function test() {
    const formData = new FormData();
    formData.append('image', new Blob([fs.readFileSync('test.jpg')]), 'test.jpg');
    formData.append('issueType', 'Pothole / Road Damage');
    formData.append('description', 'A large pothole on Main St.');
    formData.append('severity', 'Critical');
    formData.append('location', 'Main St. Intersection');

    const res = await fetch('http://localhost:5000/api/issues/create', {
        method: 'POST',
        body: formData
    });
    console.log(await res.json());
}
test();
