import jwt from 'jwt-decode';

export const decodeAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return;
  }

  return jwt(accessToken);
}