import { UserReducer, initialState } from './user.reducer';

describe('User Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = UserReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
