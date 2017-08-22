/**
 * 工具库
 * @Date:   2017-08-17T11:52:23+08:00
 * @Last modified time: 2017-08-17T16:02:59+08:00
 */
import xs from 'xstream';
import {
  is,
  mergeDeepRight,
  ifElse,
  identity
} from 'ramda';

/**
 * 合并新值为object
 * @param  {[type]} streams [description]
 * @return {[type]}         [description]
 */
function combineMerge(...streams) {
  return xs.combine(...streams).map((vs) => {
    return mergeDeepRight(...vs);
  });
}
/**
 * Flatten all streams
 * @param  {[type]} streams [description]
 * @return {[type]}         [description]
 */
function flattenAll(...streams) {
  return xs.from(streams).flatten();
}

export {
  combineMerge,
  flattenAll
}
