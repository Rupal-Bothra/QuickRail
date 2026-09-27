import React from 'react';

export default function SeatBadge({ classInfo, isSelected, onClick }) {
  const { class: cls, fare, available_seats, rac_count, waitlist_count, statusBadge } = classInfo;

  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let badgeText = `AVAILABLE - ${available_seats}`;

  if (available_seats <= 0) {
    if (rac_count > 0) {
      badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
      badgeText = `RAC - ${rac_count}`;
    } else {
      badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
      badgeText = `WL - ${waitlist_count || 1}`;
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-xl border text-left transition-all ${
        isSelected
          ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-bold text-slate-800 text-sm">{cls}</span>
        <span className="font-extrabold text-slate-900 text-sm">₹{fare}</span>
      </div>
      <div className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeColor}`}>
        {badgeText}
      </div>
    </button>
  );
}
