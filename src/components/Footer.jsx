function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1 fw-bold">
          <i className="bi bi-dribbble me-2 text-success"></i>Canchas & Deportes
        </p>
        <p className="text-secondary small mb-0">
          © {new Date().getFullYear()} — Reservas de canchas de fútbol
        </p>
      </div>
    </footer>
  )
}

export default Footer
