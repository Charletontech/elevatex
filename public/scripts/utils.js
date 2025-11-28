export class Ui {
  static alert(
    icon = "success",
    title,
    message,
    showConfirmButton,
    showCancelButton
  ) {
    // Decide sensible defaults: when the alert is an action (question/warning)
    // enable confirm/cancel buttons unless caller explicitly passed booleans.
    const isAction = icon === "question" || icon === "warning";
    const confirm =
      typeof showConfirmButton === "boolean" ? showConfirmButton : isAction;
    const cancel =
      typeof showCancelButton === "boolean" ? showCancelButton : isAction;

    // CoolAlert.show typically returns a promise (like Swal.fire). Return that
    // promise so callers can await/then on user interaction. If it doesn't
    // return a promise, normalize by returning a resolved promise.
    try {
      const result = CoolAlert.show({
        icon,
        title,
        text: message,
        showConfirmButton: confirm,
        showCancelButton: cancel,
      });

      if (result && typeof result.then === "function") {
        return result;
      }
      // Not a promise: return a promise that resolves immediately (no confirm state)
      return Promise.resolve({ isConfirmed: true });
    } catch (e) {
      // Fallback: ensure callers always get a promise
      return Promise.resolve({ isConfirmed: true });
    }
  }

  static toast(icon = "success", title, message) {
    CoolAlert.show({
      toast: true,
      icon,
      title,
      text: message,
    });
  }
}

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export const saveToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const logout = () => {
  removeToken();
  window.location.href = "/login";
};

export const apiCall = async (endpoint, method = "GET", body = null) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, config);
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error("API call failed:", error);
    return { error };
  }
};

export const apiCallWithFile = async (
  endpoint,
  method = "POST",
  body = null
) => {
  const token = getToken();
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    body,
  };

  try {
    const response = await fetch(endpoint, config);
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error("API call with file failed:", error);
    return { error };
  }
};
