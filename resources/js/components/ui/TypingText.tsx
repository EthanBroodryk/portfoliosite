import { useState, useEffect } from "react";

interface TypingTextProps {
  text: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  className?: string;
  cursorClassName?: string;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
}

export default function TypingText({
  text,
  typingSpeed = 75,
  pauseDuration = 1500,
  showCursor = true,
  className,
  cursorClassName,
  textColors,
  variableSpeed,
}: TypingTextProps) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typingForward, setTypingForward] = useState(true);

  useEffect(() => {
    const color = textColors ? textColors[currentIndex % textColors.length] : "inherit";
    const speed = variableSpeed
      ? Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min
      : typingSpeed;

    const timeout = setTimeout(() => {
      if (typingForward) {
        setCurrentText(text[currentIndex].slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
        if (charIndex + 1 === text[currentIndex].length) {
          setTypingForward(false);
          setTimeout(() => setTypingForward(false), pauseDuration);
        }
      } else {
        setCurrentText(text[currentIndex]);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % text.length);
          setCharIndex(0);
          setTypingForward(true);
        }, pauseDuration);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, currentIndex, typingForward, pauseDuration, text, typingSpeed, textColors, variableSpeed]);

  return (
    <span className={className} style={{ color: textColors ? textColors[currentIndex % textColors.length] : undefined }}>
      {currentText}
      {showCursor && <span className={cursorClassName}>|</span>}
    </span>
  );
}
