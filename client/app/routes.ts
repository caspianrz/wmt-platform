import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
	index("routes/design.tsx"),
	route("/upload", "routes/upload.tsx"),
	route("/register", "routes/register.tsx"),
	route("/login", "routes/login.tsx"),
] satisfies RouteConfig;
