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

export interface BasicWall {
  wallID: number;
  ownerID: number;
  ownerUsername: string;
  edits: number;
  lastEdit: number;
  likes: number;
  liked: boolean;
}

export interface Wall extends BasicWall {
  width: number;
  height: number;
  pixels: Pixel[];
}

export interface FeedPost extends BasicWall {
  preview: Buffer;
}

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
      params: false,
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
    deleteWall: {
      uri: `${ApiVersion.v1}/delete-wall`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    reportWall: {
      uri: `${ApiVersion.v1}/report-wall`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    deleteUser: {
      uri: `${ApiVersion.v1}/delete-user`,
      params: true,
      body: false,
      opts: { method: 'DELETE', headers: { Accept: 'application/json' } },
    },
    selfDeleteUser: {
      uri: `${ApiVersion.v1}/delete-user`,
      params: false,
      body: false,
      opts: { method: 'DELETE', headers: { Accept: 'application/json' } },
    },
    reportedWalls: {
      uri: `${ApiVersion.v1}/reported-walls`,
      params: false,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    removeReport: {
      uri: `${ApiVersion.v1}/remove-report`,
      params: true,
      body: false,
      opts: { method: 'DELETE', headers: { Accept: 'application/json' } },
    },
    follow: {
      uri: `${ApiVersion.v1}/follow`,
      params: true,
      body: false,
      opts: { method: 'GET', headers: { Accept: 'application/json' } },
    },
    unfollow: {
      uri: `${ApiVersion.v1}/unfollow`,
      params: true,
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

export interface User {
  id: number;
  username: string;
  joined: number;
  avatar: string;
  contributionCount: number;
  admin: boolean;
  followingCount: number;
  followerCount: number;
  wallCount: number;
  likeCount: number;
}

export interface OtherUser extends User {
  isFollowing: boolean;
  isFollower: boolean;
}

export type UserState = {
  status: FetchStatus;
  user: User | null;
};

export enum ProfileTabSelection {
  WALLS = 'WALLS',
  FOLLOWING = 'FOLLOWING',
  LIKES = 'LIKES',
}
