export interface VideoDTO {
  id: string;
  description: string;
  clip_url: string;
  likes_count: number;
  views_count: number;
  publishing_user: string;
}

export interface PostDTO {
  videos: VideoDTO[];
  next_page: string;
}
