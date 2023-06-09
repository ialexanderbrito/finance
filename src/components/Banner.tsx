interface BannerProps {
  img: string;
  title: string;
  color: string;
  onClick?: () => void;
}

export function Banner({ img, title, color, onClick }: BannerProps) {
  return (
    <div
      className={`relative flex h-56 min-w-[208px]  snap-center flex-col items-center justify-center  rounded-md md:w-full ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
      style={{ background: color }}
    >
      <div className="mt-4 flex h-full w-full flex-row items-center justify-center">
        <img src={img} alt={title} className="h-36 w-36" />
      </div>
      <div className="flex w-full flex-col items-start justify-between p-4">
        <span
          className={`text-xs text-backgroundDark dark:text-backgroundDark`}
        >
          {title}
        </span>
      </div>
    </div>
  );
}
