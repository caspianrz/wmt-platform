import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
	index('routes/index.tsx'),
	route("/login", "routes/login.tsx"),
	route("/watermark", "routes/watermark.tsx"),
	route("/assets", "routes/assets.tsx"),
	route("/watermarks", "routes/watermarks.tsx"),
] satisfies RouteConfig;
