import "./InsightsComingSoon.css";

export default function InsightsPage() {
  return (
    <div className="insights-page insights-coming-soon">
      <section className="insights-coming-soon-panel" aria-labelledby="insights-coming-soon-title">
        <div className="insights-coming-soon-art" aria-hidden="true">
          <span className="insights-coming-soon-orbit" />
          <span className="insights-coming-soon-point" />
        </div>
        <div className="insights-coming-soon-content">
          <span className="insights-coming-soon-index" aria-hidden="true">B / 01</span>
          <h1 id="insights-coming-soon-title"><span>COMING</span> <em>SOON</em></h1>
          <span className="insights-coming-soon-rule" aria-hidden="true"><i /></span>
        </div>
      </section>
    </div>
  );
}
