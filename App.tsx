import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { NEOSelector } from './components/NEOSelector';
import { Dashboard } from './components/Dashboard';
import { CalculationDetails } from './components/CalculationDetails';
import { MitigationStrategies } from './components/MitigationStrategies';
import { ThreatSummary } from './components/ThreatSummary';
import { Loader } from './components/Loader';
import { EntryParametersControl } from './components/EntryParametersControl';
import { getNEOList, getNEOData } from './services/nasaApiService';
import { getElevationForCoords } from './services/elevationApiService';
import { calculateImpactMetrics } from './utils/impactCalculator';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Coordinates, CalculatedMetrics, NEOData, ImpactOptions, NEOListItem } from './utils/types';


type View = 'dashboard' | 'details' | 'mitigation' | 'summary';

const App: React.FC = () => {
  const [neoList, setNeoList] = useState<NEOListItem[]>([]);
  const [selectedNeoId, setSelectedNeoId] = useState<string>('');
  const [neoData, setNeoData] = useState<NEOData | null>(null);
  const [metrics, setMetrics] = useState<CalculatedMetrics | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<Coordinates | null>(null);
  const [infoWindowContent, setInfoWindowContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListLoading, setIsListLoading] = useState<boolean>(true);
  const [isLocalAnalysisLoading, setIsLocalAnalysisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const [impactAngle, setImpactAngle] = useState<number>(45);
  const [impactVelocity, setImpactVelocity] = useState<number | null>(null);

  useEffect(() => {
    const fetchNeoList = async () => {
      try {
        setError(null);
        setIsListLoading(true);
        const list = await getNEOList();
        setNeoList(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch NEO list');
      } finally {
        setIsListLoading(false);
      }
    };
    fetchNeoList();
  }, []);

  const handleFetchNeoData = useCallback(async () => {
    if (!selectedNeoId) return;
    try {
      setIsLoading(true);
      setError(null);
      setNeoData(null);
      setMetrics(null);
      setSelectedCoords(null);
      setImpactVelocity(null);
      setCurrentView('dashboard');
      
      const data = await getNEOData(selectedNeoId);
      const latestCloseApproach = data.close_approach_data.sort((a, b) => b.epoch_date_close_approach - a.epoch_date_close_approach)[0];

      setNeoData(data);
      setImpactVelocity(parseFloat(latestCloseApproach.relative_velocity.kilometers_per_second));
      setImpactAngle(45);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setNeoData(null);
      setImpactVelocity(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedNeoId]);
  
  useEffect(() => {
    if (!neoData || impactVelocity === null) {
      setMetrics(null);
      return;
    }

    const analyzeImpact = async () => {
      let elevation: number | undefined = undefined;

      if (selectedCoords) {
        setIsLocalAnalysisLoading(true);
        setInfoWindowContent("Analyzing location...");
        try {
          elevation = await getElevationForCoords(selectedCoords.lat, selectedCoords.lng);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(`Error during local analysis: ${errorMessage}`);
          setInfoWindowContent(`Error: ${errorMessage}`);
          setIsLocalAnalysisLoading(false);
          return;
        }
      }
      
      const options: ImpactOptions = {
        impactAngle,
        impactVelocity,
        elevation,
      };
      let updatedMetrics = calculateImpactMetrics(neoData, options);

      if (selectedCoords && elevation !== undefined) {
        const elevationText = `Elevation: <strong>${elevation?.toFixed(2)} m</strong>`;
        setInfoWindowContent(elevationText);
      } else {
        setInfoWindowContent('');
      }

      setMetrics(updatedMetrics);
      if (selectedCoords) {
        setIsLocalAnalysisLoading(false);
      }
    };

    analyzeImpact();
  }, [neoData, impactAngle, impactVelocity, selectedCoords]);

  const handleMapClick = useCallback((coords: Coordinates) => {
    setSelectedCoords(coords);
  }, []);

  const renderCurrentView = () => {
    if (!metrics || !neoData) return null;
    switch (currentView) {
      case 'details':
        return <CalculationDetails metrics={metrics} neoData={neoData} />;
      case 'mitigation':
        return <MitigationStrategies metrics={metrics} />;
      case 'summary':
        return <ThreatSummary metrics={metrics} />;
      case 'dashboard':
      default:
        return <Dashboard metrics={metrics} neoData={neoData} selectedCoords={selectedCoords} />;
    }
  };
  
  const ViewSwitcher: React.FC = () => (
     <div className="my-6 flex justify-center items-center gap-2 sm:gap-4 bg-slate-800/50 p-2 rounded-lg border border-sky-500/20">
      {(['dashboard', 'details', 'mitigation', 'summary'] as View[]).map(view => (
        <button
          key={view}
          onClick={() => setCurrentView(view)}
          className={`px-4 sm:px-6 py-2 rounded-md text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
            currentView === view
              ? 'bg-sky-600 text-white shadow-lg'
              : 'bg-transparent text-sky-300 hover:bg-sky-800/50'
          }`}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </button>
      ))}
    </div>
  );

};


export default App;