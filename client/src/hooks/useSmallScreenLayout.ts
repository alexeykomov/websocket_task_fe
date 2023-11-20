import { useEffect, useState } from 'react';

export const useMatchesMaxWidth = (maxWidth: number) => {
  const [matchWidth, setMatchWidth] = useState(
    window.matchMedia(`(max-width: ${maxWidth}px)`).matches
  );
  useEffect(() => {
    const listener = () => {
      const matchWidth = window.matchMedia(
        `(max-width: ${maxWidth}px)`
      ).matches;
      setMatchWidth(matchWidth);
    };
    window.addEventListener('resize', listener);
    listener();
    return () => {
      window.removeEventListener('resize', listener);
    };
  });
  return matchWidth;
};

export const useSmallScreenLayout = () => {
  // So that we see the same layout on iPad and desktop.
  const matches = useMatchesMaxWidth(610);
  return matches;
};

export const useMenuClosed = () => {
  const matches = useMatchesMaxWidth(800);
  return matches;
};
