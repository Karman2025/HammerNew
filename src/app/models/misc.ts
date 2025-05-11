export type KeyPrefix = 'edit' | 'new';
export type HTTPMethodType = 'Post' | 'Put' | 'Get' | 'Delete';
export type EditParam<T> = {
    field: keyof T;
    data: T;
};
export const LandScapeAspectRatio = Math.sqrt(2);
export const PortraitAspectRatio = 1 / LandScapeAspectRatio;

export type TextDirection = 'LTR' | 'RTL';
