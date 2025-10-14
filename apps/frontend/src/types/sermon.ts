export interface Sermon {
  id: number;
  title: string;
  preacher: string;
  description?: string;
  date: string;
  duration?: string;
  audioUrl: string;
  audioPublicId: string;
  imageUrl?: string;
  imagePublicId?: string;
  downloadCount: number;
  playCount: number;
  createdAt: string;
  updatedAt: string;
}
