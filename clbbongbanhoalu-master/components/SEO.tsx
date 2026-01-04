
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: string;
    schema?: object;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType = 'website',
    schema
}) => {
    const location = useLocation();
    const siteName = 'CLB Bóng Bàn Hoa Lư';
    const baseUrl = 'https://clbbongbanhoalu.netlify.app';
    const fullTitle = `${title} | ${siteName}`;

    useEffect(() => {
        // Update Title
        document.title = fullTitle;

        // Helper to update or create meta tags
        const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
            let element = document.querySelector(`meta[${attr}="${name}"]`);
            if (element) {
                element.setAttribute('content', content);
            } else {
                element = document.createElement('meta');
                element.setAttribute(attr, name);
                element.setAttribute('content', content);
                document.head.appendChild(element);
            }
        };

        // Standard Meta Tags
        updateMeta('description', description);
        if (keywords) updateMeta('keywords', keywords);

        // Open Graph
        updateMeta('og:title', fullTitle, 'property');
        updateMeta('og:description', description, 'property');
        updateMeta('og:type', ogType, 'property');
        updateMeta('og:url', baseUrl + location.pathname, 'property');
        if (ogImage) updateMeta('og:image', ogImage, 'property');

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', fullTitle);
        updateMeta('twitter:description', description);
        if (ogImage) updateMeta('twitter:image', ogImage);

        // Canonical Link
        const canonicalUrl = canonical || (baseUrl + location.pathname);
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (linkCanonical) {
            linkCanonical.setAttribute('href', canonicalUrl);
        } else {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            linkCanonical.setAttribute('href', canonicalUrl);
            document.head.appendChild(linkCanonical);
        }

        // Schema JSON-LD
        const existingSchema = document.getElementById('json-ld-schema');
        if (existingSchema) existingSchema.remove();

        if (schema) {
            const script = document.createElement('script');
            script.id = 'json-ld-schema';
            script.type = 'application/ld+json';
            script.text = JSON.stringify(schema);
            document.head.appendChild(script);
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }, [fullTitle, description, keywords, canonical, ogImage, ogType, schema, location]);

    return null;
};

export default SEO;
