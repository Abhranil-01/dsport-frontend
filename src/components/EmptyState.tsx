import Image from "next/image";

export default function EmptyState({
  title,
  description,
  imageSrc,
}: {
  title: string;
  description: string;
  imageSrc: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Image
        src={imageSrc}
        alt="No data"
        width={250}
        height={250}
        className="opacity-90"
      />
      <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-muted-foreground max-w-md">
        {description}
      </p>
    </div>
  );
}
