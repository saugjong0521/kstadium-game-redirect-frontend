import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "@/api";
import { PATH } from "@/constants";
import { useAccessTokenStore, useUserStore } from "@/store";
import { 
  MOCK_ACCESS_TOKEN, 
  mockUserInfo, 
  mockLoginResponse,
  mockJwtDecode 
} from "@/assets/mockData/authMockData";

// Mock mode flag - set to true to use mock authentication
const USE_MOCK_AUTH = import.meta.env.VITE_USE_AUTH_MOCK === 'true' || false;

// Simulate API delay for mock
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const useUserLogin = () => {
  const { setAccessToken } = useAccessTokenStore();
  const { setUserInfo, setUserAddress } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const accessKey = urlParams.get("accessKey") || "";

  useEffect(() => {
    const login = async () => {
      // Mock authentication mode
      if (USE_MOCK_AUTH) {
        console.log('🔑 Using MOCK authentication');
        
        try {
          setIsLoading(true);
          await mockDelay(500); // Simulate network delay
          
          const accessToken = MOCK_ACCESS_TOKEN;
          const decoded = mockJwtDecode(accessToken);
          const userInfo = decoded.info;
          const address = userInfo.account || userInfo.address;
          
          setAccessToken(accessToken);
          setUserInfo(userInfo);
          setUserAddress(address);
          setIsAuthenticated(true);
          
          console.log("✅ Mock login successful, address:", address);
        } catch (error) {
          console.error("❌ Mock login failed:", error);
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
        
        return;
      }

      // Real authentication mode
      if (!accessKey) {
        console.log('❌ No accessKey provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔑 Using REAL authentication with accessKey:', accessKey);
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
        
        console.log("✅ Login successful, address:", address);
      } catch (error) {
        console.error("❌ Login failed:", error);
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