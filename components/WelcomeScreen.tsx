import React from 'react';

const ICONS = {
  analyze: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5L21 21" />
    </svg>
  ),
  visualize: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.793V12a9 9 0 10-9 9h.793m.324-9.324l-3.24 3.24m3.24-3.24l3.24 3.24m-3.24-3.24v3.24m0 0l-3.24 3.24m3.24-3.24l3.24 3.24" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  simulate: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  ),
  mitigate: (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-6-6v1.5m-6 0v-1.5a6 6 0 006 6v1.5m0-9A6 6 0 006 7.5v1.5a6 6 0 006 6v-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a3 3 0 003-3v-1.5a3 3 0 00-6 0v1.5a3 3 0 003 3z" />
    </svg>
  )
};

const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; children: React.ReactNode }> = ({ icon, title, children }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-sky-500/20 flex flex-col items-center text-center transition-all duration-300 hover:bg-slate-700/50 hover:border-sky-400/50">
      <div className="mb-4 text-sky-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-sky-300 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{children}</p>
    </div>
  );
};

export const WelcomeScreen: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="text-center p-6 bg-slate-800/30 backdrop-blur-sm border border-sky-500/20 rounded-lg box-glow">
        <img
          src="/images/Portada_App_Ancha.png"
          alt="Pleiades Control Banner"
          className="mx-auto mb-6 rounded-lg shadow-lg max-w-full h-auto"
        />
        <h2 className="text-3xl font-bold text-sky-300 text-glow">Welcome to the NEO Risk Analysis Terminal</h2>
        <p className="mt-2 text-lg text-sky-400/80 max-w-3xl mx-auto">
          Pleiades Control is an advanced simulation tool designed to analyze the potential impact of Near-Earth Objects (NEOs). Select an object from the official NASA database above to begin your analysis.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-sky-300 text-glow text-center mb-6">Core Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={ICONS.analyze} title="Comprehensive Analysis">
            Calculate dozens of key metrics, from orbital mechanics and impact energy to crater dimensions and seismic effects.
          </FeatureCard>
          <FeatureCard icon={ICONS.visualize} title="Global Impact Visualization">
            Pinpoint a hypothetical impact location on our interactive map to see real-time, location-specific effects, including tsunami and shockwave radii.
          </FeatureCard>
          <FeatureCard icon={ICONS.simulate} title="Dynamic Scenario Simulation">
            Manipulate critical entry parameters like impact angle and velocity to instantly simulate different scenarios and understand their consequences.
          </FeatureCard>
          <FeatureCard icon={ICONS.mitigate} title="AI-Powered Mitigation">
            Leverage generative AI to brainstorm and evaluate potential mitigation strategies for the selected threat, from deflection to post-impact response.
          </FeatureCard>
        </div>
      </section>
    </div>
  );
};