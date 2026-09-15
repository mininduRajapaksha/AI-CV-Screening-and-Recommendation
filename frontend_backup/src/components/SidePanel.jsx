import React from 'react';
import { FaBolt, FaBullseye, FaShieldAlt } from 'react-icons/fa';

const SidePanel = () => {
  const features = [
    {
      icon: <FaBolt />,
      title: "Automated Screening",
      desc: "Save thousands of hours with immediate, high-accuracy AI summary analysis."
    },
    {
      icon: <FaBullseye />,
      title: "Smart Recommendations",
      desc: "Find the perfect candidate matches ranked instantly by technical suitability."
    },
    {
      icon: <FaShieldAlt />,
      title: "Fair & Objective",
      desc: "Mitigate human bias with standardized metric evaluation pipelines."
    }
  ];

  return (
    <div className="flex-1 bg-primary text-white p-10 flex flex-col justify-center">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-32 h-32 mx-auto object-contain"
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-3 leading-tight">
        AI-Powered CV Screening and Recommendation System
      </h1>

      {/* Subtitle */}
      <p className="font-semibold mb-4 text-white/95">
        Smarter Hiring. Better Talent.
      </p>

      {/* Description */}
      <p className="text-sm text-white/80 mb-8 leading-relaxed">
        Leverage the power of AI to automatically screen CVs, analyze candidate skills and core experience, and instantly retrieve the best recommendations faster and fairer.
      </p>

      {/* Features List */}
      <div className="flex flex-col gap-5">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="bg-white/20 p-2 rounded-lg text-lg flex-shrink-0">
              {feature.icon}
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1">{feature.title}</h4>
              <p className="text-xs text-white/75 leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidePanel;