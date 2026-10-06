document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ Script loaded successfully!");

  const form = document.getElementById('reportForm');
  const fileInput = document.getElementById('evidence');
  const fileLabel = document.getElementById('fileLabel');
  const currentLocationBtn = document.getElementById('currentLocationBtn');
  const locationTitle = document.getElementById('locationTitle');
  const locationStatus = document.getElementById('locationStatus');
  const locationValue = document.getElementById('locationValue');
  const cancelBtn = document.getElementById('cancelBtn');
  const chooseMapBtn = document.getElementById('chooseMapBtn');
  const successModal = document.getElementById('successModal');
  const backHomeBtn = document.getElementById('backHomeBtn');

  // Variables to hold the coordinates for the backend
  let currentLat = null;
  let currentLng = null;
  let mapMarker = null;

  document.querySelector('.hamburger-btn')?.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    fileLabel.textContent = file ? file.name : 'Upload attachment here...';
    fileLabel.classList.toggle('selected', !!file);
  });

  // 🗺️ 1. INITIALIZE THE LEAFLET MAP
  // Set default view exactly to MIET Campus, Meerut[cite: 3, 6]
  const reportMap = L.map('interactiveMap').setView([28.9730, 77.6400], 16);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(reportMap);

  // Fix map sizing quirks when loading inside flexbox/hidden containers
  setTimeout(() => { reportMap.invalidateSize(); }, 500);

  // 📍 HELPER: Update coordinates, text, and map marker
  function setLocation(lat, lng, methodText) {
    currentLat = lat;
    currentLng = lng;
    
    locationTitle.textContent = 'Location Selected';
    locationStatus.textContent = methodText;
    locationValue.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    locationStatus.style.color = 'inherit';

    // If marker doesn't exist, create it. Otherwise, move it.
    if (!mapMarker) {
      mapMarker = L.marker([lat, lng], { draggable: true }).addTo(reportMap);
      
      // Update coordinates if the user drags the pin around
      mapMarker.on('dragend', function () {
        const position = mapMarker.getLatLng();
        setLocation(position.lat, position.lng, 'Pinned manually on map');
      });
    } else {
      mapMarker.setLatLng([lat, lng]);
    }
    
    // Smoothly pan the map to center the new pin
    reportMap.setView([lat, lng], 16);
  }

  // 🗺️ 2. MAP CLICK EVENT
  reportMap.on('click', function(e) {
    setLocation(e.latlng.lat, e.latlng.lng, 'Pinned manually on map');
  });

  // 🗺️ 3. "CHOOSE ON MAP" BUTTON
  chooseMapBtn.addEventListener('click', () => {
    // Scroll the map into view and prompt the user to tap it
    document.getElementById('interactiveMap').scrollIntoView({ behavior: 'smooth', block: 'center' });
    locationStatus.textContent = 'Tap anywhere on the map below to drop a pin';
    locationStatus.style.color = '#e74c3c'; // Highlight the instruction in red
  });

  // 📡 4. AUTO-DETECT LOCATION BUTTON
  currentLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      locationStatus.textContent = 'Location is not supported by this browser';
      return;
    }
    locationTitle.textContent = 'Getting your current location...';
    locationStatus.textContent = 'Please allow location access';
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // This leverages the map helper to instantly drop a pin on their physical location!
        setLocation(position.coords.latitude, position.coords.longitude, 'Location detected automatically');
      },
      () => {
        locationTitle.textContent = 'Location Error';
        locationStatus.textContent = 'Permission denied. Please tap the map to drop a pin.';
        locationValue.textContent = 'Unknown';
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  // ❌ 5. CANCEL BUTTON
  cancelBtn.addEventListener('click', () => {
    form.reset();
    fileLabel.textContent = 'Upload attachment here...';
    fileLabel.classList.remove('selected');
    
    locationTitle.textContent = 'Choose my current location';
    locationStatus.textContent = 'Location detected automatically';
    locationValue.textContent = 'Automatically detected';
    
    currentLat = null;
    currentLng = null;
    
    if (mapMarker) {
      reportMap.removeLayer(mapMarker);
      mapMarker = null;
    }
    
    // Reset view back to MIET
    reportMap.setView([28.9730, 77.6400], 16);
    
    window.location.href = '../HOME PAGE/index.html';
  });

  // 🚀 6. SUBMIT TO FASTAPI
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    if (!currentLat || !currentLng) {
      alert("Please tap the map to drop a pin or click auto-detect before submitting.");
      return;
    }

    const priorityElement = document.querySelector('input[name="priority"]:checked');
    const selectedPriority = priorityElement ? priorityElement.value : "None";

    const payload = {
      crime_type: document.getElementById('incidentType').value,
      priority: selectedPriority,
      description: document.getElementById('description').value,
      latitude: currentLat,
      longitude: currentLng
    };
    
    try {
      const response = await fetch('http://127.0.0.1:8000/crime/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        successModal.classList.add('show');
        successModal.setAttribute('aria-hidden', 'false');
      } else {
        alert("Failed to report incident. Check terminal for FastAPI errors.");
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      alert("Error connecting to the server. Is Uvicorn running?");
    }
  });

  backHomeBtn.addEventListener('click', () => {
    window.location.href = '../HOME PAGE/index.html';
  });
});