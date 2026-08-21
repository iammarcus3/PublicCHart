import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MusicProvider, useMusic } from './context/MusicContext';
import { Navbar } from './components/Navbar';
import { HeroOverview } from './components/HeroOverview';
import { TopChartsWidget } from './components/widgets/TopChartsWidget';
import { WeeklyGenreChartsWidget } from './components/widgets/WeeklyGenreChartsWidget';
import { PlaqueWallWidget } from './components/widgets/PlaqueWallWidget';
import { TrackCombinerWidget } from './components/widgets/TrackCombinerWidget';
import { PlaqueDetailModal } from './components/PlaqueDetailModal';
import { PlaqueCreatorModal } from './components/PlaqueCreatorModal';
import { HistoryUploaderModal } from './components/HistoryUploaderModal';
import { LastfmSyncModal } from './components/LastfmSyncModal';
import { CustomizationDrawer } from './components/CustomizationDrawer';
import { DetailDrawer } from './components/DetailDrawer';
import { ChartSettingsModal } from './components/ChartSettingsModal';
import { ChartItemEditorModal } from './components/ChartItemEditorModal';
import { ArtistProfileModal } from './components/ArtistProfileModal';
import { MilestonesModal, MilestoneCategory } from './components/MilestonesModal';
import { AccountModal } from './components/AccountModal';
import { CloudSyncStatusModal } from './components/CloudSyncStatusModal';
import { PlaqueCertification, SubjectType, WidgetType } from './types/music';

const DashboardContent: React.FC = () => {
  const { theme, widgets } = useTheme();
  const { activeArtistProfile, setActiveArtistProfile } = useMusic();

  // Modals & Drawers state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCloudSyncProcessOpen, setIsCloudSyncProcessOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isPlaqueCreatorOpen, setIsPlaqueCreatorOpen] = useState(false);
  const [isMilestonesOpen, setIsMilestonesOpen] = useState(false);
  const [selectedMilestoneCategory, setSelectedMilestoneCategory] = useState<MilestoneCategory>('all_1s');
  const [selectedPlaque, setSelectedPlaque] = useState<PlaqueCertification | null>(null);
  const [prefillPlaqueItem, setPrefillPlaqueItem] = useState<{
    title: string;
    subtitle: string;
    type: SubjectType;
    scrobbles: number;
    coverArt?: string;
  } | null>(null);

  const handleAwardPlaque = (item: {
    title: string;
    subtitle: string;
    type: SubjectType;
    scrobbles: number;
    coverArt?: string;
  }) => {
    setPrefillPlaqueItem(item);
    setIsPlaqueCreatorOpen(true);
  };

  const openMilestonesWithCategory = (cat: MilestoneCategory = 'all_1s') => {
    setSelectedMilestoneCategory(cat);
    setIsMilestonesOpen(true);
  };

  const renderWidget = (id: WidgetType) => {
    switch (id) {
      case 'top-charts':
        return (
          <TopChartsWidget
            onAwardPlaque={handleAwardPlaque}
            onOpenMilestones={() => openMilestonesWithCategory('all_1s')}
          />
        );
      case 'weekly-genre-charts':
        return <WeeklyGenreChartsWidget onAwardPlaque={handleAwardPlaque} />;
      case 'plaque-wall':
        return (
          <PlaqueWallWidget
            onOpenPlaqueDetail={(p) => setSelectedPlaque(p)}
            onOpenPlaqueCreator={() => {
              setPrefillPlaqueItem(null);
              setIsPlaqueCreatorOpen(true);
            }}
          />
        );
      case 'track-combiner':
        return <TrackCombinerWidget />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${theme.bgClass} text-zinc-100 transition-colors selection:bg-amber-500 selection:text-black`}>
      {/* Top Navigation */}
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSync={() => setIsSyncOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenCloudSyncProcess={() => setIsCloudSyncProcessOpen(true)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenPlaqueCreator={() => {
          setPrefillPlaqueItem(null);
          setIsPlaqueCreatorOpen(true);
        }}
        onOpenMilestones={() => openMilestonesWithCategory('all_1s')}
      />

      {/* Main Dashboard Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Stats Overview */}
        <HeroOverview
          onOpenDuplicateDrawer={() => {
            const el = document.getElementById('track-combiner-widget');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenGenreCharts={() => {
            const el = document.getElementById('weekly-genre-charts-widget');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenPlaqueWall={() => {
            const el = document.getElementById('plaque-wall-widget');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Dynamic Widgets Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {widgets
            .filter((w) => w.enabled)
            .map((widget) => (
              <div
                key={widget.id}
                className={widget.width === 'full' ? 'lg:col-span-2' : 'lg:col-span-1'}
              >
                {renderWidget(widget.id)}
              </div>
            ))}
        </div>
      </main>

      {/* Modals and Side Drawers */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenCloudSyncProcess={() => setIsCloudSyncProcessOpen(true)}
      />

      <CloudSyncStatusModal
        isOpen={isCloudSyncProcessOpen}
        onClose={() => setIsCloudSyncProcessOpen(false)}
      />

      <PlaqueDetailModal
        plaque={selectedPlaque}
        onClose={() => setSelectedPlaque(null)}
      />

      <PlaqueCreatorModal
        isOpen={isPlaqueCreatorOpen}
        onClose={() => {
          setIsPlaqueCreatorOpen(false);
          setPrefillPlaqueItem(null);
        }}
        prefillItem={prefillPlaqueItem}
      />

      <HistoryUploaderModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <LastfmSyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        onOpenUpload={() => {
          setIsSyncOpen(false);
          setIsUploadOpen(true);
        }}
      />

      <CustomizationDrawer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />

      <DetailDrawer onAwardPlaque={handleAwardPlaque} />
      <ChartSettingsModal />
      <ChartItemEditorModal />
      <ArtistProfileModal
        artistName={activeArtistProfile}
        onClose={() => setActiveArtistProfile(null)}
        onAwardPlaque={handleAwardPlaque}
      />
      <MilestonesModal
        isOpen={isMilestonesOpen}
        onClose={() => setIsMilestonesOpen(false)}
        initialCategory={selectedMilestoneCategory}
        onAwardPlaque={handleAwardPlaque}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <DashboardContent />
        </MusicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

