import React, { useState, useRef, useEffect } from 'react';
import NotionIllustration from '../../../components/NotionIllustration';
import { 
  playKeystroke, 
  playBell, 
  playCarriageReturn, 
  setTypewriterAudioEnabled, 
  getTypewriterAudioEnabled 
} from '../../../utils/typewriterAudio';

const PRESET_MANUSCRIPTS = [
  {
    id: 'nocturne-1',
    title: 'Midnight Musings on Love',
    author: 'From Issue IV Nocturnes',
    text: `When the world sleeps, hearts speak their truest language.\nTonight I write about the love that exists in silence,\nin stolen glances, in the space between words\nthat say everything we cannot.\n\nEvery shadow in the room lengthens with memory.\nWe are made of all the quiet things we never said.`
  },
  {
    id: 'craft-1',
    title: 'The Weight of the First Sentence',
    author: 'On the Craft of Prose',
    text: `A typewriter does not forgive haste.\nEach metal hammer strikes paper with irreversible gravity.\nTo write at 2:00 AM is to strip language of ornament,\nuntil only bone and breath remain on the platen.\n\nListen: the cadence of the keys is the rhythm of your honest mind.`
  },
  {
    id: 'poetry-1',
    title: 'The Architecture of Silence',
    author: 'Reflections & Nocturnes',
    text: `Silence is not an empty room;\nit is an architectural sanctuary.\nBuild it with deliberate pauses,\nwith margins wide enough for the soul to inhale.\n\nThe ink dries slowly in the midnight air.`
  }
];

