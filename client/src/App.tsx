import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import importAllPages from "./utils/importAllPages";
import { AuthProvider } from "./providers/AuthProvider";
const pages = importAllPages(
  require.context("./pages", true, /\.(tsx|jsx|ts|js)$/)
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {Object.entries(pages).map(([pageName, PageComponent]) => {
            const path = `/${pageName.toLowerCase()}`;

            return (
              <Route key={pageName} path={path} element={<PageComponent />} />
            );
          })}

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
