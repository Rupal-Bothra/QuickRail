import React from 'react';
import { Link } from 'react-router-dom';
import { Train, HelpCircle, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a3c6e] text-white border-t-4 border-amber-500 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white text-[#1a3c6e] flex items-center justify-center font-black">
                <Train className="w-5 h-5 text-[#1a3c6e]" />
              </div>
              <span className="text-base font-black tracking-tight text-white uppercase">QuickRail</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Official Reservation System for Passenger Rail Services. Providing real-time seat availability, PNR status tracking, and instant ticket reservation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-extrabold uppercase text-amber-400 text-xs border-b border-slate-600 pb-1 mb-2">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-slate-300 font-semibold">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Book Train Tickets</Link></li>
              <li><Link to="/pnr-status" className="hover:text-amber-400 transition-colors">PNR Enquiries</Link></li>
              <li><Link to="/my-bookings" className="hover:text-amber-400 transition-colors">My Reservations</Link></li>
              <li><Link to="/login" className="hover:text-amber-400 transition-colors">User Portal Login</Link></li>
            </ul>
          </div>

          {/* Guidelines & Terms */}
          <div className="space-y-2">
            <h4 className="font-extrabold uppercase text-amber-400 text-xs border-b border-slate-600 pb-1 mb-2">
              Information & Guidelines
            </h4>
            <ul className="space-y-1.5 text-slate-300 font-semibold">
              <li><span className="hover:text-amber-400 cursor-pointer">Travel Rules & Advisories</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Refund & Cancellation Rules</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Passenger Special Concessions</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Privacy Policy</span></li>
            </ul>
          </div>

          {/* Help Desk */}
          <div className="space-y-2">
            <h4 className="font-extrabold uppercase text-amber-400 text-xs border-b border-slate-600 pb-1 mb-2">
              Customer Support Desk
            </h4>
            <div className="space-y-2 text-slate-300 font-semibold text-[11px]">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>Toll-Free Helpdesk: 139 / 1800-111-139</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Email Support: care@quickrail.gov.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} QuickRail Reservation Portal. All Rights Reserved.</p>
          <p className="text-slate-400">Designed & Maintained for Indian Railways Reservation Services.</p>
        </div>
      </div>
    </footer>
  );
}
