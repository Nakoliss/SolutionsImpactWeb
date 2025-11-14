/**
 * Smooth scroll to contact form section with linear easing and consistent speed
 */
const smoothScrollTo = (element: HTMLElement, speed: number = 2200) => {
  const start = window.pageYOffset;
  const target = element.getBoundingClientRect().top + window.pageYOffset - 80; // 80px offset for header
  const distance = Math.abs(target - start); // Absolute distance in pixels
  const duration = (distance / speed) * 1000; // Duration in milliseconds based on distance and speed
  let startTime: number | null = null;

  // Linear easing function - constant speed throughout (no acceleration/deceleration)
  const linearEase = (t: number): number => {
    return t; // Linear progression - constant speed
  };

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = linearEase(progress);

    // This formula works identically for both scroll up and scroll down
    // When distance is negative (scroll up), we subtract; when positive (scroll down), we add
    window.scrollTo(0, start + (target - start) * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

export const scrollToContact = (e?: React.MouseEvent) => {
  if (e) {
    e.preventDefault();
  }

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    smoothScrollTo(contactSection, 2200); // 2200 pixels per second - constant scroll speed (same as nav buttons)
  } else {
    // If contact section not found, navigate to home page with contact anchor
    const currentLocale = window.location.pathname.split('/')[1] || 'fr';
    window.location.href = `/${currentLocale}#contact`;
  }
};