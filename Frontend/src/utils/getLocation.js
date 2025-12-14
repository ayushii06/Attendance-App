export default function getCoords() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (err) => {
                    reject(err.message);
                }
            );
        } else {
            reject("Geolocation is not supported by your browser.");
        }
    });
}
