import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Layout Components
import { Header, PageWrapper } from "../components/layout";

// Report Feature Components
import {
  PhotoUploader,
  IssueDetailsForm,
  LocationMap,
  MessageAlert,
  ReportTips,
} from "../components/features/report";

// Services
import { issueService } from "../services/issueService";

export default function ReportCivicIssue() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reverse geocoding - fetch address when position changes
  useEffect(() => {
    if (!position) return;

    const fetchAddress = async () => {
      setIsLoadingAddress(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await response.json();
        if (data.display_name) {
          setAddress(data.display_name);
        }
      } catch (error) {
        console.error("Failed to fetch address:", error);
      } finally {
        setIsLoadingAddress(false);
      }
    };

    fetchAddress();
  }, [position]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      if (!position) {
        setErrorMessage("Please select the issue location on the map");
        setIsSubmitting(false);
        return;
      }

      const issueData = {
        issueTitle: e.target.issueTitle.value,
        issueType: e.target.issueType.value,
        priorityLevel: e.target.priorityLevel.value,
        address: address,
        landmark: e.target.landmark.value,
        description: e.target.description.value,

        //GeoJSON format (IMPORTANT for nearest volunteer)
        location: {
          type: "Point",
          coordinates: [position.lng, position.lat],
        },
      };

      await issueService.submitIssue(issueData, selectedFiles);

      setSuccessMessage(
        "Report submitted successfully! Assigned to nearest volunteer."
      );

      e.target.reset();
      setSelectedFiles([]);
      setPosition(null);
      setAddress("");

      // Redirect to dashboard after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setErrorMessage(error.message || "Failed to submit report. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      {/* Header */}
      <Header activeNav="/report-issue" />

      {/* Main Content */}
      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            Report an Issue
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Report a <span className="gradient-text">Civic Issue</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Help us improve your community by reporting local issues
          </p>
        </div>

        {/* Messages */}
        <MessageAlert message={successMessage} type="success" />
        <MessageAlert message={errorMessage} type="error" />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/80 space-y-8 animate-fade-in-up delay-100"
        >
          {/* Upload Photos */}
          <PhotoUploader
            selectedFiles={selectedFiles}
            onFilesChange={setSelectedFiles}
            maxFiles={4}
          />

          {/* Issue Details */}
          <IssueDetailsForm
            address={address}
            onAddressChange={setAddress}
            isLoadingAddress={isLoadingAddress}
          />

          {/* Map */}
          <LocationMap position={position} setPosition={setPosition} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoadingAddress || !address}
            className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all btn-press disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </button>

          {/* Tips Section */}
          <ReportTips />

          <p className="text-sm text-center text-gray-400">
            Your privacy is protected. All reports are reviewed by our moderation team.
          </p>
        </form>
      </main>
    </PageWrapper>
  );
}
