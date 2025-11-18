import { type RouteConfigEntry, index, route } from "@react-router/dev/routes";

const modules = import.meta.glob("./routes/**/*.tsx", { eager: true });

function pathToRouteConfig(path: string): RouteConfigEntry {
  const fileName = path.split("/").pop()!;
  const relativePath = path.replace(/^\.\/routes\//, "routes/");

  if (fileName === "index.tsx") {
    return index(relativePath);
  }

  const routePath =
    "/" + fileName.replace(".tsx", "").replace(/\[([^\]]+)\]/g, ":$1");

  return route(routePath, relativePath);
}

const routes: RouteConfigEntry[] = Object.keys(modules).map(pathToRouteConfig);

export default routes;
