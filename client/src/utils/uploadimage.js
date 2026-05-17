import { API_PATH } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
	const data = new FormData();

	data.append("image", imageFile);

	try {
		const response = await axiosInstance.post(API_PATH.IMAGE.UPLOAD, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.log("error uploading image", error);
		throw error;
	}
};

export default uploadImage; 
