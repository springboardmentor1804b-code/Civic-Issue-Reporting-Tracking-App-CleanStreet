import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icons
const fixLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

const ReportIssue = () => {
  const [issueTitle, setIssueTitle] = useState('');
  const [briefDescription, setBriefDescription] = useState('');
  const [issueType, setIssueType] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('');
  const [address, setAddress] = useState('');
  const [nearbyLandmark, setNearbyLandmark] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [markerPosition, setMarkerPosition] = useState([20.5937, 78.9629]); // Default India coordinates
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const fileInputRef = useRef(null);

  const issueTypes = [
    'Pothole', 'Garbage Collection', 'Street Light', 
    'Water Leakage', 'Sewage Issue', 'Public Toilet', 
    'Park Maintenance', 'Others'
  ];

  const priorityLevels = ['Low', 'Medium', 'High', 'Urgent'];

  // Initialize Leaflet map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      fixLeafletIcons();
      
      // Create map instance
      const map = L.map(mapRef.current).setView(markerPosition, 13);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add initial marker
      markerRef.current = L.marker(markerPosition, {
        draggable: true
      }).addTo(map);

      // Handle map click to add marker
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], {
            draggable: true
          }).addTo(map);
        }
        
        // Get address from coordinates
        getAddressFromCoordinates(lat, lng);
      });

      // Handle marker drag end
      markerRef.current.on('dragend', (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        setMarkerPosition([position.lat, position.lng]);
        getAddressFromCoordinates(position.lat, position.lng);
      });

      mapInstanceRef.current = map;

      // Cleanup on unmount
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  // Update marker position when markerPosition changes
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng(markerPosition);
    }
  }, [markerPosition]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        const newPosition = [latitude, longitude];
        setMarkerPosition(newPosition);
        setIsGettingLocation(false);
        
        // Center map on user location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(newPosition, 15);
        }
        
        // Get address from coordinates
        getAddressFromCoordinates(latitude, longitude);
      },
      (error) => {
        setIsGettingLocation(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please allow location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.address) {
        const addressParts = [];
        if (data.address.road) addressParts.push(data.address.road);
        if (data.address.suburb) addressParts.push(data.address.suburb);
        if (data.address.city) addressParts.push(data.address.city);
        if (data.address.country) addressParts.push(data.address.country);
        
        setAddress(addressParts.join(', '));
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    
    // Validate file size and type
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        alert(`${file.name} is not a valid image type. Please upload JPEG, PNG, GIF, or WebP.`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      
      return true;
    });

    // Convert images to base64 for preview
    const imagePromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            url: e.target.result,
            file: file
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises)
      .then(newImages => {
        // Keep only the first image for the circular display
        setUploadedImages(prev => [...prev.slice(0, 0), ...newImages.slice(0, 1)]);
        setIsUploading(false);
        
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .catch(error => {
        console.error('Error uploading images:', error);
        setIsUploading(false);
        alert('Error uploading images. Please try again.');
      });
  };

  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create form data for submission
    const formData = new FormData();
    formData.append('issueTitle', issueTitle);
    formData.append('briefDescription', briefDescription);
    formData.append('issueType', issueType);
    formData.append('priorityLevel', priorityLevel);
    formData.append('address', address);
    formData.append('nearbyLandmark', nearbyLandmark);
    formData.append('detailedDescription', detailedDescription);
    formData.append('markerPosition', JSON.stringify(markerPosition));
    formData.append('userLocation', JSON.stringify(userLocation));
    
    // Append each image file
    uploadedImages.forEach((image, index) => {
      formData.append(`images[${index}]`, image.file);
    });

    console.log({
      issueTitle,
      briefDescription,
      issueType,
      priorityLevel,
      address,
      nearbyLandmark,
      detailedDescription,
      markerPosition,
      userLocation,
      uploadedImages: uploadedImages.length
    });
    
    alert(`Report submitted successfully! ${uploadedImages.length > 0 ? `(${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''} uploaded)` : ''}`);
  };

  // Updated styles with image upload on left side
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '20px auto',
      padding: '15px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#faf8f6',
      minHeight: 'calc(100vh - 40px)',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(160, 94, 46, 0.1)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '3px solid #a05e2e',
      background: 'linear-gradient(135deg, #f9f5f0, #f5f1eb)',
      borderRadius: '8px',
      padding: '20px',
      color: '#5c3d1f'
    },
    h1: {
      fontSize: '26px',
      marginBottom: '8px',
      marginTop: '0',
      fontWeight: '700',
      color: '#5c3d1f'
    },
    h3: {
      fontSize: '16px',
      fontWeight: '500',
      margin: '0',
      color: '#8a6d4b'
    },
    form: {
      display: 'flex',
      gap: '25px',
      marginBottom: '20px'
    },
    leftPanel: {
      flex: '2',
      background: 'linear-gradient(135deg, #ffffff, #fdfbf9)',
      borderRadius: '10px',
      padding: '25px',
      boxShadow: '0 3px 15px rgba(160, 94, 46, 0.08)',
      borderLeft: '8px solid #d4b896',
      display: 'flex',
      flexDirection: 'column',
      height: 'fit-content'
    },
    mainContent: {
      flex: '3',
      background: 'linear-gradient(135deg, #ffffff, #fdfbf9)',
      borderRadius: '10px',
      padding: '25px',
      boxShadow: '0 3px 15px rgba(160, 94, 46, 0.08)',
      borderLeft: '8px solid #a05e2e'
    },
    sectionTitle: {
      fontSize: '18px',
      color: '#5c3d1f',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #d4b896',
      marginTop: '0',
      fontWeight: '600',
      backgroundColor: 'rgba(212, 184, 150, 0.1)',
      padding: '12px',
      borderRadius: '6px',
      position: 'relative'
    },
    rowGroup: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '20px',
      flex: '1'
    },
    fullWidth: {
      width: '100%'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#7d5525',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '2px solid #d4b896',
      borderRadius: '6px',
      fontSize: '14px',
      transition: 'all 0.3s',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff',
      color: '#000000',
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      border: '2px solid #d4b896',
      borderRadius: '6px',
      fontSize: '14px',
      resize: 'vertical',
      minHeight: '80px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxSizing: 'border-box',
      backgroundColor: '#ffffff',
      color: '#000000'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      border: '2px solid #d4b896',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
      color: '#000000'
    },
    selectOption: {
      backgroundColor: '#ffffff',
      color: '#000000'
    },
    divider: {
      height: '2px',
      background: 'linear-gradient(to right, #d4b896, #a05e2e, #d4b896)',
      margin: '30px 0',
      borderRadius: '2px'
    },
    locationSection: {
      marginBottom: '25px',
      backgroundColor: 'rgba(212, 184, 150, 0.1)',
      padding: '15px',
      borderRadius: '8px',
      border: '1px solid #e8d9c5'
    },
    getLocationButton: {
      background: 'linear-gradient(135deg, #a05e2e, #8a5127)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      fontSize: '14px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontWeight: '600',
      boxShadow: '0 3px 10px rgba(160, 94, 46, 0.4)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '15px'
    },
    locationButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(160, 94, 46, 0.6)',
      background: 'linear-gradient(135deg, #8a5127, #a05e2e)'
    },
    locationInfo: {
      backgroundColor: '#f5f1eb',
      border: '1px solid #d4b896',
      borderRadius: '6px',
      padding: '12px',
      marginTop: '10px',
      fontSize: '14px',
      color: '#5c3d1f'
    },
    locationError: {
      backgroundColor: '#fdf2f2',
      border: '1px solid #f8b4b4',
      borderRadius: '6px',
      padding: '12px',
      marginTop: '10px',
      fontSize: '14px',
      color: '#9b1c1c'
    },
    mapContainer: {
      border: '2px solid #d4b896',
      borderRadius: '10px',
      padding: '20px',
      backgroundColor: '#f9f5f0',
      minHeight: '350px',
      position: 'relative',
      marginBottom: '20px',
      overflow: 'hidden'
    },
    mapArea: {
      position: 'relative',
      width: '100%',
      height: '400px',
      backgroundColor: '#f5f1eb',
      borderRadius: '6px',
      border: '2px solid #c8a27a',
      overflow: 'hidden'
    },
    mapInstruction: {
      textAlign: 'center',
      marginBottom: '15px',
      padding: '12px',
      backgroundColor: 'rgba(212, 184, 150, 0.2)',
      borderRadius: '6px',
      borderLeft: '3px solid #a05e2e',
      borderRight: '3px solid #a05e2e'
    },
    mapInstructionText: {
      color: '#5c3d1f',
      fontSize: '14px',
      margin: '0',
      fontWeight: '500'
    },
    mapFeatures: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginTop: '15px',
      flexWrap: 'wrap'
    },
    mapFeature: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: 'white',
      border: '1px solid #d4b896',
      borderRadius: '5px',
      fontSize: '12px',
      color: '#5c3d1f',
      boxShadow: '0 1px 3px rgba(212, 184, 150, 0.3)'
    },
    mapFeatureIcon: {
      fontSize: '14px',
      color: '#a05e2e'
    },
    uploadSection: {
      marginBottom: '20px'
    },
    imageCountBadge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#a05e2e',
      color: 'white',
      borderRadius: '50%',
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    },
    formActions: {
      textAlign: 'center',
      marginTop: '25px',
      paddingTop: '20px',
      borderTop: '2px solid #e8d9c5'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #a05e2e, #8a5127)',
      color: 'white',
      border: 'none',
      padding: '12px 40px',
      fontSize: '16px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontWeight: '600',
      boxShadow: '0 3px 10px rgba(160, 94, 46, 0.4)'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(160, 94, 46, 0.6)',
      background: 'linear-gradient(135deg, #8a5127, #a05e2e)'
    },
    backLink: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#a05e2e',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'all 0.2s',
      fontWeight: '500',
      display: 'block',
      padding: '8px 16px',
      backgroundColor: 'rgba(212, 184, 150, 0.1)',
      borderRadius: '6px',
      border: '1px solid #d4b896'
    },
    backLinkHover: {
      color: '#8a5127',
      textDecoration: 'none',
      backgroundColor: 'rgba(212, 184, 150, 0.2)',
      borderColor: '#a05e2e',
      transform: 'translateY(-1px)'
    },
    progressRing: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      border: '3px solid transparent',
      borderTopColor: '#a05e2e',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  // Add CSS animation for loading spinner
  const animationStyles = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Handle input focus
  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#a05e2e';
    e.target.style.boxShadow = '0 0 0 3px rgba(160, 94, 46, 0.2)';
    e.target.style.backgroundColor = '#ffffff';
    e.target.style.color = '#000000';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#d4b896';
    e.target.style.boxShadow = 'none';
    e.target.style.backgroundColor = '#ffffff';
    e.target.style.color = '#000000';
  };

  // Handle input change to ensure black text
  const handleInputChange = (e, setterFunction) => {
    e.target.style.color = '#000000';
    setterFunction(e.target.value);
  };

  // Handle select change to ensure black text
  const handleSelectChange = (e, setterFunction) => {
    e.target.style.color = '#000000';
    setterFunction(e.target.value);
  };

  return (
    <div style={styles.container}>
      <style>{animationStyles}</style>
      
      <header style={styles.header}>
        <h1 style={styles.h1}>Complaint Submission Page</h1>
        <h3 style={styles.h3}>Report A Civic Issue</h3>
      </header>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Left Panel - Image Upload */}
        <div style={styles.leftPanel}>
          <div style={styles.uploadSection}>
            <h4 style={styles.sectionTitle}>
              Upload Image
              {uploadedImages.length > 0 && (
                <span style={styles.imageCountBadge}>
                  {uploadedImages.length}
                </span>
              )}
            </h4>
            
            {/* Simple circular upload area */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  backgroundColor: uploadedImages.length > 0 ? 'transparent' : 'rgba(212, 184, 150, 0.2)',
                  border: uploadedImages.length > 0 ? 'none' : '3px dashed #d4b896',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  marginBottom: '20px',
                  position: 'relative',
                  transition: 'all 0.3s'
                }}
                onClick={() => fileInputRef.current.click()}
                onMouseEnter={(e) => {
                  if (uploadedImages.length === 0) {
                    e.currentTarget.style.borderColor = '#a05e2e';
                    e.currentTarget.style.backgroundColor = 'rgba(212, 184, 150, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (uploadedImages.length === 0) {
                    e.currentTarget.style.borderColor = '#d4b896';
                    e.currentTarget.style.backgroundColor = 'rgba(212, 184, 150, 0.2)';
                  }
                }}
              >
                {uploadedImages.length > 0 ? (
                  <>
                    <img 
                      src={uploadedImages[0].url} 
                      alt="Preview" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(160, 94, 46, 0.9)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        zIndex: 10
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(uploadedImages[0].id);
                      }}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8a6d4b'
                  }}>
                    <div style={{
                      fontSize: '60px',
                      marginBottom: '10px'
                    }}>
                      📸
                    </div>
                    <div style={{
                      fontSize: '16px',
                      textAlign: 'center',
                      padding: '0 15px',
                      fontWeight: '500'
                    }}>
                      Click to upload image
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{
                fontSize: '14px',
                color: '#7d5525',
                textAlign: 'center',
                marginBottom: '15px',
                lineHeight: '1.5'
              }}>
                {uploadedImages.length > 0 
                  ? `Image uploaded successfully` 
                  : 'Upload a clear photo showing the issue'}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          
        </div>

        {/* Main Content - Right Side */}
        <div style={styles.mainContent}>
          <div style={styles.formSection}>
            <h4 style={styles.sectionTitle}>Issue Details</h4>
            
            <div style={styles.rowGroup}>
              <div style={styles.formGroup}>
                <label htmlFor="issueTitle" style={styles.label}>Issue Title</label>
                <input
                  type="text"
                  id="issueTitle"
                  value={issueTitle}
                  onChange={(e) => handleInputChange(e, setIssueTitle)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Enter issue title"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="issueType" style={styles.label}>Issue Type</label>
                <select
                  id="issueType"
                  value={issueType}
                  onChange={(e) => handleSelectChange(e, setIssueType)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                  style={styles.select}
                >
                  <option value="">Select Issue Type</option>
                  {issueTypes.map((type, index) => (
                    <option key={index} value={type} style={styles.selectOption}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label htmlFor="briefDescription" style={styles.label}>Brief Description Of The Issue</label>
              <textarea
                id="briefDescription"
                value={briefDescription}
                onChange={(e) => handleInputChange(e, setBriefDescription)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Brief description of the issue"
                rows="3"
                required
                style={styles.textarea}
              />
            </div>

            <div style={styles.rowGroup}>
              <div style={styles.formGroup}>
                <label htmlFor="priorityLevel" style={styles.label}>Priority Level</label>
                <select
                  id="priorityLevel"
                  value={priorityLevel}
                  onChange={(e) => handleSelectChange(e, setPriorityLevel)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                  style={styles.select}
                >
                  <option value="">Select Priority</option>
                  {priorityLevels.map((priority, index) => (
                    <option key={index} value={priority} style={styles.selectOption}>{priority}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="address" style={styles.label}>Address</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => handleInputChange(e, setAddress)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Enter Street Address"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label htmlFor="nearbyLandmark" style={styles.label}>Nearby Landmark (Optional)</label>
              <input
                type="text"
                id="nearbyLandmark"
                value={nearbyLandmark}
                onChange={(e) => handleInputChange(e, setNearbyLandmark)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="e.g., near city hall"
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label htmlFor="detailedDescription" style={styles.label}>Description</label>
              <textarea
                id="detailedDescription"
                value={detailedDescription}
                onChange={(e) => handleInputChange(e, setDetailedDescription)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Describe The Issue in Detail..."
                rows="4"
                required
                style={styles.textarea}
              />
            </div>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.mapSection}>
            <h4 style={styles.sectionTitle}>Location On Map</h4>
            
            <div style={styles.locationSection}>
              <button
                type="button"
                style={styles.getLocationButton}
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                onMouseOver={(e) => !isGettingLocation && Object.assign(e.target.style, styles.locationButtonHover)}
                onMouseOut={(e) => {
                  if (!isGettingLocation) {
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = '0 3px 10px rgba(160, 94, 46, 0.4)';
                    e.target.style.background = 'linear-gradient(135deg, #a05e2e, #8a5127)';
                  }
                }}
              >
                {isGettingLocation ? '📍 Getting Location...' : '📍 Get My Current Location'}
              </button>
              
              {userLocation && (
                <div style={styles.locationInfo}>
                  <strong>📍 Your Location:</strong> 
                  Lat: {userLocation.latitude.toFixed(6)}, 
                  Lng: {userLocation.longitude.toFixed(6)}
                  {address && ` | Address: ${address}`}
                </div>
              )}
              
              {locationError && (
                <div style={styles.locationError}>
                  <strong>⚠️ Error:</strong> {locationError}
                </div>
              )}
            </div>

            <div style={styles.mapContainer}>
              <div style={styles.mapInstruction}>
                <p style={styles.mapInstructionText}>
                  Click on the map to mark the exact location of the issue. Drag the marker to adjust position.
                </p>
              </div>

              <div 
                ref={mapRef}
                style={styles.mapArea}
              />
              
              <div style={styles.mapFeatures}>
                <div style={styles.mapFeature}>
                  <span style={styles.mapFeatureIcon}>📍</span>
                  <span>Click map to place marker</span>
                </div>
                <div style={styles.mapFeature}>
                  <span style={styles.mapFeatureIcon}>👆</span>
                  <span>Drag marker to adjust</span>
                </div>
                <div style={styles.mapFeature}>
                  <span style={styles.mapFeatureIcon}>🗺️</span>
                  <span>Scroll to zoom in/out</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.formActions}>
            <button 
              type="submit" 
              style={styles.submitButton}
              onMouseOver={(e) => Object.assign(e.target.style, styles.submitButtonHover)}
              onMouseOut={(e) => {
                e.target.style.transform = 'none';
                e.target.style.boxShadow = '0 3px 10px rgba(160, 94, 46, 0.4)';
                e.target.style.background = 'linear-gradient(135deg, #a05e2e, #8a5127)';
              }}
            >
              Submit Report
            </button>
          </div>
        </div>
      </form>

      <a 
        href="/" 
        style={styles.backLink}
        onMouseOver={(e) => Object.assign(e.target.style, styles.backLinkHover)}
        onMouseOut={(e) => {
          e.target.style.color = '#a05e2e';
          e.target.style.textDecoration = 'none';
          e.target.style.backgroundColor = 'rgba(212, 184, 150, 0.1)';
          e.target.style.borderColor = '#d4b896';
          e.target.style.transform = 'none';
        }}
      >
        ← Back to Home
      </a>
    </div>
  );
};

export default ReportIssue;