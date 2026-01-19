// Google Analytics 4 tracking utilities

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 measurement ID

// Track page views
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined event tracking functions
export const trackProjectView = (projectId: string, projectTitle: string) => {
  event({
    action: 'view_project',
    category: 'Projects',
    label: `${projectId}: ${projectTitle}`,
  });
};

export const trackROICalculation = (
  projectSize: string,
  aiEfficiency: number,
  totalSavings: number
) => {
  event({
    action: 'calculate_roi',
    category: 'ROI Calculator',
    label: `Size: ${projectSize}, Efficiency: ${aiEfficiency}%`,
    value: Math.round(totalSavings),
  });
};

export const trackCTAClick = (ctaLocation: string, ctaText: string) => {
  event({
    action: 'cta_click',
    category: 'Engagement',
    label: `${ctaLocation}: ${ctaText}`,
  });
};

export const trackGitHubClick = (projectId: string) => {
  event({
    action: 'github_click',
    category: 'External Links',
    label: projectId,
  });
};

export const trackContactFormSubmit = () => {
  event({
    action: 'form_submit',
    category: 'Contact',
    label: 'Contact Form',
  });
};

export const trackNavigationClick = (linkName: string) => {
  event({
    action: 'navigation_click',
    category: 'Navigation',
    label: linkName,
  });
};
