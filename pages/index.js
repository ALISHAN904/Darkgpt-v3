import Link from 'next/link';

export default function Landing() {
  return (
    <div style={styles.page}>
      <div style={styles.scene}>
        <div style={{ ...styles.cube, ...styles.cube1 }}>
          <div style={{ ...styles.face, ...styles.front }} />
          <div style={{ ...styles.face, ...styles.back }} />
          <div style={{ ...styles.face, ...styles.right }} />
          <div style={{ ...styles.face, ...styles.left }} />
          <div style={{ ...styles.face, ...styles.top }} />
          <div style={{ ...styles.face, ...styles.bottom }} />
        </div>
        <div style={{ ...styles.cube, ...styles.cube2 }}>
          <div style={{ ...styles.face, ...styles.front }} />
          <div style={{ ...styles.face, ...styles.back }} />
          <div style={{ ...styles.face, ...styles.right }} />
          <div style={{ ...styles.face, ...styles.left }} />
          <div style={{ ...styles.face, ...styles.top }} />
          <div style={{ ...styles.face, ...styles.bottom }} />
        </div>
        <div style={{ ...styles.cube, ...styles.cube3 }}>
          <div style={{ ...styles.face, ...styles.front }} />
          <div style={{ ...styles.face, ...styles.back }} />
          <div style={{ ...styles.face, ...styles.right }} />
          <div style={{ ...styles.face, ...styles.left }} />
          <div style={{ ...styles.face, ...styles.top }} />
          <div style={{ ...styles.face, ...styles.bottom }} />
        </div>
        <div style={styles.ring1} />
        <div style={styles.ring2} />
      </div>

      <div style={styles.content}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          AI-POWERED
        </div>
        <h1 style={styles.title}>
          DARK<span style={{ color: 'var(--amber)' }}>GPT</span>
        </h1>
        <p style={styles.subtitle}>
          Apna AI. Apni history. Apna account.<br />
          Multiple chats, saved forever, sirf tere liye.
        </p>
        <div style={styles.ctaRow}>
          <Link href="/chat" style={styles.primaryBtn}>
            Start Chatting →
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 50% 20%, #1a1408 0%, #0b0c0e 60%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  scene: {
    position: 'absolute',
    inset: 0,
    perspective: '1000px',
  },
  cube: {
    position: 'absolute',
    transformStyle: 'preserve-3d',
    animation: 'floatSpin 14s ease-in-out infinite',
  },
  cube1: {
    width: 70,
    height: 70,
    top: '18%',
    left: '12%',
    animationDelay: '0s',
  },
  cube2: {
    width: 44,
    height: 44,
    top: '62%',
    left: '78%',
    animationDelay: '-4s',
    animationDuration: '18s',
  },
  cube3: {
    width: 30,
    height: 30,
    top: '75%',
    left: '18%',
    animationDelay: '-9s',
    animationDuration: '11s',
  },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '1px solid rgba(255,180,0,0.35)',
    background: 'rgba(255,180,0,0.04)',
    backdropFilter: 'blur(1px)',
  },
  front: { transform: 'translateZ(35px)' },
  back: { transform: 'translateZ(-35px) rotateY(180deg)' },
  right: { transform: 'rotateY(90deg) translateZ(35px)' },
  left: { transform: 'rotateY(-90deg) translateZ(35px)' },
  top: { transform: 'rotateX(90deg) translateZ(35px)' },
  bottom: { transform: 'rotateX(-90deg) translateZ(35px)' },
  ring1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: '50%',
    border: '1px solid rgba(255,180,0,0.15)',
    top: '30%',
    right: '8%',
    animation: 'spin 30s linear infinite',
  },
  ring2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: '50%',
    border: '1px solid rgba(94,200,255,0.15)',
    bottom: '10%',
    left: '6%',
    animation: 'spin 22s linear infinite reverse',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    maxWidth: 560,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11,
    letterSpacing: 1.5,
    color: 'var(--text-dim)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '6px 14px',
    marginBottom: 24,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--amber)',
    boxShadow: '0 0 8px var(--amber)',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 52,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 16,
    color: 'var(--text)',
  },
  subtitle: {
    color: 'var(--text-dim)',
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 36,
  },
  ctaRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  primaryBtn: {
    background: 'var(--amber)',
    color: '#0b0c0e',
    padding: '13px 30px',
    borderRadius: 6,
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    fontSize: 14,
    textDecoration: 'none',
    boxShadow: '0 0 24px rgba(255,180,0,0.25)',
  },
};
