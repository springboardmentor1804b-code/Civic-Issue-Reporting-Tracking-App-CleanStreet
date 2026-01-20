const axios = require('axios');

async function reverseGeocode(lat, lng) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'CivicTrackingApp/1.0',
      },
    });

    const data = response.data;
    const city = data.address?.city || data.address?.town || data.address?.village || null;
    const state = data.address?.state || null;

    return { city, state };
  } catch (error) {
    console.error('Reverse geocoding failed:', error.message);
    return { city: null, state: null };
  }
}

async function forwardGeocode(city) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: city,
        format: 'json',
        limit: 1,
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'CivicTrackingApp/1.0',
      },
    });

    if (response.data.length > 0) {
      const data = response.data[0];
      const latitude = parseFloat(data.lat);
      const longitude = parseFloat(data.lon);
      const state = data.address?.state || null;

      return { latitude, longitude, state };
    } else {
      throw new Error('City not found');
    }
  } catch (error) {
    console.error('Forward geocoding failed:', error.message);
    throw error;
  }
}

module.exports = { reverseGeocode, forwardGeocode };
