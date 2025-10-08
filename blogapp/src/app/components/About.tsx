"use client";
import { useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export default function About() {
  const [activeTab, setActiveTab] = useState<"mission" | "team" | "features">("mission");

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Passionate about creating platforms that empower writers to share their stories with the world.",
      avatar: "/team/alex.jpg"
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Lead Developer",
      bio: "Full-stack developer with a love for clean code and user-centered design.",
      avatar: "/team/sarah.jpg"
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      role: "Content Manager",
      bio: "Dedicated to helping writers craft compelling content and grow their audience.",
      avatar: "/team/mike.jpg"
    }
  ];

  const features = [
    {
      title: "Seamless Writing",
      description: "Distraction-free editor with real-time saving and auto-formatting.",
      icon: "✍️"
    },
    {
      title: "Global Reach",
      description: "Share your stories with readers from around the world.",
      icon: "🌎"
    },
    {
      title: "Community Driven",
      description: "Connect with fellow writers and readers through comments and feedback.",
      icon: "👥"
    },
    {
      title: "Secure Platform",
      description: "Your content and data are protected with enterprise-grade security.",
      icon: "🔒"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 mt-15">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">About Our Platform</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A modern blogging platform built for writers who want to share their stories with the world.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-2">
            <div className="flex space-x-2">
              {[
                { id: "mission", label: "Our Mission" },
                { id: "team", label: "Our Team" },
                { id: "features", label: "Features" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "mission" | "team" | "features")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl">
          {/* Mission Tab */}
          {activeTab === "mission" && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                  We believe everyone has a story worth sharing. Our mission is to provide writers with 
                  a beautiful, intuitive platform where they can focus on what matters most—creating 
                  compelling content without the technical headaches.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-4">💡</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Empower Creativity</h3>
                  <p className="text-gray-400">
                    We provide the tools and platform for writers to express their creativity 
                    and reach audiences worldwide.
                  </p>
                </div>
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
                  <div className="text-blue-400 text-2xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Foster Community</h3>
                  <p className="text-gray-400">
                    Build meaningful connections between writers and readers through 
                    engaging discussions and feedback.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div>
              <h2 className="text-2xl font-bold text-white text-center mb-8">Meet Our Team</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gray-900/30 rounded-xl p-6 border border-gray-700 hover:border-blue-500/30 transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-600 group-hover:border-blue-500 transition-colors">
                        <span className="text-2xl">👤</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                      <div className="inline-block bg-blue-600/20 text-blue-400 text-sm px-3 py-1 rounded-full border border-blue-500/30 mb-3">
                        {member.role}
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === "features" && (
            <div>
              <h2 className="text-2xl font-bold text-white text-center mb-8">Platform Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/30 rounded-xl p-6 border border-gray-700 hover:border-blue-500/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
                        <span className="text-xl">{feature.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">10K+</div>
                  <div className="text-gray-400 text-sm">Active Writers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">50K+</div>
                  <div className="text-gray-400 text-sm">Published Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">1M+</div>
                  <div className="text-gray-400 text-sm">Monthly Readers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-gray-400 text-sm">Uptime</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Writing?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Join thousands of writers who are already sharing their stories on our platform.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}