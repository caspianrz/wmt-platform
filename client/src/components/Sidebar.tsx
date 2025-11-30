// components/Sidebar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type SidebarProps = {
  pages: Record<string, React.ComponentType>;
  hiddenPages?: string[];
};

// دایره خالی ساده برای همه مسیرها
const CircleIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
  </svg>
);

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

  return (
    <div
      style={{
        width: collapsed ? 30 : 200,
        transition: "width 0.3s",
        padding: "20px 10px",
        background: "#1f2937",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        position: "sticky",
        left: 0,
        top: 0,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              display: collapsed ? "none" : "block",
              marginBottom: 20,
              textAlign: collapsed ? "center" : "left",
            }}
          >
            {!collapsed ? "Navigation" : ""}
          </h3>
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
              // marginTop: 20,
            }}
          >
            {collapsed ? ChevronRight : ChevronLeft}
          </button>
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.keys(pages)
            .filter((pageName) => !hiddenPages.includes(pageName.toLowerCase()))
            .map((pageName) => {
              const path = `/${pageName.toLowerCase()}`;
              const isActive = location.pathname === path;

              return (
                <li key={pageName} style={{ margin: "10px 0" }}>
                  {!collapsed && (
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
                        {CircleIcon}
                      </span>
                      {!collapsed && <span>{pageName}</span>}
                    </Link>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
