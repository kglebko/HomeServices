export interface AdminUser {
    id: number;
    username: string;
    email: string;
    created_at: string;
}

export interface News {
    id: number;
    title: string;
    content: string;
    full_content?: string;
    category: string;
    image_url?: string;
    author: string;
    likes: number;
    comments: number;
    created_at: string;
    updated_at: string;
    is_published: boolean;
}

export interface ImageInfo {
    uri: string;
    type: string;
    name: string;
}

export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
    success: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface NewsFormData {
    title: string;
    content: string;
    full_content: string;
    category: string;
    author: string;
    image: ImageInfo | null;
}