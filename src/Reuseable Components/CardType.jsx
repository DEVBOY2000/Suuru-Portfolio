const CardType = ({ text }) => {
  return (
    <div
      className={`absolute top-[10px] right-[10px] z-10 bg-black/60 px-2 uppercase text-sm text-white`}
    >
      {text}
    </div>
  );
};

export default CardType;
