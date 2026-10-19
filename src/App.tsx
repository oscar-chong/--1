import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, StageId, PlayerStats, Question } from './game/types.ts';
import { ALL_QUESTIONS, STAGE_CONFIGS } from './game/questions.ts';
import { soundEngine } from './game/audio.ts';
import GameCanvasBackground from './components/GameCanvasBackground.tsx';
import TitleScreen from './components/TitleScreen.tsx';
import PlayScreen from './components/PlayScreen.tsx';
import PauseModal from './components/PauseModal.tsx';
import ResultModal from './components/ResultModal.tsx';
import InteractiveLab from './components/InteractiveLab.tsx';
import RevisionCodex from './components/RevisionCodex.tsx';

type SystemState = 'title' | 'playing' | 'paused' | 'gameover' | 'lab' | 'codex';

export default function App() {
  const [systemState, setSystemState] = useState<SystemState>('title');
  const [gameMode, setGameMode] = useState<GameMode>('quest');
  const [currentStageId, setCurrentStageId] = useState<StageId>('stage-respiratory-digestive');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);
  const [lastStats, setLastStats] = useState<PlayerStats | null>(null);

  // Sync state with body dataset for testing & styling
  useEffect(() => {
    let bodyState = 'title';
    if (systemState === 'playing') bodyState = 'playing';
    else if (systemState === 'paused') bodyState = 'paused';
    else if (systemState === 'gameover') bodyState = 'gameover';
    else if (systemState === 'lab' || systemState === 'codex') bodyState = 'playing';

    document.body.dataset.state = bodyState;
  }, [systemState]);

  // Read high score from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hk_body_safety_highscore');
      if (stored) {
        setHighScore(parseInt(stored, 10) || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveHighScore = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('hk_body_safety_highscore', score.toString());
      } catch {
        // ignore
      }
    }
  };

  // Sound toggle
  const handleToggleMute = useCallback(() => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  }, []);

  // Start Quest Mode
  const startQuest = useCallback((stageId: StageId) => {
    setCurrentStageId(stageId);
    setGameMode('quest');
    setSystemState('playing');
    soundEngine.playStart();
  }, []);

  // Start Blitz Mode
  const startBlitz = useCallback(() => {
    setGameMode('blitz');
    setSystemState('playing');
    soundEngine.playStart();
  }, []);

  // Support ?autostart=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      startQuest('stage-respiratory-digestive');
    }
  }, [startQuest]);

  // Keyboard start from title screen (Enter or Space)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (systemState === 'title') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startQuest('stage-respiratory-digestive');
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [systemState, startQuest]);

  // Handle game finish
  const handleFinish = useCallback((finalStats: PlayerStats) => {
    setLastStats(finalStats);
    saveHighScore(finalStats.score);
    setSystemState('gameover');
    if (finalStats.correctCount > 0) {
      soundEngine.playFanfare();
    }
  }, [highScore]);

  // Restart current run
  const handleRestart = useCallback(() => {
    setSystemState('playing');
    soundEngine.playStart();
  }, []);

  // Advance to next stage in Quest Mode
  const handleNextStage = () => {
    const currentIndex = STAGE_CONFIGS.findIndex((s) => s.id === currentStageId);
    if (currentIndex >= 0 && currentIndex < STAGE_CONFIGS.length - 1) {
      const nextStage = STAGE_CONFIGS[currentIndex + 1];
      startQuest(nextStage.id);
    } else {
      // Completed all stages! Loop or return to title
      setSystemState('title');
    }
  };

  // Get active questions based on mode and stage
  const getActiveQuestions = (): Question[] => {
    if (gameMode === 'blitz') {
      // Shuffle all questions for blitz
      return [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
    }
    // Return questions for current stage
    const filtered = ALL_QUESTIONS.filter((q) => q.stageId === currentStageId);
    return filtered.length > 0 ? filtered : ALL_QUESTIONS;
  };

  const activeQuestions = getActiveQuestions();
  const currentStageConfig = STAGE_CONFIGS.find((s) => s.id === currentStageId);

  // Background atmosphere state
  const bgMode = systemState === 'gameover' ? 'danger' : systemState === 'playing' ? 'exciting' : 'calm';

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans antialiased overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Interactive Living Canvas */}
      <GameCanvasBackground mode={bgMode} />

      {/* Screen 1: Title Screen */}
      {systemState === 'title' && (
        <TitleScreen
          onStartQuest={startQuest}
          onStartBlitz={startBlitz}
          onOpenLab={() => setSystemState('lab')}
          onOpenCodex={() => setSystemState('codex')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          highScore={highScore}
        />
      )}

      {/* Screen 2: Playing HUD & Simulation */}
      {(systemState === 'playing' || systemState === 'paused') && (
        <PlayScreen
          key={`${gameMode}-${currentStageId}`}
          mode={gameMode}
          stageConfig={currentStageConfig}
          questions={activeQuestions}
          onPause={() => setSystemState('paused')}
          onFinish={handleFinish}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onRestart={handleRestart}
        />
      )}

      {/* Screen 3: Interactive Simulation Lab */}
      {systemState === 'lab' && (
        <InteractiveLab
          onBack={() => setSystemState('title')}
          onAddScore={(points) => {
            setHighScore((prev) => {
              const updated = prev + points;
              saveHighScore(updated);
              return updated;
            });
          }}
        />
      )}

      {/* Screen 4: Revision Codex */}
      {systemState === 'codex' && (
        <RevisionCodex onBack={() => setSystemState('title')} />
      )}

      {/* Modal: Paused State */}
      {systemState === 'paused' && (
        <PauseModal
          onResume={() => setSystemState('playing')}
          onRestart={handleRestart}
          onTitle={() => setSystemState('title')}
        />
      )}

      {/* Modal: Game Over / Victory State */}
      {systemState === 'gameover' && lastStats && (
        <ResultModal
          stats={lastStats}
          questions={activeQuestions}
          onPlayAgain={handleRestart}
          onNextStage={
            gameMode === 'quest' &&
            STAGE_CONFIGS.findIndex((s) => s.id === currentStageId) < STAGE_CONFIGS.length - 1
              ? handleNextStage
              : undefined
          }
          onTitle={() => setSystemState('title')}
        />
      )}
    </div>
  );
}
