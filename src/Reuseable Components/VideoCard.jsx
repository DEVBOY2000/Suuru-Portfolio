const VideoCard = (props) => {
  return (
    <video
      muted
      loop
      playsInline
      loading="lazy"
      className="h-full object-cover w-full object-top"
      {...props}
    >
      <source type="video/mp4" src={props?.src}></source>
    </video>
  );
};

export default VideoCard;
