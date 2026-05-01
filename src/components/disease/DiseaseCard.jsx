export default function DiseaseCard({ disease, onClick }) {
  return (
    <div 
      className="card"
      onClick={onClick}
      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <h3>{disease.name}</h3>
      <p>{disease.description}</p>
    </div>
  )
}
