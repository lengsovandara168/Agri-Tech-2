// API Configuration
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
export const STATIC_BASE = '/static';

// File Upload Configuration
export const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER || './public/static/uploads';
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// App Configuration
export const APP_NAME = 'AgriBot';
export const APP_DESCRIPTION = 'AI-powered Agricultural Assistant';
