import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SENTENCES, SentenceItem } from './data/sentences';
import {
  shuffleTokens,
  isSentenceCorrect,
  getNextCorrectToken,
  updateScore,
  loadSavedData,
  saveGameResult,
  StorageData,
  GameMode,
} from './game/logic';
import {
  playClickSound,
  playCorrectSound,
  playErrorSound,
  playFanfare,
  speakArabic,
} from './utils/audio';
import { triggerSentenceConfetti, triggerGrandVictoryConfetti } from './utils/confetti';
import { exportStandaloneHTML } from './utils/exportStandalone';
import { BoardHeader } from './components/BoardHeader';
import { SentenceCard } from './components/SentenceCard';
import { TokensArea } from './components/TokensArea';
import { ControlsBar } from './components/ControlsBar';
import { BrandBar } from './components/BrandBar';
import { OverlayModal } from './components/OverlayModal';
import { CertificateModal } from './components/CertificateModal';
import { ProgressChartModal } from './components/ProgressChartModal';

export default function App() {
  // Game Settings & Mode
  const [mode, setMode] = useState<GameMode>('challenge');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isChartOpen, setIsChartOpen] = useState<boolean>(false);

  // Filtered Sentences
  const activeSentences = useMemo(() => {
    if (!selectedCategory) return SENTENCES;
    return SENTENCES.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Game Progress State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedCount, setCompletedCount] = useState<number>(0);

  // Placed and Remaining Tokens
  const [placedTokens, setPlacedTokens] = useState<string[]>([]);
  const [remainingTokens, setRemainingTokens] = useState<Array<{ id: string; text: string }>>([]);

  // Feedback State
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const isCheckingRef = useRef(false);

  // Storage / History
  const [savedData, setSavedData] = useState<StorageData>(() => loadSavedData());

  // Modals
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [certificateStudentName, setCertificateStudentName] = useState<string>('');

  // 15-second Inactivity Hint State
  const [isHintVisible, setIsHintVisible] = useState<boolean>(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHintTimer = useCallback(() => {
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    setIsHintVisible(false);

    // Automatically trigger hint after 15 seconds of uncompleted attempt
    hintTimerRef.current = setTimeout(() => {
      setIsHintVisible(true);
    }, 15000);
  }, []);

  // Cleanup hint timer on unmount
  useEffect(() => {
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

  const currentSentence: SentenceItem = activeSentences[currentIndex] || activeSentences[0];

  // Initialize or reset sentence tokens
  const setupSentence = useCallback((sentence: SentenceItem) => {
    setPlacedTokens([]);
    setFeedbackStatus('idle');
    isCheckingRef.current = false;
    resetHintTimer();
    const shuffled = shuffleTokens(sentence.tokens);
    setRemainingTokens(
      shuffled.map((text, idx) => ({
        id: `${sentence.id}-${text}-${idx}-${Date.now()}-${Math.random()}`,
        text,
      }))
    );
  }, [resetHintTimer]);

  // Update sentence when current index or active list changes
  useEffect(() => {
    if (currentSentence) {
      setupSentence(currentSentence);
    }
  }, [currentIndex, currentSentence, setupSentence]);

  // Check URL params for testability: ?autostart=1 or ?hint=1
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        setIsRunning(true);
      }
      if (params.get('hint') === '1') {
        setIsHintVisible(true);
      }
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    if (!isRunning || mode !== 'challenge') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          setIsOverlayOpen(true);
          playFanfare(soundEnabled);
          triggerGrandVictoryConfetti();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode, soundEnabled]);

  // Token Placement Handler
  const handleSelectToken = (tokenItem: { id: string; text: string }) => {
    if (isCheckingRef.current) return;
    playClickSound(soundEnabled);

    const nextPlaced = [...placedTokens, tokenItem.text];
    const nextRemaining = remainingTokens.filter((item) => item.id !== tokenItem.id);

    setPlacedTokens(nextPlaced);
    setRemainingTokens(nextRemaining);

    // Auto-check when all tokens are placed
    if (nextPlaced.length === currentSentence.tokens.length) {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
        hintTimerRef.current = null;
      }
      setIsHintVisible(false);
      isCheckingRef.current = true;
      const isCorrect = isSentenceCorrect(nextPlaced, currentSentence.tokens);

      if (isCorrect) {
        setFeedbackStatus('correct');
        triggerSentenceConfetti();
        playCorrectSound(soundEnabled);
        speakArabic(currentSentence.tashkeelFull, soundEnabled);
        const newScore = updateScore(score, true);
        setScore(newScore);
        const newCompleted = completedCount + 1;
        setCompletedCount(newCompleted);

        setTimeout(() => {
          if (currentIndex < activeSentences.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          } else {
            // Completed all sentences in the category/game!
            setIsRunning(false);
            setIsOverlayOpen(true);
            playFanfare(soundEnabled);
            triggerGrandVictoryConfetti();
            const updatedData = saveGameResult('بَطَلُ الْقِرَاءَةِ', newScore, mode, newCompleted);
            setSavedData(updatedData);
          }
        }, 850);
      } else {
        setFeedbackStatus('wrong');
        playErrorSound(soundEnabled);
        setScore((prev) => updateScore(prev, false));

        setTimeout(() => {
          setFeedbackStatus('idle');
          setupSentence(currentSentence);
        }, 950);
      }
    } else {
      // Incomplete placement: reset 15-second timer for the next word
      resetHintTimer();
    }
  };

  // Remove placed token (Return back to pool)
  const handleRemoveToken = (indexToRemove: number) => {
    if (isCheckingRef.current) return;
    playClickSound(soundEnabled);
    resetHintTimer();

    const tokenText = placedTokens[indexToRemove];
    const nextPlaced = placedTokens.filter((_, idx) => idx !== indexToRemove);

    setPlacedTokens(nextPlaced);
    setRemainingTokens((prev) => [
      ...prev,
      {
        id: `${currentSentence.id}-${tokenText}-${Date.now()}-${Math.random()}`,
        text: tokenText,
      },
    ]);
  };

  // Controls Handlers
  const handleTogglePlay = () => {
    playClickSound(soundEnabled);
    if (!isRunning && timeLeft === 0 && mode === 'challenge') {
      // restart timer
      setTimeLeft(90);
      setScore(0);
      setCompletedCount(0);
      setCurrentIndex(0);
    }
    setIsRunning((prev) => !prev);
  };

  const handleResetSentence = () => {
    playClickSound(soundEnabled);
    setupSentence(currentSentence);
  };

  const handleSkipSentence = () => {
    playClickSound(soundEnabled);
    if (currentIndex < activeSentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevSentence = () => {
    playClickSound(soundEnabled);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextSentence = () => {
    playClickSound(soundEnabled);
    if (currentIndex < activeSentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleChangeMode = (newMode: GameMode) => {
    playClickSound(soundEnabled);
    setMode(newMode);
    if (newMode === 'accuracy') {
      setIsRunning(true); // open time challenge is active immediately
    } else if (newMode === 'challenge') {
      setIsRunning(false);
      setTimeLeft(90);
    } else {
      setIsRunning(false);
    }
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleSelectCategory = (cat: string | null) => {
    playClickSound(soundEnabled);
    setSelectedCategory(cat);
    setCurrentIndex(0);
  };

  const handleSpeakSentence = () => {
    speakArabic(currentSentence.tashkeelFull, true);
  };

  const handleRestartGame = () => {
    playClickSound(soundEnabled);
    setScore(0);
    setCompletedCount(0);
    setTimeLeft(90);
    setCurrentIndex(0);
    setIsOverlayOpen(false);
    setIsRunning(mode !== 'practice');
    setupSentence(activeSentences[0]);
  };

  const handleOpenCertificate = (studentName: string) => {
    const finalName = studentName.trim() || 'بَطَلُ الْقِرَاءَةِ';
    setCertificateStudentName(finalName);
    const updated = saveGameResult(finalName, score, mode, completedCount);
    setSavedData(updated);
    setIsOverlayOpen(false);
    setIsCertificateOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0891b2] via-[#0e7490] to-[#3f6212] py-4 md:py-8 px-3 md:px-6 flex flex-col items-center justify-between selection:bg-amber-400 selection:text-amber-950 transition-colors">
      {/* Centered Board Card matching ratio */}
      <main className="w-full max-w-4xl flex flex-col items-center">
        {/* Top Header with Stats and Controls */}
        <BoardHeader
          score={score}
          highScore={savedData.highScore}
          timeLeft={timeLeft}
          mode={mode}
          currentIndex={currentIndex}
          totalSentences={activeSentences.length}
          soundEnabled={soundEnabled}
          selectedCategory={selectedCategory}
          onToggleSound={handleToggleSound}
          onChangeMode={handleChangeMode}
          onSelectCategory={handleSelectCategory}
          onExportStandalone={exportStandaloneHTML}
          onOpenChart={() => setIsChartOpen(true)}
        />

        {/* Sentence Target Card */}
        {currentSentence && (
          <SentenceCard
            sentence={currentSentence}
            placedTokens={placedTokens}
            feedbackStatus={feedbackStatus}
            onRemoveToken={handleRemoveToken}
            onSpeakSentence={handleSpeakSentence}
          />
        )}

        {/* Tokens Bank */}
        <TokensArea
          remainingTokens={remainingTokens}
          onSelectToken={handleSelectToken}
          disabled={feedbackStatus !== 'idle'}
          hintToken={isHintVisible && currentSentence ? getNextCorrectToken(placedTokens, currentSentence.tokens) : null}
        />

        {/* Main Controls Bar */}
        <ControlsBar
          isRunning={isRunning}
          mode={mode}
          onTogglePlay={handleTogglePlay}
          onResetSentence={handleResetSentence}
          onSkipSentence={handleSkipSentence}
          onPrevSentence={handlePrevSentence}
          onNextSentence={handleNextSentence}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < activeSentences.length - 1}
        />

        {/* Brand Bar */}
        <BrandBar />
      </main>

      {/* Result Overlay Modal */}
      <OverlayModal
        score={score}
        completedSentences={completedCount}
        mode={mode}
        savedData={savedData}
        isOpen={isOverlayOpen}
        onRestart={handleRestartGame}
        onOpenCertificate={handleOpenCertificate}
        onOpenChart={() => setIsChartOpen(true)}
      />

      {/* Certificate Modal for Student Recognition */}
      <CertificateModal
        studentName={certificateStudentName}
        score={score}
        completedSentences={completedCount}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      {/* Reading Progress Evolution Chart Modal (Recharts) */}
      <ProgressChartModal
        isOpen={isChartOpen}
        onClose={() => setIsChartOpen(false)}
        savedData={savedData}
        onUpdateSavedData={setSavedData}
      />
    </div>
  );
}
