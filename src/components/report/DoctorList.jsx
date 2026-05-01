export default function DoctorList({ doctors }) {
  return (
    <div className="card">
      <h3>Recommended Doctors</h3>
      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {doctors.map((doctor) => (
          <div key={doctor.id} style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--border-radius-md)',
            borderLeft: '4px solid var(--color-accent)'
          }}>
            <h4>{doctor.name}</h4>
            <p>{doctor.specialty}</p>
            <p>{doctor.contact}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
