import React from "react";
import { useHeadersContext } from "@src/react-app/components/contexts/HeadersContext";
import MailLockIcon from "@mui/icons-material/MailLockOutlined";
import { LogoSvg } from "@src/react-app/components/LogoSvg";
import { useIsMac } from "@src/react-app/components/hooks/useIsMac";
import Search from "@mui/icons-material/Search";
import { useSearch } from "@src/react-app/components/contexts/SearchStore";

export function TopBar() {
  const { setHeadersPopupShown } = useHeadersContext();
  return (
    <div className="w-full px-4 pr-8 flex flex-row justify-between items-center position-fixed left-0 h-16 right-0 top-0 bg-gray-50 drop-shadow-sm bg-actuallyWhite border-b border-b-panelBorder">
      <span className="flex flex-row items-center text-lg font-bold font-mono">
        <LogoSvg className="rounded-lg w-10 h-10 mr-2" />
        tRPC.panel()
      </span>
      <RouterSearchTooltip />
      <button
        onClick={() => setHeadersPopupShown(true)}
        className="border border-neutralSolidTransparent py-2 px-4 text-neutralText font-bold rounded-sm shadow-sm"
      >
        Headers
        <MailLockIcon className="w-6 h-6 ml-1" />
      </button>
    </div>
  );
}

// import Search from '@mui/icons-material/Search'
export function RouterSearchTooltip() {
  const searchOpen = useSearch((s) => s.searchOpen);
  const setSearchOpen = useSearch((s) => s.setSearchOpen);

  const isMac = useIsMac();
  const helperText = isMac ? "⌘ + P" : "Ctrl + P";
  if (searchOpen) return null;
  return (
    <button
      onClick={() => setSearchOpen(true)}
      type="button"
      className="flex flex-row items-center text-neutralSolidTransparent"
    >
      <Search fontSize="small" className="mr-2 color-neutralSolidTransparent" />
      {helperText}
    </button>
  );
}
