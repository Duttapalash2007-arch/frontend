import Modal from '../common/Modal'

export default function ReportModal({ isOpen, report, onClose }) {
  return (
    <Modal isOpen={isOpen} title="Report Details" onClose={onClose}>
      {report && (
        <div>
          <p><strong>User:</strong> {report.userId}</p>
          <p><strong>Status:</strong> {report.status}</p>
          <p><strong>Created:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
          <p><strong>Score:</strong> {report.score}</p>
          <p><strong>Summary:</strong> {report.summary}</p>
        </div>
      )}
    </Modal>
  )
}
