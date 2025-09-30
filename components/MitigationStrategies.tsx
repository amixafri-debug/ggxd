import React, { useState, useEffect } from 'react';
// Fix: Import GoogleGenAI and Type from @google/genai as per guidelines.
import { GoogleGenAI, Type } from '@google/genai';
import type { CalculatedMetrics } from '../types';
import { StrategyCard } from './StrategyCard';
import { Loader } from './Loader';
import { MetricCardGroup } from './MetricCard';

interface Strategy {
  title: string;
  description: string;
  pros: string[];
  cons:string[];
  feasibility: string;
}

export const MitigationStrategies: React.FC<{ metrics: CalculatedMetrics }> = ({ metrics }) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateStrategies = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fix: Initialize GoogleGenAI with a named apiKey object as per guidelines.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `
          Analyze the following asteroid impact scenario and provide potential mitigation strategies.
          The analysis should be technical and concise, suitable for a risk assessment terminal.
          Scenario Data:
          - Asteroid Name: ${metrics.name}
          - Diameter: ${metrics.diameter.toFixed(2)} meters
          - Is Potentially Hazardous: ${metrics.isHazardous}
          - Impact Kinetic Energy: ${metrics.energetics.kineticEnergy.toExponential(2)} Joules
          - TNT Equivalent: ${(metrics.energetics.tntEquivalent / 1000).toFixed(2)} Megatons

          Based on this data, generate a list of 3 diverse and realistic mitigation strategies.
          Consider both pre-impact (deflection, disruption) and post-impact (evacuation, infrastructure hardening) strategies.
          For each strategy, provide a title, a brief description, a list of pros, a list of cons, and a feasibility assessment (e.g., 'High', 'Medium', 'Low', 'Theoretical').
          Return ONLY the JSON array of objects, with no other text or markdown.
        `;

        // Fix: Define a response schema to ensure structured JSON output from the model.
        const responseSchema = {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                feasibility: { type: Type.STRING, description: "Feasibility assessment (e.g., 'High', 'Medium', 'Low', 'Theoretical')" },
              },
              required: ["title", "description", "pros", "cons", "feasibility"],
            },
          };

        // Fix: Call ai.models.generateContent with the correct model and parameters as per guidelines.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        // Fix: Extract text directly from the response.text property as per guidelines.
        let jsonStr = response.text.trim();
        const parsedStrategies = JSON.parse(jsonStr);
        setStrategies(parsedStrategies);
      } catch (e) {
          console.error("Error generating mitigation strategies:", e);
          setError("Could not generate mitigation strategies from AI. Please check API key and network connection.");
      } finally {
          setIsLoading(false);
      }
    };

    generateStrategies();
  }, [metrics]);

  return (
    <MetricCardGroup title="Mitigation Strategies (AI Generated)">
      {isLoading && <Loader message="Generating strategies with AI..." />}
      {error && <p className="text-red-400 text-center">{error}</p>}
      {!isLoading && !error && (
        <div className="space-y-6">
          {strategies.map((strategy, index) => (
            <StrategyCard key={index} {...strategy} />
          ))}
        </div>
      )}
    </MetricCardGroup>
  );
};
