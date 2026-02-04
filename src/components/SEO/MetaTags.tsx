import { Helmet } from 'react-helmet-async';

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
  
  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl || siteUrl} />
      <meta property="og:site_name" content="MSW Agentic Lab" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@mswagenticlab" />
      
      {/* Article specific */}
      {ogType === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedAt && <meta property="article:published_time" content={publishedAt} />}
          {updatedAt && <meta property="article:modified_time" content={updatedAt} />}
          <meta property="article:section" content="Healthcare AI" />
        </>
      )}
      
      {/* Healthcare/Medical specific structured data */}
      {ogType === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description,
            author: author ? {
              '@type': 'Person',
              name: author,
            } : undefined,
            datePublished: publishedAt,
            dateModified: updatedAt,
            image: ogImage,
            url: canonicalUrl,
            publisher: {
              '@type': 'Organization',
              name: 'MSW Agentic Lab',
              url: siteUrl,
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl,
            },
            about: [
              'Healthcare AI',
              'Artificial Intelligence',
              'Medical Technology',
              'Clinical Applications',
            ],
          })}
        </script>
      )}
    </Helmet>
  );
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