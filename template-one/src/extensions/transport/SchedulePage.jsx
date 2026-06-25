/**
 * A brand-new page, unique to the transport site.
 * Fixed/hardcoded content — no CMS involved.
 *
 * Reachable at: yourdomain.com/#transport-schedule
 */
import { Container, Table, Button } from 'react-bootstrap';
import { FaArrowLeft, FaBus } from 'react-icons/fa';

const SchedulePage = () => (
  <Container className="py-5 my-3" style={{ maxWidth: '900px' }}>
    <Button
      as="a"
      href="#"
      variant="outline-secondary"
      size="sm"
      className="rounded-pill px-3 mb-4 d-inline-flex align-items-center gap-2"
      onClick={(e) => { e.preventDefault(); window.history.back(); }}
    >
      <FaArrowLeft size={12} /> Back
    </Button>

    <h1 className="fw-bold mb-2 d-flex align-items-center gap-2">
      <FaBus className="text-primary" /> Bus Schedule
    </h1>
    <p className="text-secondary mb-4">Fixed timetable for transport routes.</p>

    <Table bordered hover responsive>
      <thead className="table-light">
        <tr>
          <th>Route</th>
          <th>Departure</th>
          <th>Arrival</th>
          <th>Frequency</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Route 1 — City Center</td><td>06:00 AM</td><td>07:30 AM</td><td>Every 30 min</td></tr>
        <tr><td>Route 2 — North Zone</td><td>06:15 AM</td><td>08:00 AM</td><td>Every 45 min</td></tr>
        <tr><td>Route 3 — South Zone</td><td>06:30 AM</td><td>08:15 AM</td><td>Every 45 min</td></tr>
      </tbody>
    </Table>
  </Container>
);

export default SchedulePage;
