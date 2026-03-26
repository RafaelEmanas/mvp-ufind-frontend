import { components, operations } from './api';

// Item types
export type Item = components['schemas']['Item'];
export type PageItem = operations['getAllItems']['responses'][200]['content']['*/*'];
export type PageItemContent = PageItem['content'];

// Auth data
export type UserData = components['schemas']['UserInfoDTO'];

// Upload types
export type PresignedUploadResponse = components['schemas']['PresignedUploadDTO'];

// Request types
export type RegisterItemRequest = components['schemas']['RegisterItemRequest'];
export type MarkItemClaimedRequest = components['schemas']['MarkItemClaimedRequest'];

/**
 * Update request type - separate from RegisterItemRequest because:
 * - Backend update endpoint may have different validation rules
 * - Some fields might be optional or not allowed in updates
 * - Backend might need additional fields (e.g., updatedBy, updatedAt)
 * 
 * TODO: When implementing backend update endpoint, create proper UpdateItemRequest DTO
 * For now, using Partial<RegisterItemRequest> as a placeholder
 */
export type UpdateItemRequest = Partial<RegisterItemRequest> & {
  // Add any fields specific to updates here when backend is implemented
  // Examples might include:
  // updatedBy?: string;
  // reason?: string;
};
