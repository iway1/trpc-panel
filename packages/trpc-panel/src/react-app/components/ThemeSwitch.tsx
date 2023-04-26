import React from "react";

export function ThemeSwitch() {
  const handleToggleTheme = () => {
    const anyWindow = window as any;
    const isDarkModeEnabled = anyWindow.isDarkModeEnabled();

    if (isDarkModeEnabled) {
      anyWindow.disableDarkMode()
    } else {
      anyWindow.enableDarkMode()
    }
  }

  return (
    <button
      onClick={handleToggleTheme}
      type="button"
      className="border border-neutralSolidTransparent py-2 px-4 text-neutralText font-bold rounded-sm shadow-sm"
    >
      Change theme 🌓
    </button>
  );
}