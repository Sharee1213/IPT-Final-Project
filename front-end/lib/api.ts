const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  [key: string]: any;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit & { token?: string; params?: Record<string, any> } = {}
): Promise<T> {
  const { token, params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'An error occurred');
  }

  return data;
}

export const api = {
  // Auth
  register: (payload: any) =>
    makeRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (email: string, password: string) =>
    makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: (token: string) =>
    makeRequest('/auth/logout', { method: 'POST', token }),
  getCurrentUser: (token: string) =>
    makeRequest('/auth/user', { token }),

  // User
  getProfile: (token: string) =>
    makeRequest('/user/profile', { token }),
  updateProfile: (token: string, payload: any) =>
    makeRequest('/user/profile', { method: 'POST', token, body: JSON.stringify(payload) }),

  // Dashboard
  getAdminDashboard: (token: string) =>
    makeRequest('/dashboard/admin', { token }),
  getStudentDashboard: (token: string) =>
    makeRequest('/dashboard/student', { token }),

  // Events
  getEvents: (token: string, params?: any) =>
    makeRequest('/events', { token, params }),
  getUpcomingEvents: () =>
    makeRequest('/events/upcoming'),
  getEventDetail: (token: string, id: number) =>
    makeRequest(`/events/${id}`, { token }),
  createEvent: (token: string, payload: any) =>
    makeRequest('/events', { method: 'POST', token, body: JSON.stringify(payload) }),
  updateEvent: (token: string, id: number, payload: any) =>
    makeRequest(`/events/${id}`, { method: 'POST', token, body: JSON.stringify(payload) }),
  deleteEvent: (token: string, id: number) =>
    makeRequest(`/events/${id}`, { method: 'DELETE', token }),

  // Announcements
  getAnnouncements: (token: string, params?: any) =>
    makeRequest('/announcements', { token, params }),
  getLatestAnnouncements: () =>
    makeRequest('/announcements/latest'),
  getAnnouncementDetail: (token: string, id: number) =>
    makeRequest(`/announcements/${id}`, { token }),
  createAnnouncement: (token: string, payload: any) =>
    makeRequest('/announcements', { method: 'POST', token, body: JSON.stringify(payload) }),
  updateAnnouncement: (token: string, id: number, payload: any) =>
    makeRequest(`/announcements/${id}`, { method: 'POST', token, body: JSON.stringify(payload) }),
  deleteAnnouncement: (token: string, id: number) =>
    makeRequest(`/announcements/${id}`, { method: 'DELETE', token }),

  // Attendance
  getAttendance: (token: string, params?: any) =>
    makeRequest('/attendance', { token, params }),
  getMyAttendanceHistory: (token: string) =>
    makeRequest('/attendance/my-history', { token }),
  markAttendance: (token: string, payload: any) =>
    makeRequest('/attendance/mark', { method: 'POST', token, body: JSON.stringify(payload) }),

  // Fines
  getFines: (token: string, params?: any) =>
    makeRequest('/fines', { token, params }),
  getFineDetail: (token: string, id: number) =>
    makeRequest(`/fines/${id}`, { token }),
  createFine: (token: string, payload: any) =>
    makeRequest('/fines', { method: 'POST', token, body: JSON.stringify(payload) }),
  updateFine: (token: string, id: number, payload: any) =>
    makeRequest(`/fines/${id}`, { method: 'POST', token, body: JSON.stringify(payload) }),

  // Payments
  getPayments: (token: string, params?: any) =>
    makeRequest('/payments', { token, params }),
  getPaymentDetail: (token: string, id: number) =>
    makeRequest(`/payments/${id}`, { token }),
  recordPayment: (token: string, payload: any) =>
    makeRequest('/payments', { method: 'POST', token, body: JSON.stringify(payload) }),
  getPaymentSummary: (token: string) =>
    makeRequest('/payments-summary', { token }),

  // Clearance
  getMyClearance: (token: string) =>
    makeRequest('/clearance', { token }),
  getClearanceList: (token: string, params?: any) =>
    makeRequest('/clearance/list', { token, params }),
  getClearanceDetail: (token: string, id: number) =>
    makeRequest(`/clearance/${id}`, { token }),
  updateClearance: (token: string, id: number, payload: any) =>
    makeRequest(`/clearance/${id}`, { method: 'POST', token, body: JSON.stringify(payload) }),

  // Feedback
  getFeedback: (token: string, params?: any) =>
    makeRequest('/feedback', { token, params }),
  getFeedbackDetail: (token: string, id: number) =>
    makeRequest(`/feedback/${id}`, { token }),
  submitFeedback: (token: string, payload: any) =>
    makeRequest('/feedback', { method: 'POST', token, body: JSON.stringify(payload) }),
  respondToFeedback: (token: string, id: number, payload: any) =>
    makeRequest(`/feedback/${id}/respond`, { method: 'POST', token, body: JSON.stringify(payload) }),

  // Users (Admin)
  getCurrentUser: (token: string) =>
  makeRequest('/auth/profile', { token }),

getProfile: (token: string) =>
  makeRequest('/auth/profile', { token }),

updateProfile: (token: string, payload: any) =>
  makeRequest('/auth/profile', { method: 'PUT', token, body: JSON.stringify(payload) }),

// Add these two (for admin):
deactivateUser: (token: string, id: number) =>
  makeRequest(`/admin/users/${id}/deactivate`, { method: 'PATCH', token }),

activateUser: (token: string, id: number) =>
  makeRequest(`/admin/users/${id}/activate`, { method: 'PATCH', token }),

getAdminUsers: (token: string) =>
  makeRequest('/admin/users', { token }),