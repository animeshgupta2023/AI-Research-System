import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpenText,
  Check,
  CircleAlert,
  Compass,
  ExternalLink,
  FileSearch,
  LoaderCircle,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const SUGGESTED_TOPICS = [
  "How is AI changing clinical drug discovery?",
  "What is driving the global shift to heat pumps?",
  "How are cities adapting to extreme heat?",
];
const PIPELINE_STEPS = ["Search the web", "Read a source", "Write the report", "Critique the findings"];

function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("report");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((response) => setBackendOnline(response.ok))
      .catch(() => setBackendOnline(false));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanTopic = topic.trim();
    if (cleanTopic.length < 3 || loading) return;

    setLoading(true);
    setError("");
    setResult(null);
    setActiveTab("report");

    try {
      const response = await fetch(`${API_URL}/api/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: cleanTopic }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "The research request could not be completed.");
      }
      setResult(data);
      setBackendOnline(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not reach the research backend.",
      );
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }

  function downloadReport() {
    if (!result?.report) return;
    const file = new Blob([result.report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${topic.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "research-report"}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Fieldnotes home">
          <span className="brand-mark"><Compass size={19} strokeWidth={1.8} /></span>
          <span>fieldnotes<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-right">
          <span className={`connection ${backendOnline ? "is-online" : ""}`}>
            <span className="connection-dot" />
            {backendOnline ? "Agent connected" : "Agent offline"}
          </span>
          <span className="topbar-divider" />
          <span className="workspace-label">RESEARCH DESK</span>
        </div>
      </header>

      <main id="top" className="main-layout">
        <aside className="rail" aria-label="Research workflow">
          <div className="rail-section-label">YOUR WORKSPACE</div>
          <div className="rail-current"><Search size={16} /><span>New research</span><span className="rail-current-dot" /></div>
          <div className="rail-rule" />
          <div className="rail-section-label process-label">THE PROCESS</div>
          <ol className={`process-list ${loading ? "is-running" : ""}`}>
            {PIPELINE_STEPS.map((step, index) => (
              <li className="process-step" key={step}>
                <span className="step-number">{loading ? <span className="step-pulse" /> : `0${index + 1}`}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="rail-note">
            <ShieldCheck size={17} />
            <p>Search, source, synthesize, then review.</p>
          </div>
          <div className="rail-footer">FIELDNOTES <span>·</span> AI RESEARCH</div>
        </aside>

        <section className="workspace">
          <div className="workspace-inner">
            <div className="eyebrow"><span className="eyebrow-line" /> THE RESEARCH AGENT</div>
            <h1>Good questions<br /><em>deserve better</em> answers.</h1>
            <p className="intro">Start with a question. Get a researched report with sources and a critical review.</p>

            <form className="research-form" onSubmit={handleSubmit}>
              <label className="input-label" htmlFor="research-topic">WHAT ARE YOU RESEARCHING?</label>
              <div className="input-wrap">
                <textarea
                  id="research-topic"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="Ask a focused research question..."
                  maxLength={300}
                  rows={2}
                  disabled={loading}
                />
                <div className="input-bottom">
                  <span className="char-count">{topic.length}/300</span>
                  <button className="submit-button" type="submit" disabled={loading || topic.trim().length < 3}>
                    {loading ? <><LoaderCircle className="spin" size={16} /> Researching</> : <>Research <ArrowRight size={16} /></>}
                  </button>
                </div>
              </div>
            </form>

            {!result && !loading && (
              <div className="suggestions">
                <span className="suggestions-label">A FEW PLACES TO START</span>
                <div className="suggestion-list">
                  {SUGGESTED_TOPICS.map((suggestion) => (
                    <button className="suggestion" key={suggestion} onClick={() => setTopic(suggestion)} type="button">
                      <span>{suggestion}</span><ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="working-panel" role="status" aria-live="polite">
                <div className="working-icon"><Sparkles size={18} /></div>
                <div><strong>Building your research brief</strong><p>Searching, reading, drafting, and reviewing. This can take a minute.</p></div>
                <LoaderCircle className="spin working-spinner" size={18} />
              </div>
            )}

            {error && (
              <div className="error-panel" role="alert">
                <CircleAlert size={18} />
                <div><strong>Research didn’t complete</strong><p>{error}</p><span>Check that the backend is running and its API keys are configured.</span></div>
              </div>
            )}

            {result && (
              <section className="results" aria-label="Research results">
                <div className="result-heading">
                  <div><div className="result-kicker"><Check size={13} /> RESEARCH COMPLETE</div><h2>{topic.trim()}</h2></div>
                  <button className="icon-button" onClick={downloadReport} type="button" title="Download report as Markdown" aria-label="Download report as Markdown"><ArrowDownToLine size={17} /></button>
                </div>
                <div className="result-tabs" role="tablist" aria-label="Report sections">
                  <button className={activeTab === "report" ? "active" : ""} onClick={() => setActiveTab("report")} role="tab" aria-selected={activeTab === "report"} type="button"><BookOpenText size={15} /> Report</button>
                  <button className={activeTab === "sources" ? "active" : ""} onClick={() => setActiveTab("sources")} role="tab" aria-selected={activeTab === "sources"} type="button"><FileSearch size={15} /> Research notes</button>
                  <button className={activeTab === "review" ? "active" : ""} onClick={() => setActiveTab("review")} role="tab" aria-selected={activeTab === "review"} type="button"><ShieldCheck size={15} /> Critic review</button>
                </div>
                <div className="result-body" role="tabpanel">
                  {activeTab === "report" && <article className="markdown-content"><ReactMarkdown>{result.report || "No report was returned."}</ReactMarkdown></article>}
                  {activeTab === "sources" && <div className="notes-content"><NoteBlock icon={<Search size={16} />} title="Web search results" content={result.search_results} /><NoteBlock icon={<BookOpenText size={16} />} title="Scraped source notes" content={result.scraped_content} /></div>}
                  {activeTab === "review" && <article className="markdown-content review-content"><div className="review-stamp"><ShieldCheck size={18} /> EDITORIAL REVIEW</div><ReactMarkdown>{result.feedback || "No critic review was returned."}</ReactMarkdown></article>}
                </div>
              </section>
            )}

            <footer className="page-footer"><span>Independent research, one question at a time.</span><span>AI-GENERATED · VERIFY IMPORTANT CLAIMS</span></footer>
          </div>
        </section>
      </main>
    </div>
  );
}

function NoteBlock({ icon, title, content }) {
  return (
    <section className="note-block">
      <h3>{icon}{title}</h3>
      {content ? <p>{content}</p> : <p className="empty-note">No notes were returned for this section.</p>}
    </section>
  );
}

export default App;