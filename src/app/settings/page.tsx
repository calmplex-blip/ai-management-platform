'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';

type Section = 'general' | 'api-keys' | 'appearance' | 'notifications' | 'integrations' | 'security';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  scopes: string[];
}

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production Key',
    key: 'sk-prod-••••••••••••••••••••••Kx9m',
    created: '2025-08-01',
    lastUsed: '2 hours ago',
    scopes: ['models:read', 'models:execute', 'mcp:full'],
  },
  {
    id: '2',
    name: 'CI/CD Pipeline',
    key: 'sk-ci-••••••••••••••••••••••Ab3n',
    created: '2025-09-15',
    lastUsed: '1 day ago',
    scopes: ['models:read', 'models:execute'],
  },
];

const sections: { id: Section; label: string; icon: string }[] = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'api-keys', label: 'API Keys', icon: '🔑' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'integrations', label: 'Integrations', icon: '🔌' },
  { id: 'security', label: 'Security', icon: '🛡️' },
];

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
  );
}

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex-1 mr-6">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function GeneralSection() {
  const [org, setOrg] = useState('ConsciousOps Inc.');
  const [timezone, setTimezone] = useState('America/New_York');
  const [language, setLanguage] = useState('en-US');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <SectionHeader title="General" description="Basic platform configuration and preferences." />
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <Field label="Organization Name" description="Displayed throughout the platform">
          <input
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className="w-56 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </Field>
        <Field label="Timezone" description="Used for all date and time displays">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-56 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="UTC">UTC</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Paris (CET)</option>
          </select>
        </Field>
        <Field label="Language">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-56 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </Field>
        <div className="mt-4 flex justify-end">
          <Button onClick={save} variant={saved ? 'secondary' : 'primary'} size="sm">
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ApiKeysSection() {
  const [keys, setKeys] = useState(mockApiKeys);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [generated, setGenerated] = useState<string | null>(null);

  const generateKey = () => {
    const key = 'sk-new-' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 18);
    setGenerated(key);
    setKeys((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: newName || 'New Key',
        key: key.slice(0, 12) + '••••••••••••••••' + key.slice(-4),
        created: new Date().toISOString().slice(0, 10),
        lastUsed: 'Never',
        scopes: ['models:read'],
      },
    ]);
    setNewName('');
    setShowNew(false);
  };

  const revoke = (id: string) => setKeys((prev) => prev.filter((k) => k.id !== id));

  return (
    <div>
      <SectionHeader title="API Keys" description="Manage keys for programmatic access to the platform." />
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
        {keys.map((key, i) => (
          <div key={key.id} className={`p-5 ${i < keys.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{key.name}</p>
                <code className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1 block">{key.key}</code>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>Created {key.created}</span>
                  <span>Last used {key.lastUsed}</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {key.scopes.map((s) => (
                    <span key={s} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => revoke(key.id)}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Revoke
              </button>
            </div>
          </div>
        ))}
        {keys.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-400">No API keys. Create one below.</div>
        )}
      </div>
      {generated && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-1">Key created — copy it now, it won&apos;t be shown again:</p>
          <code className="text-xs font-mono text-green-700 dark:text-green-400 break-all">{generated}</code>
        </div>
      )}
      {showNew ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">New API Key</p>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Key name (e.g. Production)"
            className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none mb-3"
          />
          <div className="flex gap-2">
            <Button onClick={generateKey} size="sm">Generate Key</Button>
            <Button onClick={() => setShowNew(false)} variant="secondary" size="sm">Cancel</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowNew(true)} variant="secondary" size="sm">+ Create New Key</Button>
      )}
    </div>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [accentColor, setAccentColor] = useState('blue');

  const colors = [
    { id: 'blue', cls: 'bg-blue-500' },
    { id: 'purple', cls: 'bg-purple-500' },
    { id: 'green', cls: 'bg-green-500' },
    { id: 'orange', cls: 'bg-orange-500' },
    { id: 'rose', cls: 'bg-rose-500' },
  ];

  return (
    <div>
      <SectionHeader title="Appearance" description="Customize how the platform looks." />
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <Field label="Theme" description="Choose your preferred color scheme">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
            {(['system', 'light', 'dark'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  theme === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Density" description="Controls spacing and element sizes">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
            {(['comfortable', 'compact'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  density === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Accent Color" description="Primary brand color used for buttons and highlights">
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setAccentColor(c.id)}
                className={`w-6 h-6 rounded-full ${c.cls} transition-transform ${accentColor === c.id ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
              />
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    modelErrors: true,
    highCost: true,
    agentCompleted: false,
    taskFailed: true,
    weeklyReport: true,
    securityAlerts: true,
    newVersion: false,
  });

  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const items: { key: keyof typeof prefs; label: string; description: string }[] = [
    { key: 'modelErrors', label: 'Model Errors', description: 'Alert when a model call fails or returns an error' },
    { key: 'highCost', label: 'High Cost Alerts', description: 'Notify when spending exceeds configured thresholds' },
    { key: 'agentCompleted', label: 'Agent Task Completed', description: 'Notify when an A2A agent completes a long-running task' },
    { key: 'taskFailed', label: 'AP2 Task Failed', description: 'Alert when an AP2 task fails or times out' },
    { key: 'weeklyReport', label: 'Weekly Usage Report', description: 'Receive a weekly email summary of platform usage' },
    { key: 'securityAlerts', label: 'Security Alerts', description: 'Alerts for unusual access patterns or key usage' },
    { key: 'newVersion', label: 'New Platform Version', description: 'Notify when a new ConsciousOps version is available' },
  ];

  return (
    <div>
      <SectionHeader title="Notifications" description="Control which events trigger alerts." />
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {items.map((item) => (
          <Field key={item.key} label={item.label} description={item.description}>
            <Toggle enabled={prefs[item.key]} onChange={() => toggle(item.key)} />
          </Field>
        ))}
      </div>
    </div>
  );
}

function IntegrationsSection() {
  const integrations = [
    { name: 'Slack', description: 'Post alerts and reports to Slack channels', icon: '#', connected: true, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
    { name: 'PagerDuty', description: 'Route critical incidents to on-call rotations', icon: 'P', connected: false, color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
    { name: 'Datadog', description: 'Send metrics and traces to Datadog APM', icon: 'D', connected: false, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
    { name: 'Grafana', description: 'Export dashboards to Grafana for custom visualization', icon: 'G', connected: false, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' },
    { name: 'GitHub Actions', description: 'Trigger deployments from CI/CD pipelines', icon: '⚡', connected: true, color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' },
    { name: 'Webhook', description: 'POST events to a custom HTTP endpoint', icon: '↗', connected: false, color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' },
  ];

  return (
    <div>
      <SectionHeader title="Integrations" description="Connect ConsciousOps to external services." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((intg) => (
          <div key={intg.name} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${intg.color}`}>
              {intg.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{intg.name}</p>
                {intg.connected && (
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                    Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{intg.description}</p>
            </div>
            <button className={`text-xs font-medium shrink-0 ${intg.connected ? 'text-red-500 hover:text-red-700' : 'text-blue-600 hover:text-blue-700'}`}>
              {intg.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySection() {
  const [mfa, setMfa] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('8h');
  const [ipAllowlist, setIpAllowlist] = useState(false);
  const [auditLog, setAuditLog] = useState(true);

  return (
    <div>
      <SectionHeader title="Security" description="Authentication, access control, and audit settings." />
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-4">
        <Field label="Multi-Factor Authentication" description="Require MFA for all admin accounts">
          <Toggle enabled={mfa} onChange={setMfa} />
        </Field>
        <Field label="Session Timeout" description="Automatically sign out inactive users">
          <select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="1h">1 hour</option>
            <option value="4h">4 hours</option>
            <option value="8h">8 hours</option>
            <option value="24h">24 hours</option>
            <option value="never">Never</option>
          </select>
        </Field>
        <Field label="IP Allowlist" description="Restrict access to trusted IP ranges only">
          <Toggle enabled={ipAllowlist} onChange={setIpAllowlist} />
        </Field>
        <Field label="Audit Log" description="Record all admin actions for compliance">
          <Toggle enabled={auditLog} onChange={setAuditLog} />
        </Field>
      </div>
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">Danger Zone</h4>
        <p className="text-xs text-red-600 dark:text-red-400 mb-3">
          These actions are irreversible. Proceed with caution.
        </p>
        <div className="flex gap-3">
          <button className="text-xs font-medium text-red-600 border border-red-300 dark:border-red-700 rounded-lg px-3 py-1.5 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            Rotate All API Keys
          </button>
          <button className="text-xs font-medium text-red-600 border border-red-300 dark:border-red-700 rounded-lg px-3 py-1.5 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            Delete Organization
          </button>
        </div>
      </div>
    </div>
  );
}

const sectionComponents: Record<Section, React.ComponentType> = {
  general: GeneralSection,
  'api-keys': ApiKeysSection,
  appearance: AppearanceSection,
  notifications: NotificationsSection,
  integrations: IntegrationsSection,
  security: SecuritySection,
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('general');
  const ActiveSection = sectionComponents[activeSection];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage your platform configuration and preferences
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-48 shrink-0">
            <ul className="space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      activeSection === s.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <ActiveSection />
          </div>
        </div>
      </main>
    </div>
  );
}
