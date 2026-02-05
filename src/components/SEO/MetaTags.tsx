import { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

export function MetaTags({
  title,
  description,
  keywords,
  ogImage = 'https://mswagenticlab.netlify.app/og-default.jpg',
  ogType = 'website',
  canonicalUrl,
  author,
  publishedAt,
  updatedAt,
  twitterCard = 'summary_large_image',
  noIndex = false,
}: MetaTagsProps) {
  const siteUrl = 'https://mswagenticlab.netlify.app';
  const fullTitle = title.includes('MSW Agentic Lab') ? title : `${title} | MSW Agentic Lab`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Basic Meta
    setMeta('name', 'description', description);
    if (keywords) setMeta('name', 'keywords', keywords);
    if (author) setMeta('name', 'author', author);

    // Robots
    if (noIndex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      removeMeta('name', 'robots');
    }

    // Canonical URL
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalUrl) {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.rel = 'canonical';
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.href = canonicalUrl;
    } else {
      canonicalEl?.remove();
    }

    // Open Graph
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:url', canonicalUrl || siteUrl);
    setMeta('property', 'og:site_name', 'MSW Agentic Lab');

    // Twitter Card
    setMeta('name', 'twitter:card', twitterCard);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);
    setMeta('name', 'twitter:creator', '@mswagenticlab');

    // Article specific
    if (ogType === 'article') {
      if (author) setMeta('property', 'article:author', author);
      if (publishedAt) setMeta('property', 'article:published_time', publishedAt);
      if (updatedAt) setMeta('property', 'article:modified_time', updatedAt);
      setMeta('property', 'article:section', 'Healthcare AI');
    } else {
      removeMeta('property', 'article:author');
      removeMeta('property', 'article:published_time');
      removeMeta('property', 'article:modified_time');
      removeMeta('property', 'article:section');
    }

    // Structured data (JSON-LD)
    const existingScript = document.querySelector('script[data-metatags-jsonld]');
    if (ogType === 'article') {
      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        author: author ? { '@type': 'Person', name: author } : undefined,
        datePublished: publishedAt,
        dateModified: updatedAt,
        image: ogImage,
        url: canonicalUrl,
        publisher: {
          '@type': 'Organization',
          name: 'MSW Agentic Lab',
          url: siteUrl,
          logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        about: [
          'Healthcare AI',
          'Artificial Intelligence',
          'Medical Technology',
          'Clinical Applications',
        ],
      });
      if (existingScript) {
        existingScript.textContent = jsonLd;
      } else {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-metatags-jsonld', '');
        script.textContent = jsonLd;
        document.head.appendChild(script);
      }
    } else {
      existingScript?.remove();
    }

    // Cleanup on unmount
    return () => {
      removeMeta('name', 'keywords');
      removeMeta('name', 'author');
      removeMeta('name', 'robots');
      document.querySelector('link[rel="canonical"]')?.remove();
      removeMeta('property', 'article:author');
      removeMeta('property', 'article:published_time');
      removeMeta('property', 'article:modified_time');
      removeMeta('property', 'article:section');
      document.querySelector('script[data-metatags-jsonld]')?.remove();
    };
  }, [fullTitle, description, keywords, ogImage, ogType, canonicalUrl, author, publishedAt, updatedAt, twitterCard, noIndex, title, siteUrl]);

  return null;
}

// Helper function to generate blog post meta
export function generateBlogMetaTags(post: {
  title: string;
  excerpt: string;
  author: { name: string };
  publishedAt: string;
  updatedAt: string;
  slug: string;
  tags: string[];
  coverImage?: string;
  metaDescription?: string;
  keywords?: string[];
}) {
  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    keywords: (post.keywords || post.tags).join(', '),
    ogImage: post.coverImage,
    ogType: 'article' as const,
    canonicalUrl: `https://mswagenticlab.netlify.app/blog/${post.slug}`,
    author: post.author.name,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    twitterCard: 'summary_large_image' as const,
  };
}
