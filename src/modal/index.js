/**
 * Modal implementation
 * @Date:   2017-08-16T17:43:44+08:00
 * @Last modified time: 2017-08-17T16:07:30+08:00
 */
import xs from 'xstream';
import flattenConcurrently from 'xstream/extra/flattenConcurrently';
import { span, div, button } from '@cycle/dom';
import {
  combineMerge,
  flattenAll
} from '../util';

//For test
//xs.of(xs.periodic(2000).map(v => 'a'), xs.periodic(3000).map(v => 'b'), xs.of('c')).flatten().debug('666').addListener(() => {});
/**
 * Intent
 * @param {*} DOM 
 */
function intent(DOM) {
  return {
    submitClick$: DOM.select('.btn-submit').events('click').map(() => 'submit'),
    cancelClick$: DOM.select('.btn-cancel').events('click').map(() => 'cancel')
  };
}
/**
 * Model 
 * @param {*} actions 
 * @param {*} sources 
 */
function model(actions, sources) {
  return combineMerge(xs.of({
  }), flattenConcurrently(xs.of(sources.visible, actions.cancelClick$.map(() => false))).map((v) => {
    return {
      visible: v
    };
  })).debug('test');
}
/**
 * View
 * @param {*} state$ 
 */
function view(state$) {
  return state$.map(({
    visible
  }) => {
    console.log('1');
    return div([span('.test', {
      style: {
        display: visible ? 'inline' : 'none'
      }
    }, 'test'), button('.btn-cancel', {
      type: 'button'
    }, 'Cancel')]);
  });
}

export default function main(sources) {
  sources = {
    visible: xs.of(false), ...sources
  };
  const sinks = {
    DOM: view(model(intent(sources.DOM), sources)),
    modalDOM: null,
  };
  return sinks;
}
