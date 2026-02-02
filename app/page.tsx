export default function Home() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <main style={{ textAlign: 'center' }}>
        <h1 className="title">Next.js Starter</h1>
        <p className="subtitle">
          Czysty, nowoczesny szablon gotowy do działania.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginTop: '3rem' }}>
          <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" className="card" style={{ width: '300px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Dokumentacja &rarr;</h2>
            <p style={{ opacity: 0.8 }}>Znajdź szczegółowe informacje o funkcjach Next.js i API.</p>
          </a>

          <a href="https://nextjs.org/learn" target="_blank" rel="noopener noreferrer" className="card" style={{ width: '300px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Nauka &rarr;</h2>
            <p style={{ opacity: 0.8 }}>Interaktywny kurs Next.js z quizami!</p>
          </a>
        </div>

        <div style={{ marginTop: '4rem' }}>
          <a href="#" className="btn">Rozpocznij tutaj</a>
        </div>
      </main>

      <footer style={{ marginTop: 'auto', padding: '2rem 0', opacity: 0.6 }}>
        <p>&copy; {new Date().getFullYear()} Twój Projekt</p>
      </footer>
    </div>
  );
}
