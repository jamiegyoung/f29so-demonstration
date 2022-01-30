export type History = {
  userId: number;
  timestamp: string;
  color: string;
};

export interface LocalPixel {
  x: number;
  y: number;
  color: string;
}

export interface Pixel extends LocalPixel {
  history: History[];
}

export type Wall = {
  wallID: number;
  owner: string;
  width: number;
  height: number;
  pixels: Pixel[] | LocalPixel[];
};

export type FetchStatus = 'success' | 'idle' | 'loading' | 'error';

export type WallState = {
  id: number | null;
  wall: Wall | null;
  /*
   * idle is the default state
   * pending is when the thunk is dispatched
   * success is when the thunk has successfully returned a wall
   * failure is when the thunk has failed
   */
  status: FetchStatus;
  currentColor: string;
  editingPixel: LocalPixel | Pixel | null;
};

export type Route = {
  uri: string;
  params: boolean;
  opts?: RequestInit;
};

export type Routes = {
  [key: string]: Route;
};

export enum ApiVersion {
  v1 = 'v1',
}

export interface Api {
  version: ApiVersion;
  routes: Routes;
}

export const v1: Api = {
  version: ApiVersion.v1,
  routes: {
    getWall: {
      uri: `${ApiVersion.v1}/get-wall/`,
      params: true,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    createWall: {
      uri: `${ApiVersion.v1}/create-wall/`,
      params: true,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    getPreview: {
      uri: `${ApiVersion.v1}/get-preview/`,
      params: true,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    getFeed: {
      uri: `${ApiVersion.v1}/get-feed/`,
      params: true,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    addLike: {
      uri: `${ApiVersion.v1}/add-like/`,
      params: true,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
  },
};

export type FeedPost = {
  wallID: number;
  owner: number;
  edits: number;
  likes: number;
  lastEdit: string;
  preview: Buffer;
};

export type FeedState = {
  status: FetchStatus;
  posts: FeedPost[];
};

export type SetLikeType = {
  wallID: number;
  likes: number;
};
