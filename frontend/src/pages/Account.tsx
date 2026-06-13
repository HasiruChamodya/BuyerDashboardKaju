import { useState } from "react";
import { Building2, MapPin, Mail, Phone, ShieldCheck, CreditCard, Bell, User } from "lucide-react";
import Button from "../components/ui/Button";
import { districts } from "../data/mockData";

const TABS = ["Profile", "Business Details", "Payment & Settlement", "Notification Preferences"] as const;
type Tab = (typeof TABS)[number];

export default function Account() {
  const [tab, setTab] = useState<Tab>("Profile");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text-h">Account Profiles</h1>
          <p className="mt-1 text-sm text-text">Manage your buyer profile, business details, and preferences.</p>
        </div>
        {saved && (
          <div className="rounded-md border border-success-200 bg-success-50 px-3 py-2 text-xs font-medium text-success-700">
            Changes saved.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        {/* Profile summary card */}
        <div className="space-y-4">
          <div className="rounded-card border border-border bg-white p-5 text-center shadow-card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-xl font-semibold text-white">
              NK
            </div>
            <h2 className="mt-3 font-display text-base font-semibold text-text-h">Nadeesha Kumara</h2>
            <p className="text-xs text-text">Procurement Manager</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-brand-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified buyer
            </p>
          </div>

          <nav className="space-y-1 rounded-card border border-border bg-white p-2 shadow-card">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  tab === t ? "bg-brand-50 text-brand-600" : "text-text hover:bg-bg-soft"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <form onSubmit={handleSave} className="space-y-5 rounded-card border border-border bg-white p-6 shadow-card">
          {tab === "Profile" && (
            <>
              <SectionHeading icon={<User className="h-4 w-4" />} title="Personal information" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full name" defaultValue="Nadeesha Kumara" />
                <Field label="Job title" defaultValue="Procurement Manager" />
                <Field label="Email address" type="email" icon={<Mail className="h-3.5 w-3.5" />} defaultValue="nadeesha.k@lankafreshfoods.lk" />
                <Field label="Phone number" icon={<Phone className="h-3.5 w-3.5" />} defaultValue="+94 77 123 4567" />
              </div>
            </>
          )}

          {tab === "Business Details" && (
            <>
              <SectionHeading icon={<Building2 className="h-4 w-4" />} title="Company information" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Company name" defaultValue="Lanka Fresh Foods (Pvt) Ltd" />
                <Field label="Business registration no." defaultValue="PV 00214567" />
                <Field label="Tax identification number (TIN)" defaultValue="134567890" />
                <SelectField label="District" defaultValue="Colombo" options={districts} />
              </div>
              <Field
                label="Registered business address"
                textarea
                icon={<MapPin className="h-3.5 w-3.5" />}
                defaultValue="No. 45, Industrial Zone Road, Colombo 14, Sri Lanka"
              />
            </>
          )}

          {tab === "Payment & Settlement" && (
            <>
              <SectionHeading icon={<CreditCard className="h-4 w-4" />} title="Settlement preferences" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField label="Default payment method" defaultValue="Digital Payment (Escrow)" options={["Digital Payment (Escrow)", "Cash on Delivery"]} />
                <Field label="Bank account holder name" defaultValue="Lanka Fresh Foods (Pvt) Ltd" />
                <Field label="Bank name" defaultValue="Commercial Bank of Ceylon" />
                <Field label="Account number" defaultValue="8001234567" />
              </div>
              <p className="rounded-md border border-brand-100 bg-brand-50 px-3 py-2 text-xs text-brand-600">
                Funds for digital payments are held in escrow until your order reaches the "Completed &amp; Delivered" stage.
              </p>
            </>
          )}

          {tab === "Notification Preferences" && (
            <>
              <SectionHeading icon={<Bell className="h-4 w-4" />} title="Alert preferences" />
              <div className="space-y-3">
                <Toggle label="Outbid alerts" description="Get notified immediately when you're outbid on an auction lot." defaultChecked />
                <Toggle label="Auction ending reminders" description="Receive a reminder when watched auctions are about to close." defaultChecked />
                <Toggle label="Order status updates" description="Updates when an order moves through the logistics workflow." defaultChecked />
                <Toggle label="Vendor messages" description="Notifications for new messages from vendors." defaultChecked />
                <Toggle label="Marketplace promotions" description="Seasonal promotions and new lot announcements." />
              </div>
            </>
          )}

          <div className="flex justify-end border-t border-border pt-4">
            <Button type="submit" variant="primary">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-text-h">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600">{icon}</span>
      {title}
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
  icon,
  textarea,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  icon?: React.ReactNode;
  textarea?: boolean;
}) {
  return (
    <label className="block text-xs font-medium text-text-h sm:col-span-1 [&:has(textarea)]:sm:col-span-2">
      <span className="mb-1.5 block">{label}</span>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text">{icon}</span>}
        {textarea ? (
          <textarea
            defaultValue={defaultValue}
            rows={2}
            className={`w-full rounded-md border border-border bg-white py-2 text-sm text-text-h placeholder:text-text focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 ${icon ? "pl-9 pr-3" : "px-3"}`}
          />
        ) : (
          <input
            type={type}
            defaultValue={defaultValue}
            className={`w-full rounded-md border border-border bg-white py-2 text-sm text-text-h placeholder:text-text focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 ${icon ? "pl-9 pr-3" : "px-3"}`}
          />
        )}
      </div>
    </label>
  );
}

function SelectField({ label, defaultValue, options }: { label: string; defaultValue?: string; options: string[] }) {
  return (
    <label className="block text-xs font-medium text-text-h">
      <span className="mb-1.5 block">{label}</span>
      <select
        defaultValue={defaultValue}
        className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text-h focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border px-4 py-3">
      <div>
        <p className="text-sm font-medium text-text-h">{label}</p>
        <p className="text-xs text-text">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((c) => !c)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand-600" : "bg-border"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
