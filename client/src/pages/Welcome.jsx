import { Link, useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  const features = [
    'Organize the everyday chaos',
    'Focus on the right things',
    'Track progress from to do to done',
  ];

  return (
    <main className="onboard-screen">
      <section className="onboard-content">
        <h1 className="onboard-logo">ToDo<span>.</span></h1>

        <div className="onboard-features">
          {features.map((feature, index) => (
            <div
              className="onboard-feature"
              style={{ '--delay': `${0.7 + index * 0.8}s` }}
              key={feature}
            >
              <span className="onboard-check">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7" />
                </svg>
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="onboard-illustration">
          <svg viewBox="0 0 420 300" fill="none">
            <circle cx="210" cy="145" r="118" fill="#f1fbf6" />
            <circle cx="210" cy="145" r="91" fill="#e7f8f0" />

            <rect x="116" y="48" width="188" height="218" rx="18"
              fill="white" stroke="#e0f5eb" strokeWidth="2" />

            <rect x="143" y="76" width="94" height="10" rx="5" fill="#dbf4e8" />
            <rect x="143" y="96" width="133" height="6" rx="3" fill="#ecfaf3" />

            <g stroke="#d4ebe0" strokeWidth="2">
              <rect x="143" y="125" width="17" height="17" rx="5" />
              <rect x="143" y="163" width="17" height="17" rx="5" />
              <rect x="143" y="201" width="17" height="17" rx="5" />
            </g>

            <g fill="#dbf4e8">
              <rect x="171" y="130" width="91" height="7" rx="3.5" />
              <rect x="171" y="168" width="105" height="7" rx="3.5" />
              <rect x="171" y="206" width="75" height="7" rx="3.5" />
            </g>

            <circle cx="285" cy="194" r="34" fill="#239660" />
            <path d="M269 194l11 11 22-25" stroke="white"
              strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

            <path d="M92 105l8 8 14-17" stroke="#2ab273"
              strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

            <path d="M322 75l5 6 11-13" stroke="#2ab273"
              strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

            <path d="M91 213l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#f4c96b" />
            <path d="M329 232l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#f4c96b" />
            <circle cx="103" cy="65" r="4" fill="#2ab273" />
            <circle cx="321" cy="130" r="5" fill="#f4c96b" />
          </svg>
        </div>

        <h2 className="onboard-message">Now it’s your turn! ✨</h2>
        <p className="onboard-subtitle">Make space for what matters.</p>

        <button
          className="onboard-button"
          onClick={() => navigate('/register')}
        >
          Let's go <span>→</span>
        </button>

        <p className="onboard-login">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
