import React, { useState, useEffect } from 'react';
import axios from "axios";

import './app.css';

export default function App() {

  const [username, setUsername] = useState(null);

  useEffect(() => {
    axios.get('/api/username')
      .then(res => setUsername(res.data));
  }, []);

  return (
    <div>
      {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
    </div>
  );
}
