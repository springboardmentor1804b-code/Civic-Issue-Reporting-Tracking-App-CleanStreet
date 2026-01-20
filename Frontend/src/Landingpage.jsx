import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  ClipboardList, 
  Eye, 
  LogIn, 
  UserPlus,
  Menu,
  X,
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram,
  PlusCircle,
  Eye as EyeIcon,
  Users,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

// Header Component
const Header = ({ activeTab, setActiveTab, isLoggedIn, setIsLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, activeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'report', label: 'Report Issue', icon: <ClipboardList size={20} />, activeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'complaints', label: 'View Complaints', icon: <Eye size={20} />, activeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">CS</span>
            </div>
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:no-underline">
              Clean<span className="text-amber-600">Street</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to="/"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover-lift border ${
                  activeTab === item.id 
                    ? `${item.activeColor} shadow-sm` 
                    : 'hover:bg-gray-100 border-transparent text-gray-700'
                } feature-card no-underline`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors hover-lift"
                onClick={handleLogout}
              >
                <LogIn size={20} />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors hover-lift no-underline">
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center space-x-2 px-4 py-2 border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors hover-lift no-underline">
                  <UserPlus size={20} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 hover-lift"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  to="/"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg feature-card no-underline ${
                    activeTab === item.id 
                      ? `${item.activeColor}` 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                {isLoggedIn ? (
                  <button 
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover-lift"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogIn size={20} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover-lift no-underline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn size={20} />
                      <span>Login</span>
                    </Link>
                    <Link 
                      to="/signup" 
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 border-2 border-amber-600 text-amber-600 rounded-lg hover-lift no-underline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus size={20} />
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Component
const Hero = () => {
  return (
    <section className="mb-12">
      <div className="relative rounded-2xl overflow-hidden shadow-xl min-h-[450px]">
        {/* Background Image with Multiple Layers */}
        <div className="absolute inset-0">
          {/* Primary Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            }}
          ></div>
          
          {/* Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-800/80 via-amber-700/70 to-yellow-800/60"></div>
        </div>
        
        {/* Content */}
        <div className="relative p-8 md:p-12 text-white h-full flex items-center">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-title animate-fade-in">
              Keep Your Community Clean
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-10 opacity-95 animate-slide-up">
              Join thousands of citizens making their neighborhoods cleaner and safer. 
              Report issues, track progress, and make a real difference.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in">
              <button className="flex items-center space-x-2 bg-white text-amber-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover-lift hover:scale-105">
                <PlusCircle size={20} />
                <span>Report an Issue</span>
              </button>
              <button className="flex items-center space-x-2 bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 hover-lift hover:scale-105">
                <EyeIcon size={20} />
                <span>View Active Issues</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// HowItWorks Component
const HowItWorks = () => {
  const steps = [
    { id: 1, title: 'Report Issues', description: 'Submit Problems Found.', icon: '📝' },
    { id: 2, title: 'Track Progress', description: 'Monitor Cleanup Status.', icon: '📊' },
    { id: 3, title: 'see resolved issues', description: 'See Completed Actions.', icon: '✅' },
    { id: 4, title: 'Community Impact', description: 'Contribute to Cleaner Streets.', icon: '🤝' }
  ];

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          How CleanStreet Works
        </h2>
        <p className="text-gray-600">
          Simple Steps To Make A Difference In Your Community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div 
            key={step.id}
            className="bg-white rounded-xl p-6 hover-lift feature-card"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4">
                {step.icon}
              </div>
              <div className="absolute -right-4 top-6 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <PlusCircle className="text-amber-600" size={16} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Stats Component
const Stats = () => {
  const stats = [
    { label: 'Issues Reported', value: '1,234', color: 'bg-blue-500' },
    { label: 'Issues Resolved', value: '987', color: 'bg-green-500' },
    { label: 'Active Volunteers', value: '456', color: 'bg-purple-500' },
    { label: 'Cities Covered', value: '24', color: 'bg-orange-500' },
  ];

  return (
    <section className="mb-12">
      <div className="bg-white rounded-2xl shadow-lg p-6 feature-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Community Impact</h2>
          <button className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium hover-lift">
            <span>See All Details</span>
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4">
              <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3 hover-lift`}>
                <TrendingUp size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// QuickActions Component
const QuickActions = () => {
  return (
    <div className="mb-12">
      <div className="bg-gradient-to-b from-amber-600 to-yellow-700 rounded-2xl shadow-lg p-6 text-white h-full">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="space-y-4">
          <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3 transition-colors hover-lift">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <PlusCircle size={24} />
            </div>
            <div className="text-left">
              <div className="font-semibold">Report New Issue</div>
              <div className="text-sm opacity-80">Submit a problem you found</div>
            </div>
          </button>
          <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3 transition-colors hover-lift">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <EyeIcon size={24} />
            </div>
            <div className="text-left">
              <div className="font-semibold">View Complaints</div>
              <div className="text-sm opacity-80">Check reported issues</div>
            </div>
          </button>
          <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3 transition-colors hover-lift">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users size={24} />
            </div>
            <div className="text-left">
              <div className="font-semibold">Community</div>
              <div className="text-sm opacity-80">Join local groups</div>
            </div>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <h3 className="font-semibold mb-3">Weekly Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Issues Reported</span>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Issues Resolved</span>
              <span className="font-semibold">18</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Response Time</span>
              <span className="font-semibold">3.2h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// RecentActivity Component
const RecentActivity = () => {
  const recentActivities = [
    { id: 1, title: 'Garbage Pile Reported', location: 'Main Street', time: '2 hours ago', status: 'pending' },
    { id: 2, title: 'Broken Street Light', location: 'Oak Avenue', time: '1 day ago', status: 'in-progress' },
    { id: 3, title: 'Graffiti Removed', location: 'City Park', time: '3 days ago', status: 'completed' },
  ];

  return (
    <div className="lg:col-span-2 mb-12">
      <div className="bg-white rounded-2xl shadow-lg p-6 h-full feature-card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50/50 transition-colors cursor-pointer hover-lift"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                activity.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                {activity.status === 'completed' ? <CheckCircle size={24} /> :
                  activity.status === 'in-progress' ? <Clock size={24} /> :
                  <MapPin size={24} />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {activity.location}
                  </span>
                  <span>{activity.time}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                activity.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {activity.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-lg">CS</span>
              </div>
              <h2 className="text-2xl font-bold">
                Clean<span className="text-amber-400">Street</span>
              </h2>
            </div>
            <p className="text-gray-400 mb-6">
              Join thousands of citizens making their neighborhoods cleaner and safer. 
              Report issues, track progress, and make a real difference in your community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors hover-lift">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors hover-lift">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors hover-lift">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors hover-lift">Dashboard</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors hover-lift">Report Issue</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors hover-lift">View Complaints</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors hover-lift">How It Works</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <Phone size={18} className="mr-3" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail size={18} className="mr-3" />
                <span>support@cleanstreet.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>© 2025 CleanStreet | All Rights Reserved</p>
          <p className="text-sm mt-2">"See something? Report something. Make a difference."</p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <HowItWorks />
        <Stats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <QuickActions />
          <RecentActivity />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
