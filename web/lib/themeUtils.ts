import { BusinessType, getThemeCSSVariables, getThemeClassName } from './businessDesigns';

/**
 * Apply theme CSS variables to a DOM element
 */
export const applyThemeVariables = (element: HTMLElement, businessType: BusinessType): void => {
    const cssVariables = getThemeCSSVariables(businessType);

    Object.entries(cssVariables).forEach(([property, value]) => {
        element.style.setProperty(property, value);
    });
};

/**
 * Apply theme class to a DOM element
 */
export const applyThemeClass = (element: HTMLElement, businessType: BusinessType): void => {
    // Remove all existing theme classes
    const existingThemeClasses = Array.from(element.classList).filter(className =>
        className.startsWith('theme-')
    );
    existingThemeClasses.forEach(className => element.classList.remove(className));

    // Add the new theme class
    const themeClassName = getThemeClassName(businessType);
    element.classList.add(themeClassName);
};

/**
 * Apply theme to the document root element
 */
export const applyGlobalTheme = (businessType: BusinessType): void => {
    const rootElement = document.documentElement;

    // Apply CSS variables to root
    applyThemeVariables(rootElement, businessType);

    // Apply theme class to body for component-specific styling
    const bodyElement = document.body;
    applyThemeClass(bodyElement, businessType);
};

/**
 * Remove all theme classes from an element
 */
export const removeThemeClasses = (element: HTMLElement): void => {
    const themeClasses = Array.from(element.classList).filter(className =>
        className.startsWith('theme-')
    );
    themeClasses.forEach(className => element.classList.remove(className));
};

/**
 * Get the current theme class from an element
 */
export const getCurrentThemeClass = (element: HTMLElement): string | null => {
    const themeClass = Array.from(element.classList).find(className =>
        className.startsWith('theme-')
    );
    return themeClass || null;
};

/**
 * Create a style object with theme CSS variables for React components
 */
export const createThemeStyleObject = (businessType: BusinessType): React.CSSProperties => {
    const cssVariables = getThemeCSSVariables(businessType);
    return cssVariables as React.CSSProperties;
};