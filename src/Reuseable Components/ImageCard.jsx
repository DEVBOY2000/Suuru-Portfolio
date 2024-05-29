import { LazyLoadImage } from "react-lazy-load-image-component";

const ImageCard = ({ src }) => {
  return (
    <LazyLoadImage
      effect="blur"
      alt="img"
      src={src}
      className="h-full object-cover w-full object-top"
      height="100%"
      width="100%"
      loading="lazy"
    />
  );
};

export default ImageCard;
