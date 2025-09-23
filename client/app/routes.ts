import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
	route("/login", "routes/login.tsx"),
	route("/watermark", "routes/watermark.tsx"),
] satisfies RouteConfig;
