/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastContainer, ToastMessage } from './components/ui/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { ComposerPage } from './components/composer/ComposerPage';
import { ResultsView } from './components/results/ResultsView';
import { CalendarView } from './components/calendar/CalendarView';
import { TemplatesView } from './components/templates/TemplatesView';
import { BrandKitView } from './components/brand/BrandKitView';
import { ConnectedAccountsView } from './components/integrations/ConnectedAccountsView';
import { HistoryView } from './components/history/HistoryView';
import { SmartToolsModal } from './components/tools/SmartToolsModal';
import { ScheduleModal } from './components/scheduler/ScheduleModal';
import { LandingPage } from './components/landing/LandingPage';
import { PfpGenerator } from './components/studio/PfpGenerator';
import { StoryMaker } from './components/studio/StoryMaker';
import { PostOptionsView } from './components/studio/PostOptionsView';
import {
  BrandKit,
  ConnectedAccount,
  PlatformId,
  PostTemplate,
  Project,
  ScheduledPostItem,
} from './types';
import {
  deleteProject,
  duplicateProject,
  getStoredBrandKit,
  getStoredConnectedAccounts,
  getStoredProjects,
  getStoredScheduledPosts,
  saveBrandKit,
  saveConnectedAccounts,
  saveProjects,
  saveScheduledPosts,
  saveSingleProject,
} from './lib/storage';
import { getBackendStatus } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [brandKit, setBrandKit] = useState<BrandKit>(getStoredBrandKit());
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPostItem[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAiLive, setIsAiLive] = useState<boolean>(false);

  // Modals & Drawers
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSmartToolsOpen, setIsSmartToolsOpen] = useState(false);
  const [isLandingModalOpen, setIsLandingModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleTargetPlatform, setScheduleTargetPlatform] = useState<PlatformId | undefined>(undefined);

  // Active Project (Working project in composer & results)
  const [activeProject, setActiveProject] = useState<Project>(() => {
    const existing = getStoredProjects();
    if (existing.length > 0) return existing[0];
    return createBlankProject();
  });

  function createBlankProject(): Project {
    return {
      id: `proj-${Date.now()}`,
      title: 'New Social Campaign',
      sourceContent: '',
      additionalInputs: {},
      selectedPlatforms: ['linkedin', 'instagram', 'twitter', 'whatsapp'],
      tone: 'auto',
      language: 'english',
      audience: 'general',
      platformPosts: {} as any,
      media: {
        id: `media-init-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        name: 'Precision Engineering & Machining Center',
        type: 'ai_generated',
        aspectRatio: '16:9',
        style: 'Commercial Photography',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    };
  }

  // Load initial data and check backend status
  useEffect(() => {
    const stored = getStoredProjects();
    setProjects(stored);
    setScheduledPosts(getStoredScheduledPosts());
    setConnectedAccounts(getStoredConnectedAccounts());
    setBrandKit(getStoredBrandKit());

    getBackendStatus()
      .then((status) => {
        setIsAiLive(status.hasApiKey);
      })
      .catch(() => {
        setIsAiLive(false);
      });
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Project Management Handlers
  const handleUpdateActiveProject = (updated: Project) => {
    setActiveProject(updated);
    saveSingleProject(updated);
    setProjects(getStoredProjects());
  };

  const handleCreateNewProject = () => {
    const fresh = createBlankProject();
    setActiveProject(fresh);
    saveSingleProject(fresh);
    setProjects(getStoredProjects());
    setCurrentTab('composer');
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    // If it has generated posts, go to results; otherwise composer
    if (project.platformPosts && Object.keys(project.platformPosts).length > 0) {
      setCurrentTab('results');
    } else {
      setCurrentTab('composer');
    }
  };

  const handleDuplicateProject = (projectId: string) => {
    const duplicated = duplicateProject(projectId);
    if (duplicated) {
      setProjects(getStoredProjects());
      addToast('success', 'Project Duplicated', `Created a copy of ${duplicated.title}`);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const updated = deleteProject(projectId);
    setProjects(updated);
    if (activeProject.id === projectId) {
      setActiveProject(updated[0] || createBlankProject());
    }
    addToast('info', 'Project Deleted', 'Project removed from archive.');
  };

  const handleUseTemplate = (template: PostTemplate) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: template.title,
      sourceContent: template.sampleContent,
      additionalInputs: { ...template.additionalInputs },
      selectedPlatforms: [...template.recommendedPlatforms],
      tone: template.suggestedTone,
      language: 'english',
      audience: 'general',
      platformPosts: {} as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    };

    setActiveProject(newProj);
    saveSingleProject(newProj);
    setProjects(getStoredProjects());
    setCurrentTab('composer');
    addToast('success', `Loaded ${template.title}`, 'Ready in post composer.');
  };

  const handleSaveBrandKit = (updated: BrandKit) => {
    setBrandKit(updated);
    saveBrandKit(updated);
  };

  const handleToggleConnect = (platformId: PlatformId) => {
    const updated = connectedAccounts.map((acc) => {
      if (acc.platform === platformId) {
        return {
          ...acc,
          connected: !acc.connected,
          connectedAt: !acc.connected ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return acc;
    });
    setConnectedAccounts(updated);
    saveConnectedAccounts(updated);
  };

  const handleSaveSchedule = (newItems: ScheduledPostItem[]) => {
    const current = getStoredScheduledPosts();
    const updated = [...newItems, ...current];
    setScheduledPosts(updated);
    saveScheduledPosts(updated);
  };

  const handleRemoveScheduled = (id: string) => {
    const updated = scheduledPosts.filter((item) => item.id !== id);
    setScheduledPosts(updated);
    saveScheduledPosts(updated);
    addToast('info', 'Schedule Removed', 'Post cancelled from publishing calendar.');
  };

  return (
    <div className="min-h-screen bg-[#120809] text-[#F5EBE0] flex flex-col font-sans antialiased selection:bg-[#8B1E2D] selection:text-white">
      {/* Top Bar with 3-Zone Contract */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          if (tab === 'composer' && activeProject.sourceContent.length > 0 && currentTab !== 'composer') {
            // keep current active project
          }
          setCurrentTab(tab);
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSmartTools={() => setIsSmartToolsOpen(true)}
        onToggleLandingModal={() => setIsLandingModalOpen(true)}
        isAiLive={isAiLive}
      />

      {/* Main Workspace Frame: Viewport */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto">
        {/* Primary Content Viewport */}
        <main className="min-w-0 p-4 sm:p-6 md:p-8 lg:p-10 max-w-6xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              projects={projects}
              scheduledPosts={scheduledPosts}
              brandKit={brandKit}
              onNavigate={setCurrentTab}
              onSelectProject={handleSelectProject}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onUseTemplate={handleUseTemplate}
            />
          )}

          {currentTab === 'composer' && (
            <ComposerPage
              currentProject={activeProject}
              onUpdateProject={handleUpdateActiveProject}
              onGenerationComplete={() => setCurrentTab('results')}
              onNotify={addToast}
              brandKit={brandKit}
            />
          )}

          {currentTab === 'results' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#381B1E] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#E0A96D]">Campaign:</span>
                  <h2 className="text-sm font-bold text-[#FFF8F0] truncate max-w-md">
                    {activeProject.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentTab('composer')}
                    className="px-3 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] text-xs font-medium text-[#D4A373] border border-[#381B1E] transition-colors"
                  >
                    Edit Source Input
                  </button>
                  <button
                    onClick={handleCreateNewProject}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-white text-xs font-semibold shadow-md shadow-[#8B1E2D]/25 transition-colors"
                  >
                    + New Post
                  </button>
                </div>
              </div>

              <ResultsView
                project={activeProject}
                onUpdateProject={handleUpdateActiveProject}
                onOpenSchedule={(platform) => {
                  setScheduleTargetPlatform(platform);
                  setIsScheduleModalOpen(true);
                }}
                onNotify={addToast}
                brandKit={brandKit}
                onUpdateBrandKit={handleSaveBrandKit}
                onNavigate={setCurrentTab}
              />
            </div>
          )}

          {currentTab === 'pfp' && (
            <PfpGenerator
              brandKit={brandKit}
              onUpdateBrandKit={handleSaveBrandKit}
              onNotify={addToast}
            />
          )}

          {currentTab === 'story' && (
            <StoryMaker
              project={activeProject}
              brandKit={brandKit}
              onAttachStoryMedia={(dataUrl) => {
                handleUpdateActiveProject({
                  ...activeProject,
                  media: {
                    id: `story-${Date.now()}`,
                    url: dataUrl,
                    name: '9:16 Story Asset',
                    type: 'ai_generated',
                    aspectRatio: '9:16',
                  },
                });
                addToast('success', 'Story Attached', 'Story graphic linked to current social project.');
              }}
              onNotify={addToast}
            />
          )}

          {currentTab === 'post_options' && (
            <PostOptionsView
              project={activeProject}
              onUpdateProject={handleUpdateActiveProject}
              onNotify={addToast}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              scheduledPosts={scheduledPosts}
              onRemoveScheduled={handleRemoveScheduled}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'templates' && (
            <TemplatesView
              onSelectTemplate={handleUseTemplate}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'brandkit' && (
            <BrandKitView
              brandKit={brandKit}
              onSaveBrandKit={handleSaveBrandKit}
              onNotify={addToast}
            />
          )}

          {currentTab === 'integrations' && (
            <ConnectedAccountsView
              accounts={connectedAccounts}
              onToggleConnect={handleToggleConnect}
              onNotify={addToast}
            />
          )}

          {currentTab === 'history' && (
            <HistoryView
              projects={projects}
              onSelectProject={handleSelectProject}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onNotify={addToast}
            />
          )}
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenMore={() => setIsCommandPaletteOpen(true)}
      />

      {/* Command Palette Modal (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setCurrentTab}
        onSelectTemplate={handleUseTemplate}
        onOpenSmartTools={() => setIsSmartToolsOpen(true)}
      />

      {/* Smart Tools Modal */}
      <SmartToolsModal
        isOpen={isSmartToolsOpen}
        onClose={() => setIsSmartToolsOpen(false)}
        onInsertToComposer={(text) => {
          handleUpdateActiveProject({
            ...activeProject,
            sourceContent: activeProject.sourceContent ? `${activeProject.sourceContent}\n\n${text}` : text,
          });
          setCurrentTab('composer');
          addToast('success', 'Inserted Content', 'Added to composer source text.');
        }}
        onNotify={addToast}
      />

      {/* Scheduler Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        project={activeProject}
        defaultPlatform={scheduleTargetPlatform}
        onSaveSchedule={handleSaveSchedule}
        onNotify={addToast}
      />

      {/* Marketing / Product Overview Modal */}
      {isLandingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <LandingPage
            isModal={true}
            onClose={() => setIsLandingModalOpen(false)}
            onStartCreating={() => {
              setIsLandingModalOpen(false);
              setCurrentTab('composer');
            }}
          />
        </div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
