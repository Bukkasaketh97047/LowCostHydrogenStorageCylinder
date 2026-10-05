import React from 'react';
import { Network, Server, Database, Code, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Architecture() {
  const tiers = [
    {
      title: '1. Frontend Presentation Tier',
      tech: 'React 18 + Vite + Tailwind CSS + Recharts + Lucide React',
      desc: 'Responsive dark-theme UI with interactive SVG cylinder diagram, live validation feedback, and printable report modal.'
    },
    {
      title: '2. API / Communication Tier',
      tech: 'REST API (HTTP/JSON) + Spring Web MVC Controller',
      desc: 'Decoupled RESTful contracts for design calculation (/api/design/calculate), comparison, and material lookups.'
    },
    {
      title: '3. Backend Application Tier',
      tech: 'Java 17/25 + Spring Boot Service & DTO Layer',
      desc: 'Strongly typed Java services managing business validation, DTO transformation, and request routing.'
    },
    {
      title: '4. Computational Engine Tier',
      tech: 'CylinderCalculationEngine + RecommendationEngine',
      desc: 'Dedicated Java math engine executing Barlow thin-wall vessel formulas and weighted score multi-criteria decision algorithms.'
    },
    {
      title: '5. Persistence & Database Tier',
      tech: 'Spring Data JPA + H2 Embedded In-Memory DB (MySQL Migration Ready)',
      desc: 'JPA entities for Materials, Configurations, and Calculation History with automated bootstrap seeding.'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Network className="w-7 h-7 text-cyan-400" />
            System Software Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise full-stack component breakdown, RESTful endpoints, and database schema mapping.
          </p>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* ARCHITECTURE FLOW DIAGRAM */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
          5-Tier Software Architecture Diagram
        </h3>

        <div className="space-y-4">
          {tiers.map((tier, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-extrabold text-cyan-300">{tier.title}</h4>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    {tier.tech.split('+')[0]}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200">{tier.tech}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{tier.desc}</p>
              </div>

              {idx < tiers.length - 1 && (
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-cyan-400 rotate-90" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* TECH STACK BADGES */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
          Technology Stack Components
        </h3>

        <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
          {['React.js', 'Vite', 'Tailwind CSS', 'Recharts', 'Lucide React', 'Java 17/25', 'Spring Boot 3', 'Spring Data JPA', 'H2 Database', 'REST APIs', 'Maven'].map((t, idx) => (
            <span key={idx} className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-500/40 transition-colors">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
