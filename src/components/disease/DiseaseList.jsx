import DiseaseCard from './DiseaseCard'

export default function DiseaseList({ diseases, onSelectDisease }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
      {diseases.map((disease) => (
        <DiseaseCard 
          key={disease.id} 
          disease={disease}
          onClick={() => onSelectDisease(disease)}
        />
      ))}
    </div>
  )
}
