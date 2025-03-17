import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { BarChart3, ChevronRight } from "lucide-react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-[#0A2540] text-white text-center py-2 text-sm">
        <span>🎉 Named a Leader in G2's Winter 2024 Grid® Report for Employee Monitoring</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <BarChart3 className="h-8 w-8 text-[#2C7BE5]" />
                <span className="ml-2 text-xl font-bold text-[#0A2540]">ActivTrak</span>
              </Link>
            </div>
            <div className="hidden lg:flex space-x-8">
              {["Product", "Solutions", "Resources"].map((item) => (
                <div key={item} className="group relative">
                  <Link to={`/${item.toLowerCase()}`} className="text-gray-600 hover:text-[#2C7BE5] flex items-center">
                    {item}
                    <ChevronRight className="h-4 w-4 ml-1 transform rotate-90" />
                  </Link>
                </div>
              ))}
              <Link to="/pricing" className="text-gray-600 hover:text-[#2C7BE5]">Pricing</Link>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-[#2C7BE5]">Login</Link>
              <Link to="/signup" className="bg-[#2C7BE5] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1A68D4] transition-colors">
                Get Started Free
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#0A2540] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="col-span-2">
              <Link to="/" className="flex items-center mb-6">
                <BarChart3 className="h-8 w-8" />
                <span className="ml-2 text-xl font-bold">ActivTrak</span>
              </Link>
              <p className="text-blue-200 mb-6">Workforce Analytics for the Modern Workplace</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Integrations", "Security", "Pricing"] },
              { title: "Resources", links: ["Blog", "Case Studies", "Documentation", "Support"] },
              { title: "Company", links: ["About", "Careers", "Partners", "Contact"] },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4 text-lg">{section.title}</h3>
                <ul className="space-y-3 text-blue-200">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link to={`/${section.title.toLowerCase()}/${link.toLowerCase().replace(/\s/g, "-")}`} className="hover:text-white">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-blue-800 mt-12 pt-8 text-center text-blue-200">
            <p>&copy; 2024 ActivTrak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;