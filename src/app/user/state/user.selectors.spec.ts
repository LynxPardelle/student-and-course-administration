import * as fromUser from './user.reducer';
import { UserSelector } from './user.selectors';

describe('User Selectors', () => {
  it('should select the feature state', () => {
    const result = UserSelector({
      [fromUser.userFeatureKey]: { loading: false, users: [] },
    });

    expect(result).toEqual({ loading: false, users: [] });
  });
});
