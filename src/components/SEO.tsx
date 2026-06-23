import { Helmet } from "react-helmet-async";

const SITE_URL = "https://adchefs.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SEOProps {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  jsonLd?: object | object[];
  ogType?: string;
  ogImage?: string;
}

export default function SEO({
  title,
  description,
  path,
  noindex = false,
  jsonLd,
  ogType = "website",
  ogImage,
}: SEOProps) {
  const url = `${SITE_URL}${path}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}