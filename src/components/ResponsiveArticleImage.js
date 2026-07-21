const ResponsiveArticleImage = ({
  src,
  variants,
  alt,
  className = "object-cover",
  priority = false,
}) => {
  const desktop = variants?.desktop || src;
  const tablet = variants?.tablet || desktop;
  const mobile = variants?.mobile || tablet;

  return (
    <picture className="absolute inset-0 block h-full w-full">
      <source media="(max-width: 640px)" srcSet={mobile} />
      <source media="(max-width: 1024px)" srcSet={tablet} />
      {/* Cloudinary variants are already resized and optimized. */}
      <img
        src={desktop}
        alt={alt || "Article image"}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`h-full w-full ${className}`}
      />
    </picture>
  );
};

export default ResponsiveArticleImage;
