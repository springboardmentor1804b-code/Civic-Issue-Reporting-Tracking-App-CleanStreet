import logo from "../../assets/logo-leaf.png";

const Footer = () => {
  const footerLinks = [
    { title: "Product", links: ["Features", "How it Works", "Pricing", "FAQ"] },
    { title: "Support", links: ["Help Center", "Contact", "Community", "Status"] },
    { title: "Legal", links: ["Privacy", "Terms", "Cookies", "License"] },
  ];

  const socialLinks = ["Twitter", "Facebook", "Instagram", "LinkedIn"];

  return (
    <footer className="relative bg-gray-900 text-white py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} className="w-10" alt="logo" />
              <span className="text-xl font-bold">CleanStreet</span>
            </div>
            <p className="text-gray-400 text-sm">
              Making communities cleaner, one report at a time.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2025 CleanStreet. All rights reserved.</p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
