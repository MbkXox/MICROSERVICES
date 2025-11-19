export interface Gif {
  id: string;
  url: string;
  title: string;
}

export interface Favorite {
  id: number;
  userId: string;
  gifId: string;
  createdAt: string;
}

export interface FavoriteWithGif {
  id: number;
  gifId: string;
  createdAt: string;
  gif: Gif | null;
}