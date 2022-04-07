import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../consts";

export function Profile() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/logout`);
      console.log(response.data);
      navigate("/login");
    } catch (err) {
      alert("there was an error logging out");
    }
  };
  return (
    <div>
      <h1>Profile</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}