const TypewriterDesk = () => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [mode, setMode] = useState('interactive'); // 'interactive' | 'playback'
  const [typedContent, setTypedContent] = useState(
    `Type your midnight thought here...\n\nEvery keystroke strikes the ribbon. Listen to the mechanical cadence.`
  );
  const [ribbonColor, setRibbonColor] = useState('black'); // 'black' | 'red'
  const [selectedFont, setSelectedFont] = useState('font-typewriter'); // 'font-typewriter' | 'font-courier'
  const [autoText, setAutoText] = useState('');
  const [isTypingPreset, setIsTypingPreset] = useState(false);
  const textareaRef = useRef(null);

  // Sync initial sound state
  useEffect(() => {
    setTypewriterAudioEnabled(soundEnabled);
  }, [soundEnabled]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    setTypewriterAudioEnabled(nextState);
    if (nextState) {
      playBell();
    }
  };

  // Handle manual typing in interactive mode
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      playBell();
      setTimeout(() => playCarriageReturn(), 120);
    } else if (e.key === ' ') {
      playKeystroke('space');
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      playKeystroke('heavy');
    } else if (e.key.length === 1) {
      playKeystroke('normal');
    }
  };

  // Playback preset typing animation
  const startPresetPlayback = (presetIndex) => {
    setSelectedPreset(presetIndex);
    setMode('playback');
    setIsTypingPreset(true);
    setAutoText('');
    const targetText = PRESET_MANUSCRIPTS[presetIndex].text;
    let charIdx = 0;

    if (soundEnabled) {
      playCarriageReturn();
    }

    const interval = setInterval(() => {
      if (charIdx < targetText.length) {
        const char = targetText.charAt(charIdx);
        setAutoText((prev) => prev + char);
        charIdx++;

        if (char === '\n') {
          playBell();
        } else if (char === ' ') {
          playKeystroke('space');
        } else {
          playKeystroke('normal');
        }
      } else {
        clearInterval(interval);
        setIsTypingPreset(false);
        playBell();
      }
    }, 45);
  };

  const copyManuscript = () => {
    const textToCopy = mode === 'playback' ? autoText : typedContent;
    navigator.clipboard?.writeText(textToCopy);
    playBell();
  };

  return (
    <section className="relative w-full border-t border-b border-[#E0D9CE] bg-[#F3EFE8]/50 py-16 sm:py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 border-b border-[#E0D9CE] gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#9C6B3C] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#9C6B3C]">
                Interactive Craft · The Typewriter Desk
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal tracking-tight">
              Words Stamped in Real Time
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#78716C] leading-relaxed">
              Experience the tactile deliberate cadence of mid-century mechanical typing. 
              Turn on mechanical sound, choose ink ribbon color, and type your own midnight thoughts or listen to nocturnal stanzas.
            </p>
          </div>

          {/* Control Bar: Sound & Ribbon */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`inline-flex items-center gap-2 px-4 py-2 border text-xs font-mono tracking-wider transition-colors duration-200 ${
                soundEnabled 
                  ? 'border-[#9C6B3C] bg-[#9C6B3C] text-[#FDFCF9]' 
                  : 'border-[#E0D9CE] bg-white text-[#78716C] hover:border-[#1C1917]'
              }`}
              title="Toggle mechanical typing sound effects"
            >
              <span>{soundEnabled ? '🔔 Sound: ON' : '🔕 Sound: OFF'}</span>
            </button>

            {/* Bell Manual Strike */}
            <button
              onClick={() => {
                if (!soundEnabled) {
                  setSoundEnabled(true);
                  setTypewriterAudioEnabled(true);
                }
                playBell();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E0D9CE] bg-white text-xs font-mono text-[#78716C] hover:text-[#1C1917] hover:border-[#1C1917] transition-colors"
              title="Ring typewriter carriage bell"
            >
              <span>🔔 Ding!</span>
            </button>

            {/* Ink Ribbon Toggle */}
            <div className="flex items-center border border-[#E0D9CE] bg-white p-1 gap-1">
              <button
                onClick={() => {
                  setRibbonColor('black');
                  playKeystroke('heavy');
                }}
                className={`w-6 h-6 rounded-none flex items-center justify-center transition-all ${
                  ribbonColor === 'black' ? 'ring-2 ring-[#1C1917] bg-[#1C1917]' : 'bg-[#292524] opacity-40'
                }`}
                title="Black Ink Ribbon"
              />
              <button
                onClick={() => {
                  setRibbonColor('red');
                  playKeystroke('heavy');
                }}
                className={`w-6 h-6 rounded-none flex items-center justify-center transition-all ${
                  ribbonColor === 'red' ? 'ring-2 ring-[#B45309] bg-[#9C6B3C]' : 'bg-[#9C6B3C] opacity-40'
                }`}
                title="Terracotta Red Ribbon"
              />
            </div>

            {/* Font Toggle */}
            <div className="flex items-center border border-[#E0D9CE] bg-white text-xs font-mono">
              <button
                onClick={() => setSelectedFont('font-typewriter')}
                className={`px-3 py-2 ${selectedFont === 'font-typewriter' ? 'bg-[#1C1917] text-[#F8F5F0]' : 'text-[#78716C]'}`}
              >
                Special Elite
              </button>
              <button
                onClick={() => setSelectedFont('font-courier')}
                className={`px-3 py-2 ${selectedFont === 'font-courier' ? 'bg-[#1C1917] text-[#F8F5F0]' : 'text-[#78716C]'}`}
              >
                Courier Prime
              </button>
            </div>
          </div>
        </div>

        {/* Main Work Area: Left illustration/presets, Right live paper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10">
          
          {/* Left Column: Notion Illustration + Preset Selector */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-[#E0D9CE] bg-white p-6 space-y-4">
              <div className="w-full aspect-[4/3] bg-[#F8F5F0] overflow-hidden border border-[#EDE8E0]">
                <NotionIllustration name="typewriter-craft" aspect="w-full h-full" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#9C6B3C]">
                  Underwood No. 5 · Circa 1938
                </span>
                <h3 className="font-serif text-lg text-[#1C1917]">
                  The Physicality of the Inked Word
                </h3>
                <p className="font-sans text-xs text-[#78716C] leading-relaxed">
                  Before backspace keys and effortless erasure, every stroke was a permanent commitment to thought.
                </p>
              </div>
            </div>

            {/* Preset Stanzas */}
            <div className="border border-[#E0D9CE] bg-white p-5 space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#78716C] block">
                Load Nocturnal Stanzas
              </span>
              <div className="space-y-2">
                {PRESET_MANUSCRIPTS.map((preset, idx) => (
                  <button
                    key={preset.id}
                    onClick={() => startPresetPlayback(idx)}
                    className={`w-full text-left p-3 border transition-colors ${
                      mode === 'playback' && selectedPreset === idx 
                        ? 'border-[#9C6B3C] bg-[#F8F5F0]' 
                        : 'border-[#EDE8E0] hover:border-[#1C1917]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-serif font-medium text-[#1C1917]">{preset.title}</span>
                      <span className="font-mono text-[10px] text-[#9C6B3C]">{preset.author}</span>
                    </div>
                  </button>
                ))}

                <button
                  onClick={() => {
                    setMode('interactive');
                    setTimeout(() => textareaRef.current?.focus(), 50);
                  }}
                  className={`w-full text-center py-2.5 border font-mono text-xs tracking-wider transition-colors ${
                    mode === 'interactive'
                      ? 'border-[#1C1917] bg-[#1C1917] text-[#F8F5F0]'
                      : 'border-[#E0D9CE] hover:border-[#1C1917] text-[#1C1917]'
                  }`}
                >
                  ✎ Switch to Free Typing Desk
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: The Vintage Typewriter Paper Sheet */}
          <div className="lg:col-span-8">
            <div className="typewriter-paper relative p-8 sm:p-12 min-h-[520px] flex flex-col justify-between">
              
              {/* Paper Top Margin Rule & Mechanical Header */}
              <div className="flex items-center justify-between border-b border-[#E0D9CE]/70 pb-4 mb-6 font-mono text-[11px] text-[#78716C] select-none">
                <div className="flex items-center gap-3">
                  <span className="uppercase tracking-[0.2em]">MANUSCRIPT FOLIO · NO. 88</span>
                  <span className="text-[#C4A882]">|</span>
                  <span>MARGIN: 1.5 INCH</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${ribbonColor === 'red' ? 'bg-[#9C6B3C]' : 'bg-[#1C1917]'}`} />
                  <span className="uppercase tracking-wider">{ribbonColor === 'red' ? 'TERRACOTTA RIBBON' : 'BLACK CARBON RIBBON'}</span>
                </div>
              </div>

              {/* Typing Surface */}
              <div className="flex-1">
                {mode === 'interactive' ? (
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={typedContent}
                      onChange={(e) => setTypedContent(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={14}
                      spellCheck={false}
                      className={`w-full bg-transparent resize-none border-none outline-none ${selectedFont} ${
                        ribbonColor === 'red' ? 'text-[#9C6B3C]' : 'text-[#1C1917]'
                      } text-base sm:text-lg leading-[2.1] typewriter-ink tracking-wide focus:ring-0`}
                      placeholder="Start typing on your keyboard..."
                    />
                  </div>
                ) : (
                  <div className={`whitespace-pre-wrap ${selectedFont} ${
                    ribbonColor === 'red' ? 'text-[#9C6B3C]' : 'text-[#1C1917]'
                  } text-base sm:text-lg leading-[2.1] typewriter-ink tracking-wide min-h-[300px]`}>
                    {autoText}
                    {isTypingPreset && <span className="typewriter-cursor" />}
                  </div>
                )}
              </div>

              {/* Paper Footer Bar & Actions */}
              <div className="pt-8 mt-6 border-t border-[#E0D9CE]/70 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="text-[#78716C] flex items-center gap-2">
                  <span>Platen:</span>
                  <span className="text-[#1C1917]">
                    {mode === 'interactive' ? `${typedContent.length} characters stamped` : `${autoText.length} characters typed`}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {mode === 'interactive' && (
                    <button
                      onClick={() => {
                        setTypedContent('');
                        playCarriageReturn();
                      }}
                      className="px-3 py-1.5 border border-[#E0D9CE] hover:border-[#1C1917] text-[#78716C] hover:text-[#1C1917] transition-colors"
                    >
                      Clear Sheet
                    </button>
                  )}
                  <button
                    onClick={copyManuscript}
                    className="px-4 py-1.5 border border-[#1C1917] bg-[#1C1917] text-[#F8F5F0] hover:bg-[#9C6B3C] hover:border-[#9C6B3C] transition-colors"
                  >
                    Copy Manuscript
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TypewriterDesk;
