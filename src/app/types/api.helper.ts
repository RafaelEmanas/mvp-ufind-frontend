import { components, operations } from './api';

// Item types
export type Item = components['schemas']['Item'];

export type PageItem = operations['getAllItems']['responses'][200]['content']['*/*'];
export type PageItemContent = PageItem['content'];