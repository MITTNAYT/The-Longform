import React, { useState, useEffect, useRef } from 'react';
import { playKeystroke, getTypewriterAudioEnabled } from '../utils/typewriterAudio';

/**
 * TypewriterText Component
 * Types out one or multiple strings with authentic mechanical typewriter pacing,
 * optional keystroke sounds via Web Audio API, and classic cursor effects.
 */
const TypewriterText = ({
  words = [],
  text = '',
  speed = 45,
  deleteSpeed = 22,
  pauseDelay = 3200,
  loop = true,
  enableSound = false,
  cursorType = 'block', // 'block' | 'bar' | 'underscore'
  className = '',
  fontFamily = 'font-typewriter', // 'font-typewriter' | 'font-courier' | 'font-mono'
  inkEffect = true,
  onFinish = null
}) => {
  const phraseList = words.length > 0 ? words : [text];
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!phraseList.length || !phraseList[0]) return;

    const currentWord = phraseList[wordIndex % phraseList.length];

    if (isPaused) return;

    const handleTyping = () => {
      if (isDeleting) {
        // Deleting characters
        setDisplayText((prev) => {
          const next = prev.substring(0, prev.length - 1);
          if (enableSound || getTypewriterAudioEnabled()) {
            playKeystroke('heavy');
          }
          return next;
        });

        if (displayText.length <= 1) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % phraseList.length);
          timerRef.current = setTimeout(() => {}, 400);
        }
      } else {
        // Typing next character
        const nextChar = currentWord.charAt(displayText.length);
        setDisplayText((prev) => prev + nextChar);

        // Play authentic mechanical sound
        if (enableSound || getTypewriterAudioEnabled()) {
          const variant = nextChar === ' ' ? 'space' : 'normal';
          playKeystroke(variant);
        }

        // Check if finished current phrase
        if (displayText.length + 1 >= currentWord.length) {
          if (loop && phraseList.length > 1) {
            setIsPaused(true);
            timerRef.current = setTimeout(() => {
              setIsPaused(false);
              setIsDeleting(true);
            }, pauseDelay);
          } else {
            if (onFinish) onFinish();
          }
        }
      }
    };

    // Calculate natural human typing interval
    let delay = isDeleting ? deleteSpeed : speed;
    const lastChar = displayText.slice(-1);
    // Add natural human hesitation on punctuation
    if (!isDeleting && (lastChar === '.' || lastChar === '?' || lastChar === '!')) {
      delay += 380;
    } else if (!isDeleting && (lastChar === ',' || lastChar === ';' || lastChar === '—')) {
      delay += 200;
    } else if (!isDeleting) {
      // Subtle organic jitter (±12ms)
      delay += Math.floor(Math.random() * 24 - 12);
    }

    timerRef.current = setTimeout(handleTyping, Math.max(15, delay));

    return () => clearTimeout(timerRef.current);
  }, [displayText, isDeleting, isPaused, wordIndex, phraseList, speed, deleteSpeed, pauseDelay, loop, enableSound, onFinish]);

  const renderCursor = () => {
    switch (cursorType) {
      case 'bar':
        return <span className="typewriter-cursor-bar" aria-hidden="true" />;
      case 'underscore':
        return <span className="font-mono font-bold animate-pulse" aria-hidden="true">_</span>;
      case 'block':
      default:
        return <span className="typewriter-cursor" aria-hidden="true" />;
    }
  };

  return (
    <span className={`inline ${fontFamily} ${inkEffect ? 'typewriter-ink' : ''} ${className}`}>
      <span>{displayText}</span>
      {renderCursor()}
    </span>
  );
};

export default TypewriterText;
