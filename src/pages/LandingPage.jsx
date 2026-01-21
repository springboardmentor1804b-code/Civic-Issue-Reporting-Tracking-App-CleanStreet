// Layout Components
import { Header, Footer, PageWrapper } from "../components/layout";

// Landing Feature Components
import {
  HeroSection,
  FeaturesSection,
  MapGallerySection,
  SuccessStorySection,
  CommunitySection,
  CTASection,
} from "../components/features/landing";

// Assets
import landingcity from "../assets/landing-city.jpg";
import reportedMap from "../assets/reportedissues-map.jpeg.jpg";
import community1 from "../assets/community-gallery-1.jpeg.jpg";
import community2 from "../assets/community-gallery-2.jpeg.jpg";
import issueFixed from "../assets/issue-fix-photo.png";
import community from "../assets/Community-photo.jpg";

const LandingPage = () => {
  return (
    <PageWrapper background="large" className="overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection backgroundImage={landingcity} />

      {/* Map + Gallery Section */}
      <MapGallerySection
        mapImage={reportedMap}
        galleryImages={[community1, community2]}
      />

      {/* Issue Fixed Showcase */}
      <SuccessStorySection image={issueFixed} />

      {/* Features Section */}
      <FeaturesSection />

      {/* Community Section */}
      <CommunitySection image={community} />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </PageWrapper>
  );
};

export default LandingPage;
