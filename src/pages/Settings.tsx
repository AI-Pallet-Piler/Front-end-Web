import { useEffect, useState } from "react";
import { Bell, Shield, Database, Clock, X } from "lucide-react";

function Modal({
  open,
  title,
  subtitle,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  // ESC close + lock scroll
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-slate-900">{title}</div>
            {subtitle && <div className="mt-1 text-sm text-slate-500">{subtitle}</div>}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">{children}</div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [emailReports, setEmailReports] = useState(false);
  const [timezone, setTimezone] = useState("UTC-5 (Eastern Time)");

  // which modal is open
  const [modal, setModal] = useState<
    null | "password" | "export" | "backups"
  >(null);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-500">
          Configure your warehouse management preferences
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>

            <div className="flex-1">
              <div className="text-xl font-semibold text-slate-900">Notifications</div>
              <div className="mt-1 text-sm text-slate-500">
                Manage alert and notification preferences
              </div>

              <div className="mt-5 space-y-3">
                <label className="flex items-center gap-3 text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={lowStockAlerts}
                    onChange={(e) => setLowStockAlerts(e.target.checked)}
                  />
                  <span>Low stock alerts</span>
                </label>

                <label className="flex items-center gap-3 text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={orderNotifications}
                    onChange={(e) => setOrderNotifications(e.target.checked)}
                  />
                  <span>Order notifications</span>
                </label>

                <label className="flex items-center gap-3 text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={emailReports}
                    onChange={(e) => setEmailReports(e.target.checked)}
                  />
                  <span>Email reports</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>

            <div className="flex-1">
              <div className="text-xl font-semibold text-slate-900">Security</div>
              <div className="mt-1 text-sm text-slate-500">
                Password and access control settings
              </div>

              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => setModal("password")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
              <Database className="h-6 w-6 text-green-600" />
            </div>

            <div className="flex-1">
              <div className="text-xl font-semibold text-slate-900">Data Management</div>
              <div className="mt-1 text-sm text-slate-500">Backup and export options</div>

              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => setModal("export")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
                >
                  Export Data
                </button>

                <button
                  type="button"
                  onClick={() => setModal("backups")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
                >
                  Schedule Backups
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* System Preferences */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>

            <div className="flex-1">
              <div className="text-xl font-semibold text-slate-900">System Preferences</div>
              <div className="mt-1 text-sm text-slate-500">General system configuration</div>

              <div className="mt-5 space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                  <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                  <option value="UTC+1 (Central European Time)">UTC+1 (Central European Time)</option>
                  <option value="UTC+2 (Eastern European Time)">UTC+2 (Eastern European Time)</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modals (frontend only) */}
      <Modal
        open={modal === "password"}
        title="Change Password"
        onClose={() => setModal(null)}
      >
        <div className="space-y-3">
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Current password"
            type="password"
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New password"
            type="password"
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm new password"
            type="password"
          />
        </div>
      </Modal>

      <Modal
        open={modal === "export"}
        title="Export Data"
        onClose={() => setModal(null)}
      >

        <div className="grid grid-cols-1 gap-3">
          <button className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:bg-slate-50">
            Export as CSV
          </button>
          <button className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:bg-slate-50">
            Export as JSON
          </button>
        </div>
      </Modal>

      <Modal
        open={modal === "backups"}
        title="Schedule Backups"
        onClose={() => setModal(null)}
      >
        <p className="text-sm text-slate-600">
          Select a frequency.
        </p>
        <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </Modal>
    </div>
  );
}
