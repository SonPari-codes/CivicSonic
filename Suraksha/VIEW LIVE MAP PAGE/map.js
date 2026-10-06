document.addEventListener('DOMContentLoaded', () => {
    // Toggle mobile menu if hamburger button is clicked[cite: 1]
    document.querySelector('.hamburger-btn')?.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
    });
    // 1. Initialize the map and set default view strictly to the MIET Campus[cite: 1]
    const map = L.map('liveMap').setView([28.9730, 77.6400], 16);

    // 2. Load the OpenStreetMap tiles[cite: 1]
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // 3. Fetch the strict GeoJSON payload from your FastAPI backend[cite: 1, 8]
    fetch('http://127.0.0.1:8000/crimes/')
        .then(response => response.json())
        .then(data => {
            // 4. Plot the points dynamically on the map[cite: 4]
            L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    // Create an interactive popup reading the native priority field[cite: 1, 4]
                    const popupContent = `
                        <div style="font-family: sans-serif;">
                            <h3 style="margin-bottom: 5px;">${feature.properties.crime_type}</h3>
                            <strong style="color: #e74c3c;">Priority: ${feature.properties.priority}</strong>
                            <p style="margin-top: 5px;">${feature.properties.description}</p>
                        </div>
                    `;
                    layer.bindPopup(popupContent);
                }
            }).addTo(map);
        })
        .catch(error => console.error('Error loading crime data:', error));
});