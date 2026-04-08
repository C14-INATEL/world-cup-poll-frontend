export function DividedLayout({
  children,
  leftContent,
}: {
  children: React.ReactNode;
  leftContent?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-dvh">
      {leftContent && <section className="hidden md:block">{leftContent}</section>}

      <section>{children}</section>
    </div>
  );
}
