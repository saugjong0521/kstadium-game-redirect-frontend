import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "@/api";
import { PATH } from "@/constants";
import { useAccessTokenStore, useUserStore } from "@/store";

const useUserLogin = () => {
  const { setAccessToken } = useAccessTokenStore();
  const { setUserInfo, setUserAddress } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const accessKey = urlParams.get("accessKey") || "";

  useEffect(() => {
    const login = async () => {
      if (!accessKey) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.post(PATH.KSTARLOGIN, { accessKey });
        const accessToken = response.data.data.accessToken;
        
        // Decode the JWT to get user info
        const decoded = jwtDecode(accessToken);
        const userInfo = decoded.info;
        const address = userInfo.account || userInfo.address;
        
        setAccessToken(accessToken);
        setUserInfo(userInfo);
        setUserAddress(address);
        setIsAuthenticated(true);
        
        console.log("Login successful, address:", address);
      } catch (error) {
        console.error("Login failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    login();
  }, [accessKey]);

  return {
    isLoading,
    isAuthenticated,
  };
};

export { useUserLogin };