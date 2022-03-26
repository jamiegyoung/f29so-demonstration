import { FeedState } from '../../types';
import feedReducer, { clearFeed } from './feedSlice';

describe('feed reducer', () => {
  const initialState: FeedState = {
    posts: [
      {
        wallID: 1,
        ownerID: 3,
        edits: 42,
        likes: 64,
        ownerUsername: 'bob',
        lastEdit: 0,
        preview: Buffer.from('abc'),
        liked: true,
      },
    ],
    status: 'success',
  };

  it('should handle initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual({
      posts: [],
      status: 'idle',
    });
  });
  it('should be able to clear the feed', () => {
    expect(feedReducer(initialState, clearFeed())).toEqual({
      posts: [],
      status: 'idle',
    });
  });
  it('should be able to set the likes', () => {
    const actual = feedReducer(initialState, {
      type: 'feed/setLikes',
      payload: {
        wallID: 1,
        likes: 68,
      },
    });
    expect(actual.posts[0].likes).toEqual(68);
  });
});
