import axios from "axios";
import EnvironmentManager from "./EnvironmentManager";

export default async (image: File, type: string, args: string[]) => {
	const endpoint = new URL('/api/attack', document.location.origin);
	endpoint.port = EnvironmentManager.Instance.SERVER_PORT;

	const formData = new FormData();
	formData.append('image', image);
	formData.append('attack', JSON.stringify({
		name: type,
		args: args,
	}));
	return await axios.post(endpoint.href, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		}
	})
};
