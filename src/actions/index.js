export * from './user';

export const SHOW_ACTIVITY_INDICATOR_ROOT = 'SHOW_ACTIVITY_INDICATOR_ROOT';
export const HIDE_ACTIVITY_INDICATOR_ROOT = 'HIDE_ACTIVITY_INDICATOR_ROOT';

export function rootLoader(request, text, isTrue) {
  return dispatch => {
    if (request) {
      return dispatch({
        type: SHOW_ACTIVITY_INDICATOR_ROOT,
        text: text || '',
        isTrue: isTrue || false,
      });
    } else {
      return dispatch({type: HIDE_ACTIVITY_INDICATOR_ROOT});
    }
  };
}
