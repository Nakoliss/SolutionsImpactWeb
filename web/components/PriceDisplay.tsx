import { Fragment } from 'react';

/**
 * Renders price text with smart wrapping: keeps amounts with "/MO" (or variations) together on one line
 * while allowing the rest of the text to wrap normally.
 */
interface PriceDisplayProps {
  children: string;
  className?: string;
  'aria-label'?: string;
}

export function PriceDisplay({ 
  children, 
  className = '',
  'aria-label': ariaLabel,
}: PriceDisplayProps) {
  // Pattern to match: number (with spaces), optional $, optional space, then /MO or /MOIS (case insensitive)
  // Examples: "4 000$/MO", "4 000 $/MO", "800 $/mo", "1 200$/MOIS"
  const pattern = /(\d+(?:\s+\d+)*\s*\$?\s*\/MO(?:IS)?)/gi;
  
  const parts: Array<{ text: string; keepTogether: boolean }> = [];
  let lastIndex = 0;
  let match;

  // Find all matches and split the text
  while ((match = pattern.exec(children)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ text: children.slice(lastIndex, match.index), keepTogether: false });
    }
    // Add the matched amount + /MO part (keep together)
    parts.push({ text: match[1], keepTogether: true });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < children.length) {
    parts.push({ text: children.slice(lastIndex), keepTogether: false });
  }

  // If no matches found, return original text
  if (parts.length === 0) {
    return (
      <span className={className} aria-label={ariaLabel}>
        {children}
      </span>
    );
  }

  return (
    <span className={className} aria-label={ariaLabel}>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part.keepTogether ? (
            <span className="whitespace-nowrap">{part.text}</span>
          ) : (
            part.text
          )}
        </Fragment>
      ))}
    </span>
  );
}

