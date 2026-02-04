/**
 * Simple localStorage-based Authentication Library
 * For patient education video management
 */

import type { OnScreenText } from './patientEducation';

// Storage keys
const USERS_KEY = 'patient_education_users';
const SESSION_KEY = 'patient_education_session';
const VIDEOS_KEY_PREFIX = 'patient_education_videos_';

// Types
export interface StoredUser {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface UserSession {
  userId: string;
  username: string;
  displayName: string;
  loginAt: string;
}

export interface SavedVideo {
  id: string;
  userId: string;
  createdAt: string;
  title: string;
  jobId: string;
  jobId2?: string;
  status: 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  part1Url?: string;
  part2Url?: string;
  prompt: string;
  promptPart2?: string;
  ost: OnScreenText;
  model: string;
  duration: 12 | 24;
  providerNote?: string;
}

/**
 * Simple password hashing (basic obfuscation - not cryptographically secure)
 * Uses a basic hash with salt for simple protection
 */
export function hashPassword(password: string): string {
  const salt = 'msw_patient_edu_v1_';
  let hash = 0;
  const combined = salt + password;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ============ User Management ============

/**
 * Get all stored users
 */
export function getStoredUsers(): StoredUser[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save users to localStorage
 */
function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Create a new user
 */
export function createUser(
  username: string,
  password: string,
  displayName: string
): { success: boolean; user?: StoredUser; error?: string } {
  const users = getStoredUsers();
  const normalizedUsername = username.toLowerCase().trim();

  // Validation
  if (normalizedUsername.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }
  if (normalizedUsername.length > 20) {
    return { success: false, error: 'Username must be 20 characters or less' };
  }
  if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
    return { success: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }
  if (users.some(u => u.username === normalizedUsername)) {
    return { success: false, error: 'Username already exists' };
  }

  const newUser: StoredUser = {
    id: generateId(),
    username: normalizedUsername,
    passwordHash: hashPassword(password),
    displayName: displayName.trim() || normalizedUsername,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

/**
 * Validate user credentials
 */
export function validateCredentials(
  username: string,
  password: string
): { success: boolean; user?: StoredUser; error?: string } {
  const users = getStoredUsers();
  const normalizedUsername = username.toLowerCase().trim();
  const user = users.find(u => u.username === normalizedUsername);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, error: 'Invalid password' };
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString();
  saveUsers(users);

  return { success: true, user };
}

// ============ Session Management ============

/**
 * Get current session
 */
export function getSession(): UserSession | null {
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Set session
 */
export function setSession(session: UserSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Clear session
 */
export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// ============ Video Management ============

/**
 * Get user's saved videos
 */
export function getUserVideos(userId: string): SavedVideo[] {
  try {
    const data = localStorage.getItem(`${VIDEOS_KEY_PREFIX}${userId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save a video to user's library
 */
export function saveUserVideo(video: SavedVideo): void {
  const videos = getUserVideos(video.userId);
  const existingIndex = videos.findIndex(v => v.id === video.id);

  if (existingIndex >= 0) {
    videos[existingIndex] = video;
  } else {
    videos.unshift(video); // Add to beginning (newest first)
  }

  localStorage.setItem(`${VIDEOS_KEY_PREFIX}${video.userId}`, JSON.stringify(videos));
}

/**
 * Delete a video from user's library
 */
export function deleteUserVideo(userId: string, videoId: string): void {
  const videos = getUserVideos(userId);
  const filtered = videos.filter(v => v.id !== videoId);
  localStorage.setItem(`${VIDEOS_KEY_PREFIX}${userId}`, JSON.stringify(filtered));
}

/**
 * Update video status/data
 */
export function updateUserVideo(
  userId: string,
  videoId: string,
  updates: Partial<SavedVideo>
): void {
  const videos = getUserVideos(userId);
  const video = videos.find(v => v.id === videoId);
  if (video) {
    Object.assign(video, updates);
    localStorage.setItem(`${VIDEOS_KEY_PREFIX}${userId}`, JSON.stringify(videos));
  }
}

/**
 * Get video count for user
 */
export function getUserVideoCount(userId: string): number {
  return getUserVideos(userId).length;
}
