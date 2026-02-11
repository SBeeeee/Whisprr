/**
 * Timezone Selection Component
 * Allows users to select their timezone
 */

"use client";

import { useState, useEffect } from "react";
import { Globe, Clock } from "lucide-react";

const timezones = [
  // Asia
  { value: 'Asia/Kolkata', label: 'India (IST)', country: '🇮🇳' },
  { value: 'Asia/Dubai', label: 'UAE (GST)', country: '🇦🇪' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', country: '🇸🇬' },
  { value: 'Asia/Tokyo', label: 'Japan (JST)', country: '🇯🇵' },
  { value: 'Asia/Shanghai', label: 'China (CST)', country: '🇨🇳' },
  { value: 'Asia/Seoul', label: 'Korea (KST)', country: '🇰🇷' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', country: '🇭🇰' },
  { value: 'Asia/Bangkok', label: 'Thailand (ICT)', country: '🇹🇭' },
  { value: 'Asia/Jakarta', label: 'Indonesia (WIB)', country: '🇮🇩' },
  { value: 'Asia/Manila', label: 'Philippines (PHT)', country: '🇵🇭' },
  
  // Europe
  { value: 'Europe/London', label: 'UK (GMT)', country: '🇬🇧' },
  { value: 'Europe/Paris', label: 'France (CET)', country: '🇫🇷' },
  { value: 'Europe/Berlin', label: 'Germany (CET)', country: '🇩🇪' },
  { value: 'Europe/Moscow', label: 'Russia (MSK)', country: '🇷🇺' },
  { value: 'Europe/Rome', label: 'Italy (CET)', country: '🇮🇹' },
  { value: 'Europe/Madrid', label: 'Spain (CET)', country: '🇪🇸' },
  { value: 'Europe/Amsterdam', label: 'Netherlands (CET)', country: '🇳🇱' },
  { value: 'Europe/Stockholm', label: 'Sweden (CET)', country: '🇸🇪' },
  { value: 'Europe/Warsaw', label: 'Poland (CET)', country: '🇵🇱' },
  
  // Americas
  { value: 'America/New_York', label: 'USA Eastern (EST)', country: '🇺🇸' },
  { value: 'America/Los_Angeles', label: 'USA Pacific (PST)', country: '🇺🇸' },
  { value: 'America/Chicago', label: 'USA Central (CST)', country: '🇺🇸' },
  { value: 'America/Toronto', label: 'Canada Eastern (EST)', country: '🇨🇦' },
  { value: 'America/Mexico_City', label: 'Mexico (CST)', country: '🇲🇽' },
  { value: 'America/Sao_Paulo', label: 'Brazil (BRT)', country: '🇧🇷' },
  { value: 'America/Buenos_Aires', label: 'Argentina (ART)', country: '🇦🇷' },
  
  // Africa
  { value: 'Africa/Cairo', label: 'Egypt (EET)', country: '🇪🇬' },
  { value: 'Africa/Lagos', label: 'Nigeria (WAT)', country: '🇳🇬' },
  { value: 'Africa/Johannesburg', label: 'South Africa (SAST)', country: '🇿🇦' },
  { value: 'Africa/Nairobi', label: 'Kenya (EAT)', country: '🇰🇪' },
  
  // Oceania
  { value: 'Australia/Sydney', label: 'Australia (AEDT)', country: '🇦🇺' },
  { value: 'Australia/Melbourne', label: 'Australia (AEDT)', country: '🇦🇺' },
  { value: 'Pacific/Auckland', label: 'New Zealand (NZDT)', country: '🇳🇿' },
];

export default function TimezoneSelector({ value, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(value || 'Asia/Kolkata');

  // Auto-detect user's timezone
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Intl) {
      const detectedTimezone = window.Intl.DateTimeFormat().resolvedOptions().timeZone;
      const detected = timezones.find(tz => tz.value === detectedTimezone);
      if (detected) {
        setSelectedTimezone(detected.value);
        onChange?.(detected.value);
      }
    }
  }, []);

  const selected = timezones.find(tz => tz.value === selectedTimezone);

  const handleSelect = (timezone) => {
    setSelectedTimezone(timezone.value);
    onChange?.(timezone.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-gray-900 font-medium">
            {selected ? `${selected.country} ${selected.label}` : 'Select Timezone'}
          </span>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="py-1">
            {timezones.map((timezone, index) => (
              <button
                key={timezone.value}
                onClick={() => handleSelect(timezone)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors duration-150 ${
                  timezone.value === selectedTimezone ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <span className="text-lg">{timezone.country}</span>
                <div className="flex-1">
                  <div className="font-medium">{timezone.label}</div>
                  <div className="text-xs text-gray-500">{timezone.value}</div>
                </div>
                {timezone.value === selectedTimezone && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 011.414-1.414L10 10.586l7.293-7.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
