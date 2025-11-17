'use client';

interface ScrollToRoadmapButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollToRoadmapButton({ children, className }: ScrollToRoadmapButtonProps) {
  const handleClick = () => {
    const element = document.querySelector('[data-roadmap-generator]');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

