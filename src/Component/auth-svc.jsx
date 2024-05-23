import axios from "axios";
import { environment, API_BASE_URL } from "../constants/environment";
import KeycloakService from "./Keycloak"

class AuthSvcService {
  baseURL = `${API_BASE_URL}/`;

  getToken = (token) => {
    return {
      "Content-Type": "application/json",
      Authorization: ` ${token}`
    };
  };

  getKeyCloakToken = async () => {
    try {
      const token = await KeycloakService.getToken();
      return token;
    } catch (error) {
      throw new Error("Failed to retrieve Keycloak token");
    }
  };

  getInitialData = async () => {
    try {
      const token = await this.getKeyCloakToken();
      const response = await axios.get(`${this.baseURL}/details`, { headers: this.getToken(token) });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch initial data", error);
      throw error;
    }
  };

  logoutToken = async () => {
    try {
      const response = await axios.get(`${environment.devUrl}/authentication/token/logout`);
      return response.data;
    } catch (error) {
      console.error("Failed to logout", error);
      throw error;
    }
  };

  appInit = () => {
    return new Promise((resolve, reject) => {
      this.getInitialData()
        .then(() => resolve())
        .catch((error) => {
          console.error("App initialization failed", error);
          reject(error);
        });
    });
  };
}

// Create an instance of AuthSvcService and export it
const authSvcServiceInstance = new AuthSvcService();
export default authSvcServiceInstance;