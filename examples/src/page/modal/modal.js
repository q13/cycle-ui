/**
 * @Date:   2017-08-16T14:13:21+08:00
 * @Last modified time: 2017-08-17T16:01:19+08:00
 */
import xs from 'xstream';
import {run} from '@cycle/run';
import {makeDOMDriver, div} from '@cycle/dom';
import Modal from '../../../../src/modal/index';

function main(sources) {
  const visible$ = xs.periodic(3000).map((v) => (v % 2 === 0)).debug('visible');
  visible$.addListener(() => {});
  const sinks = {
    DOM: xs.of(Modal({
      DOM: sources.DOM,
      visible: visible$
    }).DOM).flatten()
  };
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#app')
});
