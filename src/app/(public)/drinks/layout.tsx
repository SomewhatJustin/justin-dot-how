export default function DrinksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        fontFamily: "'Comic Neue', cursive",
        background: "linear-gradient(45deg, #00BFFF, #FF69B4)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 0,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  )
}
