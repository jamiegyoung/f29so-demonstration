import { FeedState } from '../../types';
import feedReducer, { clearFeed } from './feedSlice';

describe('wall reducer', () => {
  const initialState: FeedState = {
    posts: [
      {
        wallID: 1,
        owner: 3,
        edits: 42,
        likes: 64,
        lastEdit: '2020-01-01T00:00:00.000Z',
        preview: Buffer.from('abc'),
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
  it('should be able to add a like', () => {
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
