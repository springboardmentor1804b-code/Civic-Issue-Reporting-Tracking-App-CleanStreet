import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSettings = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  
  // Get user data from localStorage or use defaults
  const getUserData = () => {
    const email = localStorage.getItem('userEmail') || '';
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';
    
    return {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: localStorage.getItem('userPhone') || '',
      location: localStorage.getItem('userLocation') || '',
      website: localStorage.getItem('userWebsite') || '',
      bio: localStorage.getItem('userBio') || '',
    };
  };

  const [formData, setFormData] = useState(getUserData());
  const [activeTab, setActiveTab] = useState('Profile Settings');
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setShowSidebar(window.innerWidth > 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setFormData(getUserData());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    Object.keys(formData).forEach(key => {
      localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, formData[key]);
    });
    
    console.log('Profile saved:', formData);
    alert('Profile saved successfully!');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      setFormData(getUserData());
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      if (setIsLoggedIn) {
        setIsLoggedIn(false);
      }
      navigate('/login');
    }
  };

  const getUserInitials = () => {
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
  };

  const tabs = ['Profile Settings', 'Account Settings', 'Security', 'Notifications'];

  // Inline Styles - Responsive design
  const styles = {
    container: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
      backgroundColor: "#faf8f6",
      minHeight: "100vh",
      padding: "0",
    },
    layout: {
      display: "flex",
      minHeight: "100vh",
      flexDirection: isMobile ? "column" : "row",
    },
    
    // Mobile Header Styles
    mobileHeader: {
      display: isMobile ? "flex" : "none",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 20px",
      backgroundColor: "#a05e2e",
      color: "white",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    mobileMenuButton: {
      backgroundColor: "transparent",
      border: "none",
      color: "white",
      fontSize: "20px",
      cursor: "pointer",
      padding: "5px 10px",
      borderRadius: "4px",
    },
    mobileTitle: {
      fontSize: "18px",
      fontWeight: "600",
      margin: 0,
    },
    mobileUserInitials: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: "600",
    },
    
    // Sidebar Styles
    sidebar: {
      width: isMobile ? (showSidebar ? "100%" : "0") : "280px",
      backgroundColor: "#ffffff",
      padding: isMobile ? "20px" : "30px 20px",
      borderRight: "1px solid #e0e0e0",
      boxShadow: isMobile ? "none" : "2px 0 5px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
      overflow: "hidden",
      position: isMobile ? "fixed" : "relative",
      top: isMobile ? "66px" : "0",
      left: isMobile ? (showSidebar ? "0" : "-100%") : "0",
      height: isMobile ? "calc(100vh - 66px)" : "auto",
      zIndex: 99,
    },
    sidebarOverlay: {
      display: isMobile && showSidebar ? "block" : "none",
      position: "fixed",
      top: "66px",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 98,
    },
    sidebarTitle: {
      fontSize: isMobile ? "18px" : "20px",
      fontWeight: "600",
      color: "#a05e2e",
      margin: "0 0 20px 0",
      paddingBottom: "15px",
      borderBottom: "1px solid #eaeaea",
    },
    userInfo: {
      display: "flex",
      flexDirection: isMobile ? "row" : "column",
      alignItems: isMobile ? "center" : "center",
      marginBottom: "30px",
      textAlign: isMobile ? "left" : "center",
      gap: isMobile ? "15px" : "0",
    },
    avatar: {
      width: isMobile ? "60px" : "80px",
      height: isMobile ? "60px" : "80px",
      borderRadius: "50%",
      backgroundColor: "#a05e2e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: isMobile ? "18px" : "24px",
      fontWeight: "600",
      marginBottom: isMobile ? "0" : "15px",
      flexShrink: 0,
    },
    userName: {
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: "600",
      color: "#a05e2e",
      margin: "0 0 5px 0",
    },
    userEmail: {
      fontSize: isMobile ? "12px" : "14px",
      color: "#666",
      margin: "0",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    tabsContainer: {
      marginBottom: "20px",
    },
    tabButton: {
      width: "100%",
      padding: isMobile ? "10px 12px" : "12px 15px",
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: "500",
      color: "#666",
      backgroundColor: "transparent",
      border: "none",
      borderLeft: "3px solid transparent",
      cursor: "pointer",
      textAlign: "left",
      marginBottom: "5px",
      borderRadius: "0 4px 4px 0",
      transition: "all 0.2s",
    },
    activeTabButton: {
      backgroundColor: "#f8f1eb",
      color: "#a05e2e",
      borderLeft: "3px solid #a05e2e",
      fontWeight: "600",
    },
    logoutButton: {
      width: "100%",
      padding: isMobile ? "10px 12px" : "12px 15px",
      backgroundColor: "#a05e2e",
      color: "white",
      border: "1px solid #8a4f26",
      borderRadius: "4px",
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      marginTop: "20px",
    },
    
    // Main Content Styles
    mainContent: {
      flex: 1,
      padding: isMobile ? "20px 15px" : "40px",
      backgroundColor: "#faf8f6",
      width: isMobile ? "100%" : "auto",
    },
    contentCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      padding: isMobile ? "20px" : "40px",
      maxWidth: "900px",
      margin: "0 auto",
    },
    header: {
      marginBottom: isMobile ? "25px" : "40px",
      paddingBottom: isMobile ? "15px" : "20px",
      borderBottom: "1px solid #eaeaea",
    },
    title: {
      fontSize: isMobile ? "22px" : "28px",
      fontWeight: "600",
      color: "#333",
      margin: "0 0 5px 0",
    },
    subtitle: {
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: "500",
      color: "#555",
      margin: "0",
    },
    subtitleDescription: {
      display: "block",
      fontSize: isMobile ? "12px" : "14px",
      fontWeight: "400",
      color: "#777",
      marginTop: "5px",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "20px" : "30px",
    },
    photoSection: {
      marginBottom: "15px",
    },
    photoLabel: {
      fontSize: isMobile ? "15px" : "16px",
      fontWeight: "500",
      color: "#333",
      marginBottom: "5px",
    },
    photoDescription: {
      fontSize: isMobile ? "12px" : "14px",
      color: "#777",
      margin: "0 0 10px 0",
    },
    photoUploadArea: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "15px" : "20px",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
    },
    photoPlaceholder: {
      width: isMobile ? "80px" : "100px",
      height: isMobile ? "80px" : "100px",
      borderRadius: "50%",
      backgroundColor: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "2px dashed #ccc",
    },
    cameraIcon: {
      fontSize: isMobile ? "24px" : "32px",
      opacity: "0.6",
    },
    uploadButton: {
      padding: isMobile ? "8px 16px" : "10px 20px",
      backgroundColor: "#f0f0f0",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: "500",
      color: "#333",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "15px" : "20px",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? "15px" : "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    fullWidth: {
      gridColumn: isMobile ? "1 / span 1" : "1 / span 2",
    },
    formLabel: {
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: "500",
      color: "#666",
      marginBottom: "6px",
    },
    required: {
      color: "#e74c3c",
      marginLeft: "2px",
    },
    fieldDescription: {
      fontSize: isMobile ? "11px" : "12px",
      color: "#777",
      margin: "0 0 6px 0",
    },
    formInput: {
      padding: isMobile ? "8px 10px" : "10px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: isMobile ? "14px" : "14px",
      color: "#333",
      backgroundColor: "white",
      transition: "border-color 0.2s",
      width: "100%",
    },
    formTextarea: {
      padding: isMobile ? "8px 10px" : "10px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: isMobile ? "14px" : "14px",
      color: "#333",
      fontFamily: "inherit",
      backgroundColor: "white",
      resize: "vertical",
      transition: "border-color 0.2s",
      width: "100%",
    },
    charCount: {
      fontSize: isMobile ? "11px" : "12px",
      color: "#777",
      textAlign: "right",
      marginTop: "5px",
    },
    formActions: {
      display: "flex",
      gap: isMobile ? "10px" : "15px",
      marginTop: "20px",
      paddingTop: "20px",
      borderTop: "1px solid #eaeaea",
      flexDirection: isMobile ? "column" : "row",
    },
    saveButton: {
      padding: isMobile ? "10px 20px" : "12px 24px",
      backgroundColor: "#a05e2e",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: isMobile ? "14px" : "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      width: isMobile ? "100%" : "auto",
    },
    cancelButton: {
      padding: isMobile ? "10px 20px" : "12px 24px",
      backgroundColor: "#f8f9fa",
      color: "#333",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: isMobile ? "14px" : "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      width: isMobile ? "100%" : "auto",
    },
  };

  // Tab content rendering
  const renderTabContent = () => {
    switch(activeTab) {
      case 'Profile Settings':
        return (
          <div style={styles.content}>
            {/* Profile Photo Section */}
            <div style={styles.photoSection}>
              <div style={styles.photoLabel}>Profile Photo</div>
              <p style={styles.photoDescription}>Upload a new profile photo</p>
              <div style={styles.photoUploadArea}>
                <div style={styles.photoPlaceholder}>
                  <div style={styles.cameraIcon}>📷</div>
                </div>
                <button 
                  style={styles.uploadButton}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e8e8e8"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = "#e8e8e8"}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                >
                  Upload Profile
                </button>
              </div>
            </div>

            {/* Form Section */}
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="firstName" style={styles.formLabel}>
                    First Name<span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={styles.formInput}
                    onFocus={(e) => e.target.style.borderColor = "#a05e2e"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="lastName" style={styles.formLabel}>
                    Last Name<span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={styles.formInput}
                    onFocus={(e) => e.target.style.borderColor = "#a05e2e"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                    required
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.formLabel}>
                    Email Address<span style={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.formInput}
                    onFocus={(e) => e.target.style.borderColor = "#a05e2e"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="phone" style={styles.formLabel}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={styles.formInput}
                    onFocus={(e) => e.target.style.borderColor = "#a05e2e"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="location" style={styles.formLabel}>
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    style={styles.formInput}
                    onFocus={(e) => e.target.style.borderColor = "#a05e2e"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="website" style={styles.formLabel}>
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    style={styles.formInput}
                    onFocus={(e) => e.target.style.borderColor = "#a05e2e"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  />
                </div>
              </div>

              <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
                <label htmlFor="bio" style={styles.formLabel}>
                  Bio
                </label>
                <p style={styles.fieldDescription}>Maximum 500 characters</p>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  style={styles.formTextarea}
                  onFocus={(e) => e.target.style.borderColor = "#a05e2e"}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  rows={4}
                  maxLength={500}
                />
                <div style={styles.charCount}>
                  {formData.bio.length}/500 characters
                </div>
              </div>

              <div style={styles.formActions}>
                <button 
                  type="submit" 
                  style={styles.saveButton}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#8a4f26"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#a05e2e"}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = "#8a4f26"}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = "#a05e2e"}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={handleCancel}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9ecef"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = "#e9ecef"}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        );
      
      default:
        return (
          <div style={{ padding: "30px", textAlign: "center", color: "#666" }}>
            <h3>{activeTab} Content</h3>
            <p>This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      {/* Mobile Header */}
      {isMobile && (
        <div style={styles.mobileHeader}>
          <button 
            style={styles.mobileMenuButton}
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <h2 style={styles.mobileTitle}>Profile</h2>
          <div style={styles.mobileUserInitials}>
            {getUserInitials()}
          </div>
        </div>
      )}
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && showSidebar && (
        <div 
          style={styles.sidebarOverlay}
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      <div style={styles.layout}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {!isMobile && <h2 style={styles.sidebarTitle}>User Profile</h2>}
          
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {getUserInitials()}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={styles.userName}>
                {formData.firstName} {formData.lastName}
              </h3>
              <p style={styles.userEmail}>{formData.email}</p>
            </div>
          </div>
          
          <div style={styles.tabsContainer}>
            {tabs.map(tab => (
              <button
                key={tab}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === tab ? styles.activeTabButton : {})
                }}
                onClick={() => {
                  setActiveTab(tab);
                  if (isMobile) setShowSidebar(false);
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.backgroundColor = "#f8f1eb";
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
                onTouchStart={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.backgroundColor = "#f8f1eb";
                  }
                }}
                onTouchEnd={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <button 
            style={styles.logoutButton}
            onClick={handleLogout}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#8a4f26"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#a05e2e"}
            onTouchStart={(e) => e.currentTarget.style.backgroundColor = "#8a4f26"}
            onTouchEnd={(e) => e.currentTarget.style.backgroundColor = "#a05e2e"}
          >
            Logout
          </button>
        </div>
        
        {/* Main Content Area */}
        <div style={styles.mainContent}>
          <div style={styles.contentCard}>
            {!isMobile && (
              <div style={styles.header}>
                <div>
                  <h1 style={styles.title}>User Profile</h1>
                  <p style={styles.subtitle}>
                    Profile Settings
                    <span style={styles.subtitleDescription}>
                      Update your personal information and profile details
                    </span>
                  </p>
                </div>
              </div>
            )}
            
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;