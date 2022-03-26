export type History = {
  historyID: number;
  userID: number;
  username: string;
  timestamp: number;
  color: string;
};

export interface LocalPixel {
  pixelID: number;
  x: number;
  y: number;
  color: string;
}

export interface Pixel extends LocalPixel {
  history: History[];
}

export type Wall = {
  wallID: number;
  ownerID: number;
  edits: number;
  lastEdit: number;
  likes: number;
  width: number;
  height: number;
  pixels: Pixel[];
};


export type FeedPost = {
  wallID: number;
  ownerID: number;
  edits: number;
  likes: number;
  liked: boolean;
  lastEdit: string;
  preview: Buffer;
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
  editingPixel: Pixel | null;
};

export type FetchOpts = {
  params?: string[];
  body?: object | string;
};

export type Route = {
  uri: string;
  params: boolean;
  body: boolean;
  opts?: RequestInit;
};

export type Routes = {
  [key: string]: Route;
};

export enum ApiVersion {
  v1 = 'api/v1',
  registration = 'registration',
}

export interface Api {
  version: ApiVersion;
  routes: Routes;
}

export const registration: Api = {
  version: ApiVersion.v1,
  routes: {
    checkUsername: {
      uri: `${ApiVersion.registration}/check-username`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    submit: {
      uri: `${ApiVersion.registration}/submit`,
      params: false,
      body: true,
      opts: {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
  },
};

export const v1: Api = {
  version: ApiVersion.v1,
  routes: {
    getWall: {
      uri: `${ApiVersion.v1}/get-wall`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    createWall: {
      uri: `${ApiVersion.v1}/create-wall`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    getPreview: {
      uri: `${ApiVersion.v1}/get-preview`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    getFeed: {
      uri: `${ApiVersion.v1}/get-feed`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    toggleLike: {
      uri: `${ApiVersion.v1}/toggle-like`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    user: {
      uri: `${ApiVersion.v1}/user`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    selfUser: {
      uri: `${ApiVersion.v1}/user`,
      params: false,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    contributions: {
      uri: `${ApiVersion.v1}/contributions`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    getUserWalls: {
      uri: `${ApiVersion.v1}/get-user-walls`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    selfGetUserWalls: {
      uri: `${ApiVersion.v1}/get-user-walls`,
      params: false,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
  },
};

export type FeedState = {
  status: FetchStatus;
  posts: FeedPost[];
};

export type SetLikeType = {
  wallID: number;
  likes: number;
  liked: boolean;
};

export type User = {
  id: number;
  username: string;
  joined: number;
  avatar: string;
  contributionCount: number;
};

export type UserState = {
  status: FetchStatus;
  user: User | null;
};

export enum ProfileTabSelection {
  WALLS = 'WALLS',
  FOLLOWING = 'FOLLOWING',
  LIKES = 'LIKES',
}
