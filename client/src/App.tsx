import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import importAllPages from "./utils/importAllPages";
import { AuthProvider } from "./providers/AuthProvider";
import Sidebar from "./components/Sidebar";
import WatermarkingPage from "./pages/watermarking";
import AnalyzePage from "./pages/analyze";

const pages = importAllPages(
  require.context("./pages", true, /\.(tsx|jsx|ts|js)$/)
);

function AppWrapper() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}

function App() {
  const location = useLocation();

  const hiddenSidebarRoutes = ["/login"];

  const hideSidebar = hiddenSidebarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && (
        <Sidebar
          pages={pages}
          hiddenPages={["login", "analyze", "watermarking"]}
        />
      )}

      <div style={{ flex: 1, padding: 20 }}>
        <Routes>
          {Object.entries(pages).map(([pageName, PageComponent]) => {
            const path = `/${pageName.toLowerCase()}`;
            return (
              <Route key={pageName} path={path} element={<PageComponent />} />
            );
          })}
          <Route path="/watermarking/:uuid" element={<WatermarkingPage />} />
          <Route path="/analyze/:uuid" element={<AnalyzePage />} />
          <Route path="*" element={<Navigate to="/assets" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default AppWrapper;
