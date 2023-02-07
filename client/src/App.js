import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
const [userData, setUserData] = useState([]);
const [error, setError] = useState('');

const fetchData = async () => {
try {
const response = await axios.get(`http://localhost:5000/user`);
console.log(response.data)
setUserData(response.data);
} catch (err) {
console.log(err);
setError('Error loading data. Please try again later.');
}
};

useEffect(() => {
fetchData();
}, []);

return (
<>
<div>
    {userData.length > 0 ? <h1>{userData[0]._id}: {userData[0].empname} {userData[0].role}</h1>: <p></p> }
    </div>
</>
);
}