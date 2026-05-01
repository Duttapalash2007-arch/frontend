export default function SplashLoader() {
  return (
    <div className="splash-loader">
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
      <div className="splash-loader__spinner" />
      <h1>HealthSense.AI</h1>
      <p>Loading your secure workspace...</p>
    </div>
  )
}
