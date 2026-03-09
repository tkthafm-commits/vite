import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050810", fontFamily: "'DM Sans', sans-serif", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Something went wrong</h1>
            <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.6, marginBottom: 24 }}>Zidly encountered an unexpected error. Please refresh the page to try again.</p>
            <button onClick={() => window.location.reload()} style={{ background: "linear-gradient(135deg, #2dd4bf, #0d9488)", color: "white", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Refresh Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
