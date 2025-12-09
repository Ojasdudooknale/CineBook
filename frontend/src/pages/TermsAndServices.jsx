import React from 'react';
import { Shield, FileText, Lock, AlertCircle } from 'lucide-react';

const TermsAndServices = () => {
  return (
    <div className="min-h-screen bg-black space-y-12 pt-24 px-4 pb-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
          <FileText className="text-white h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Please read these terms carefully before using CineBook services.
        </p>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Section 1: Introduction */}
        <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Shield className="text-blue-400 h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Welcome to CineBook. By accessing or using our websites and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.
          </p>
        </div>

        {/* Section 2: User Accounts */}
        <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Lock className="text-purple-400 h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">2. User Accounts</h2>
          </div>
          <ul className="space-y-4 text-gray-400 leading-relaxed list-disc list-inside">
            <li>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</li>
            <li>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</li>
            <li>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
          </ul>
        </div>

        {/* Section 3: Booking & Payments */}
        <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <AlertCircle className="text-green-400 h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">3. Bookings & Payments</h2>
          </div>
          <p className="text-gray-400 leading-relaxed mb-4">
            All ticket purchases are subject to availability and acceptance by the theater.
          </p>
          <ul className="space-y-4 text-gray-400 leading-relaxed list-disc list-inside">
            <li>Review your booking details carefully before payment.</li>
            <li>We are not responsible for mistakes made during the booking process.</li>
            <li>Refund policies vary by theater and event type. Please check specific conditions during checkout.</li>
          </ul>
        </div>

        {/* Section 4: Termination */}
        <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">4. Termination</h2>
          <p className="text-gray-400 leading-relaxed">
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </div>

        {/* Contact Info */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-gray-500">
            Questions about the Terms of Service should be sent to us at <span className="text-blue-400 font-bold">legal@cinebook.com</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default TermsAndServices;
