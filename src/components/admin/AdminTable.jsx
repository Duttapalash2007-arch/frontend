export default function AdminTable({ data, columns, onRowClick }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'var(--color-white)'
      }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-light-text)' }}>
            {columns.map((col) => (
              <th key={col} style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={index}
              onClick={() => onRowClick(row)}
              style={{
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {columns.map((col) => (
                <td key={`${index}-${col}`} style={{ padding: 'var(--spacing-md)' }}>
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
