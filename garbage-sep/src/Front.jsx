import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Brain, Leaf, Recycle, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const Front = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: 'Upload Media',
      description: 'Simply upload an image or video of any garbage item you want to identify',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI Analysis',
      description: 'Our advanced AI instantly analyzes and identifies the type of waste',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: 'Get Information',
      description: 'Receive detailed disposal instructions, recycling tips, and environmental impact',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Go Green',
      description: 'Learn eco-friendly alternatives and contribute to a sustainable future',
      color: 'from-emerald-500 to-lime-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Take a Photo',
      description: 'Capture or upload an image of the garbage item'
    },
    {
      number: '02',
      title: 'Analyze',
      description: 'Click the analyze button to process the image'
    },
    {
      number: '03',
      title: 'Learn & Act',
      description: 'Get instant information on proper disposal methods'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 backdrop-blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-2xl shadow-lg">
                <Recycle className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Identify Garbage
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                Save the Planet
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Upload any waste item and get instant information on how to dispose it properly. 
              Join us in making the world cleaner, one item at a time.
            </p>
            
            <button
              onClick={() => navigate('/home')}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 hover:scale-105 active:scale-95"
            >
              Get Started
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-200">
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600 font-semibold">Accuracy Rate</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600 font-semibold">Items Database</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-200">
              <div className="text-4xl font-bold text-teal-600 mb-2">Fast</div>
              <div className="text-gray-600 font-semibold">Instant Results</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Three simple steps to make a difference</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500 mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-green-500" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600">Powerful features for environmental impact</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-3xl p-12 text-white shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">What You'll Get</h2>
              <p className="text-xl text-green-50">Complete information for responsible waste disposal</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Detailed waste identification',
                'Proper disposal methods',
                'Recycling instructions',
                'Environmental impact info',
                'Decomposition timeline',
                'Eco-friendly alternatives'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span className="text-lg font-semibold">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Start identifying and disposing waste properly today. Every small action counts towards a cleaner planet.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-teal-600 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 hover:scale-105 active:scale-95"
          >
            Start Now
            <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Front;