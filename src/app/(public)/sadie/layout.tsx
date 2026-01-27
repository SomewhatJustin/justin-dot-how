export default function SadieLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Headless layout - no header/footer
  return <>{children}</>
}
