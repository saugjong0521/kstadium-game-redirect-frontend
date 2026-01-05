// Mock authentication data for development

// Mock user address - same as lottery mock for consistency
export const MOCK_USER_ADDRESS = '0x680288896065594F11a18D2B39a739dE81216bB4';

// Mock access token (fake JWT format for development)
export const MOCK_ACCESS_TOKEN = 'mock_jwt_token_' + MOCK_USER_ADDRESS;

// Mock user info (decoded from "JWT")
export const mockUserInfo = {
  account: MOCK_USER_ADDRESS,
  address: MOCK_USER_ADDRESS,
  email: 'mock.user@kstadium.io',
  username: 'MockUser',
  createdAt: '2025-01-01T00:00:00.000Z'
};

// Mock login response
export const mockLoginResponse = {
  data: {
    data: {
      accessToken: MOCK_ACCESS_TOKEN
    }
  }
};

// Mock JWT decode function
export const mockJwtDecode = (token) => {
  return {
    info: mockUserInfo,
    exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
    iat: Math.floor(Date.now() / 1000)
  };
};

// Export all mock data
export default {
  MOCK_USER_ADDRESS,
  MOCK_ACCESS_TOKEN,
  mockUserInfo,
  mockLoginResponse,
  mockJwtDecode
};