// components/Sidebar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type SidebarProps = {
  pages: Record<string, React.ComponentType>;
  hiddenPages?: string[];
};

const Sidebar: React.FC<SidebarProps> = ({ pages, hiddenPages = [] }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const ChevronLeft = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <polyline
        points="15 18 9 12 15 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ChevronRight = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <polyline
        points="9 18 15 12 9 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const HomeIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-5H9v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div
      style={{
        width: collapsed ? 60 : 200,
        transition: "width 0.3s",
        padding: "20px 10px 0 20px",
        background: "#1f2937",
        color: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h3
          style={{ marginBottom: 20, textAlign: collapsed ? "center" : "left" }}
        >
          {!collapsed ? "Navigation" : "NAV"}
        </h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.keys(pages)
            .filter((pageName) => !hiddenPages.includes(pageName.toLowerCase()))
            .map((pageName) => {
              const path = `/${pageName.toLowerCase()}`;
              const isActive = location.pathname === path;

              return (
                <li key={pageName} style={{ margin: "10px 0" }}>
                  <Link
                    to={path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: collapsed ? "center" : "flex-start",
                      background: isActive ? "#374151" : "transparent",
                      borderRadius: 6,
                      padding: "8px 12px",
                      textDecoration: "none",
                      color: "#fff",
                      transition: "background 0.2s",
                    }}
                  >
                    <span style={{ marginRight: collapsed ? 0 : 10 }}>
                      {HomeIcon}
                    </span>
                    {!collapsed && <span>{pageName}</span>}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          background: "#374151",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: 20,
          padding: "8px 8px 4px 8px",
          borderRadius: 6,
          alignSelf: "center",
          marginBottom: 40,
        }}
      >
        {collapsed ? ChevronRight : ChevronLeft}
      </button>
    </div>
  );
};

export default Sidebar;
