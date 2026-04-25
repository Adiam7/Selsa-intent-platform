'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'project' | 'sdk' | 'verify';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('project');
  const [projectName, setProjectName] = useState('');
  const [writeKey, setWriteKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [eventDetected, setEventDetected] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Step 1: Create project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create project');
      }

      const data = await response.json();
      setWriteKey(data.writeKey);
      setStep('sdk');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Poll for first event
  useEffect(() => {
    if (step !== 'verify' || eventDetected || !verifyLoading) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/events?limit=1');
        const data = await response.json();
        if (data.length > 0) {
          setEventDetected(true);
          setVerifyLoading(false);
        }
      } catch (err) {
        console.error('Error checking for events:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [step, eventDetected, verifyLoading]);

  // Auto-continue after event detected
  useEffect(() => {
    if (eventDetected) {
      const timer = setTimeout(() => {
        router.push('/app');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [eventDetected, router]);

  const sdkSnippet = `<script>
  (function() {
    const sdk = window.IntentSDK || {};
    sdk.writeKey = "${writeKey}";
    sdk.endpoint = "http://localhost:3001";
    // Load SDK from CDN
    const script = document.createElement("script");
    script.src = "https://cdn.intent.example.com/sdk-js.umd.min.js";
    document.head.appendChild(script);
    script.onload = function() {
      window.intent.init({ writeKey: "${writeKey}" });
      window.intent.track("page_view", { page: "/" });
    };
  })();
</script>`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {(['project', 'sdk', 'verify'] as const).map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  s === step
                    ? 'bg-indigo-600 text-white'
                    : ['project', 'sdk', 'verify'].indexOf(s) < ['project', 'sdk', 'verify'].indexOf(step)
                      ? 'bg-green-600 text-white'
                      : 'bg-[var(--border)] text-[var(--muted)]'
                }`}
              >
                {['project', 'sdk', 'verify'].indexOf(s) < ['project', 'sdk', 'verify'].indexOf(step) ? '✓' : i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    ['project', 'sdk', 'verify'].indexOf(s) < ['project', 'sdk', 'verify'].indexOf(step)
                      ? 'bg-green-600'
                      : 'bg-[var(--border)]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Project name */}
        {step === 'project' && (
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-8">
            <h1 className="text-2xl font-bold mb-2">Create your project</h1>
            <p className="text-[var(--muted)] mb-6">
              Give your first project a name. You can create more projects later.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My SaaS App"
                  className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? 'Creating...' : 'Next: Get write key'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: SDK installation */}
        {step === 'sdk' && (
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-8">
            <h1 className="text-2xl font-bold mb-2">Install the SDK</h1>
            <p className="text-[var(--muted)] mb-6">
              Add this snippet to your website. Copy and paste the code below into your HTML.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[var(--text)]">Your write key:</label>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(writeKey);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Copy
                  </button>
                </div>
                <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm text-green-400 break-all">
                  {writeKey}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[var(--text)]">HTML snippet:</label>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sdkSnippet);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Copy
                  </button>
                </div>
                <pre className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--muted)] overflow-x-auto">
                  <code>{sdkSnippet}</code>
                </pre>
              </div>

              <button
                onClick={() => {
                  setStep('verify');
                  setVerifyLoading(true);
                }}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
              >
                Next: Verify install
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verify installation */}
        {step === 'verify' && (
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Waiting for your first event...</h1>
            <p className="text-[var(--muted)] mb-8">
              {eventDetected
                ? '🎉 We detected your first event!'
                : 'Make sure the SDK is installed and reload your website.'}
            </p>

            {eventDetected ? (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <p className="text-[var(--muted)] text-sm">Redirecting to dashboard...</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border border-indigo-600 border-t-transparent" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
