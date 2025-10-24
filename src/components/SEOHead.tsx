import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  serviceName?: string;
  serviceDescription?: string;
}

const SEOHead = ({ 
  title, 
  description, 
  image, 
  url,
  type = "website",
  serviceName,
  serviceDescription 
}: SEOHeadProps) => {
  const siteUrl = window.location.origin;
  const fullUrl = url || window.location.href;
  const ogImage = image?.startsWith('http') 
    ? image 
    : `${siteUrl}${image || '/og-aramex.jpg'}`;
  
  const finalTitle = serviceName ? `${serviceName} - ${title}` : title;
  const finalDescription = serviceDescription || description;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      
      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:site_name" content="نظام الدفع الآمن" />
      <meta property="og:locale" content="ar_AR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={finalTitle} />
      
      {/* LinkedIn */}
      <meta property="linkedin:owner" content="" />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Arabic" />
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default SEOHead;
