import { environment } from "../constants/environment";
import Keycloak from "keycloak-js";

export default class KeycloakService {
  static auth = null;

  static init(navigate) {
    const keycloakAuth = new Keycloak({
      url: environment.keycloakRootUrl,
      realm: 'master',
      clientId: 'maatrum',
    });

    KeycloakService.auth = { loggedIn: false };

    return new Promise((resolve, reject) => {
      keycloakAuth.init({ onLoad: 'login-required', checkLoginIframe: false, flow: 'standard' })
        .then(authenticated => {
          if (authenticated) {
            console.log("Keycloak authenticated:", authenticated);
            sessionStorage.setItem('token', JSON.stringify(keycloakAuth.token));
            KeycloakService.auth.loggedIn = true;
            KeycloakService.auth.authz = keycloakAuth;
            KeycloakService.auth.logoutUrl = `${keycloakAuth.authServerUrl}realms/master/protocol/openid-connect/logout?post_logout_redirect_uri=${document.baseURI}&id_token_hint=${keycloakAuth.idToken}`;

            // Check if user exists in backend and redirect appropriately
            KeycloakService.checkUserInBackend(keycloakAuth.tokenParsed)
              .then(() => {
                const userId = localStorage.getItem('userId');
                if (window.location.pathname !== `/dashboard/${userId}`) {
                  navigate(`/dashboard/${userId}`);
                }
                resolve(true);
              });
          } else {
            console.error("Keycloak not authenticated");
            resolve(false);
          }
        })
        .catch(error => {
          console.error("Failed to initialize Keycloak:", error);
          reject(error);
        });
    });
  }

  static async checkUserInBackend(tokenParsed) {
    try {
      const response = await fetch(`${environment.apiBaseUrl}/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KeycloakService.auth.authz.token}`
        },
        body: JSON.stringify({
          userEmail: tokenParsed.email,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('Response from backend:', data);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userEmail', data.email);

      if (data.message === 'user created') {
        console.log('User created:', data);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.email);
      } else if (data.message === 'user already exists') {
        console.log('User already exists:', data);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.email);
      }
    } catch (error) {
      console.error('Error checking user in backend:', error);
    }
  }

  static logout() {
    if (KeycloakService.auth) {
      KeycloakService.auth.loggedIn = false;
      KeycloakService.auth.authz = null;
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = KeycloakService.auth.logoutUrl;
    } else {
      console.error("Keycloak authentication object not initialized.");
    }
  }

  static getUsername() {
    return KeycloakService.auth?.authz?.tokenParsed?.preferred_username || null;
  }

  static getFullName() {
    return KeycloakService.auth?.authz?.tokenParsed?.name || null;
  }

  static getToken() {
    if (KeycloakService.auth?.authz?.token) {
      return KeycloakService.auth.authz.updateToken(5)
        .then(() => KeycloakService.auth.authz.token)
        .catch(error => {
          console.error("Failed to refresh token:", error);
          throw new Error("Failed to refresh token");
        });
    } else {
      console.error("Not logged in");
      throw new Error("Not logged in");
    }
  }
}
