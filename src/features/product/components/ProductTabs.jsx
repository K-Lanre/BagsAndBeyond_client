/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/product/components/ProductTabs.jsx */
import { useState } from 'react';

const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'details', label: 'Details' },
  { id: 'shipping', label: 'Shipping' },
];

export function ProductTabs({ description, details, shipping }) {
  const [activeTab, setActiveTab] = useState('description');

  const content = {
    description: (
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-text-primary">
          Designed for Every Journey
        </h3>
        <p className="text-text-muted text-sm leading-relaxed">
          {description}
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-text-muted">
            <span className="text-primary">•</span>
            100% Genuine Full-Grain Leather
          </li>
          <li className="flex items-start gap-2 text-sm text-text-muted">
            <span className="text-primary">•</span>
            Reinforced hand-stitched handles
          </li>
          <li className="flex items-start gap-2 text-sm text-text-muted">
            <span className="text-primary">•</span>
            Internal laptop sleeve (fits up to 14")
          </li>
          <li className="flex items-start gap-2 text-sm text-text-muted">
            <span className="text-primary">•</span>
            Premium brass hardware accents
          </li>
        </ul>
      </div>
    ),
    details: (
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-text-primary">
          Product Specifications
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="space-y-1">
              <dt className="text-xs text-text-muted uppercase tracking-wider">{detail.label}</dt>
              <dd className="text-sm text-text-primary font-medium">{detail.value}</dd>
            </div>
          ))}
        </div>
      </div>
    ),
    shipping: (
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-text-primary">
          Shipping Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text-primary">Express Delivery</p>
              <p className="text-sm text-text-muted">1-3 business days within Lagos, 3-5 days nationwide</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text-primary">Secure Packaging</p>
              <p className="text-sm text-text-muted">Each item is carefully wrapped in premium packaging</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text-primary">Free Returns</p>
              <p className="text-sm text-text-muted">7-day hassle-free return policy on all orders</p>
            </div>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="space-y-6">
      {/* Tab Buttons */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {content[activeTab]}
      </div>
    </div>
  );
}
