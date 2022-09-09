import * as fromCourse from './course.reducer';
import { CourseSelector } from './course.selectors';

describe('Course Selectors', () => {
  it('should select the feature state', () => {
    const result = CourseSelector({
      [fromCourse.courseFeatureKey]: { loading: false, courses: [] },
    });

    expect(result).toEqual({ loading: false, courses: [] });
  });
});
