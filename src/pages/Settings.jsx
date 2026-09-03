import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const defaultPrefs = {
  emailNotifications: true,
  marketingEmails: false,
  currency: "USD",
  language: "English",
  dateFormat: "MM/DD/YYYY",
  timeZone: "(UTC+02:00) Cairo",
};


const mockUser = {
  _id: "static-preview",
  name: "Eman Mohamed",
  email: "eman.mohamed@gmail.com",
};

const SettingsContent = () => {
  const outletContext = useOutletContext() || {};
  const { isDark: contextIsDark, setIsDark: contextSetIsDark } = outletContext;

  const [localIsDark, setLocalIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const isDark = contextIsDark ?? localIsDark;
  const setIsDark = contextSetIsDark ?? setLocalIsDark;

  const [user] = useState(mockUser);
  const [prefs, setPrefs] = useState(() => {
  const saved = localStorage.getItem("user_prefs");
  return saved ? JSON.parse(saved) : defaultPrefs;
});

  const handleToggle = (key) => {
  setPrefs((prev) => {
    const updated = { ...prev, [key]: !prev[key] };
    localStorage.setItem("user_prefs", JSON.stringify(updated));
    return updated;
  });
};

  const handleSelectChange = (key, value) => {
  setPrefs((prev) => {
    const updated = { ...prev, [key]: value };
    localStorage.setItem("user_prefs", JSON.stringify(updated));
    return updated;
  });
};

  const handleDarkModeToggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleEditProfile = () => {
    console.log("Edit Profile clicked (static preview)");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border-custom bg-card p-5">
        <h3 className="text-sm font-bold text-primary mb-4">
          Profile Information
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-active to-active-hover flex items-center justify-center text-white font-extrabold">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-primary">{user.name}</p>
              <p className="text-xs text-secondary">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleEditProfile}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-active bg-active-bg hover:bg-active/20 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-border-custom bg-card p-5 space-y-5">
        <h3 className="text-sm font-bold text-primary">Account Preferences</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Email Notifications
            </p>
            <p className="text-xs text-secondary">
              Receive email updates about your activity.
            </p>
          </div>
          <ToggleSwitch
            checked={prefs.emailNotifications}
            onChange={() => handleToggle("emailNotifications")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Marketing Emails
            </p>
            <p className="text-xs text-secondary">
              Receive emails about new products and features.
            </p>
          </div>
          <ToggleSwitch
            checked={prefs.marketingEmails}
            onChange={() => handleToggle("marketingEmails")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Default Currency
            </p>
            <p className="text-xs text-secondary">
              Select your preferred currency.
            </p>
          </div>
          <select
            value={prefs.currency}
            onChange={(e) => handleSelectChange("currency", e.target.value)}
            className="rounded-lg border border-border-custom bg-input px-3 py-2 text-sm text-primary focus:border-active focus:outline-none"
          >
            <option value="USD">USD ($)</option>
            <option value="EGP">EGP (E£)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>

      {/*//////////////////////////*/}
      <div className="rounded-xl border border-border-custom bg-card p-5 space-y-5">
        <h3 className="text-sm font-bold text-primary">System Preferences</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Language</p>
            <p className="text-xs text-secondary">
              Choose your preferred language.
            </p>
          </div>
          <select
            value={prefs.language}
            onChange={(e) => handleSelectChange("language", e.target.value)}
            className="rounded-lg border border-border-custom bg-input px-3 py-2 text-sm text-primary focus:border-active focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Date Format</p>
            <p className="text-xs text-secondary">
              Select your preferred date format.
            </p>
          </div>
          <select
            value={prefs.dateFormat}
            onChange={(e) => handleSelectChange("dateFormat", e.target.value)}
            className="rounded-lg border border-border-custom bg-input px-3 py-2 text-sm text-primary focus:border-active focus:outline-none"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Time Zone</p>
            <p className="text-xs text-secondary">Select your time zone.</p>
          </div>
          <select
            value={prefs.timeZone}
            onChange={(e) => handleSelectChange("timeZone", e.target.value)}
            className="rounded-lg border border-border-custom bg-input px-3 py-2 text-sm text-primary focus:border-active focus:outline-none"
          >
            <option value="(UTC+02:00) Cairo">(UTC+02:00) Cairo</option>
            <option value="(UTC+00:00) London">(UTC+00:00) London</option>
          </select>
        </div>
      </div>

      {/* ////////////////*/}
      <div className="rounded-xl border border-border-custom bg-card p-5 space-y-5">
        <h3 className="text-sm font-bold text-primary">Other Settings</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Dark Mode</p>
            <p className="text-xs text-secondary">
              Switch between light and dark theme.
            </p>
          </div>
          <ToggleSwitch checked={isDark} onChange={handleDarkModeToggle} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Two-Factor Authentication
            </p>
            <p className="text-xs text-secondary">
              Add an extra layer of security to your account.
            </p>
          </div>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold text-active bg-active-bg hover:bg-active/20 transition-colors">
            Enable
          </button>
        </div>
      </div>
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-11 h-6 rounded-full relative transition-colors ${
      checked ? "bg-active" : "bg-input border border-border-custom"
    }`}
  >
    <span
      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-5" : "translate-x-0.5"
      }`}
    />
  </button>
);

export default SettingsContent;
