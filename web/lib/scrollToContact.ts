/**
 * Smooth scroll to contact form section
 */
export const scrollToContact = (e?: React.MouseEvent) => {
  if (e) {
    e.preventDefault();
  }

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } else {
    // If contact section not found, navigate to home page with contact anchor
    const currentLocale = window.location.pathname.split('/')[1] || 'fr';
    window.location.href = `/${currentLocale}#contact`;
  }
};