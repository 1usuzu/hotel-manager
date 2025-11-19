// api helper - sử dụng axios. Thực tế cần backend để proxy OpenAI key / DB.
// Đây chỉ là wrapper cơ bản để gọi backend khi có.
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // đổi khi có backend thật
  timeout: 8000,
});

// wrapper có try/catch
export async function get(path, fallback = null) {
  try {
    const r = await API.get(path);
    return r.data;
  } catch (e) {
    console.warn("API GET error:", e && e.message);
    return fallback;
  }
}

export async function post(path, body) {
  try {
    const r = await API.post(path, body);
    return r.data;
  } catch (e) {
    console.warn("API POST error:", e && e.message);
    throw e;
  }
}
