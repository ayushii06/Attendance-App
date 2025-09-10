// import React, { useState } from 'react';

// const Geolocation = () => {
//     const [location, setLocation] = useState({ latitude: null, longitude: null });
//     const [error, setError] = useState(null);

//     const getLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     setLocation({
//                         latitude: position.coords.latitude,
//                         longitude: position.coords.longitude,
//                     });
//                     sendCoordinatesToServer(position.coords.latitude, position.coords.longitude);
//                 },
//                 (err) => {
//                     setError(err.message);
//                 }
//             );
//         } else {
//             setError("Geolocation is not supported by your browser.");
//         }
//     };

//     const sendCoordinatesToServer = async (latitude, longitude) => {
//         try {
//             const response = await fetch('/api/location', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ latitude, longitude }),
//             });

//             const data = await response.json();
//             console.log('Server Response:', data);
//         } catch (err) {
//             console.error('Error sending coordinates to server:', err);
//         }
//     };

//     return (
//         <div>
//             <button onClick={getLocation}>Get My Location</button>
//             {location.latitude && location.longitude && (
//                 <p>
//                     Latitude: {location.latitude}, Longitude: {location.longitude}
//                 </p>
//             )}
//             {error && <p style={{ color: 'red' }}>{error}</p>}
            
//         </div>
//     );
// };

// export default Geolocation;
