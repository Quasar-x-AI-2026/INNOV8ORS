import api from './axios';

export interface OnboardUserPayload {
  role: 'user' | 'admin';
  adminCode?: string;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data?: {
    role: string;
    onboardingComplete: boolean;
  };
  needsOnboarding?: boolean;
}

export interface OnboardResponse {
  success: boolean;
  message: string;
  data?: {
    role: string;
  };
}

/**
 * Onboard a new user
 */
export const onboardUser = async (payload: OnboardUserPayload): Promise<OnboardResponse> => {
  const response = await api.post<OnboardResponse>('/users/onboard', payload);
  return response.data;
};

/**
 * Get current user details
 */
export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>('/users/me');
  return response.data;
};

/**
 * Check if user needs onboarding
 */
export const checkOnboardingStatus = async (): Promise<{ needsOnboarding: boolean; role?: string }> => {
  try {
    const response = await getCurrentUser();
    return {
      needsOnboarding: !response.data?.onboardingComplete || response.needsOnboarding || false,
      role: response.data?.role,
    };
  } catch (error: any) {
    // If user not found (404), they need onboarding
    if (error.response?.status === 404 || error.response?.data?.needsOnboarding) {
      return { needsOnboarding: true };
    }
    throw error;
  }
};