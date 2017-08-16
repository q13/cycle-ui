/**
 * @Date:   2017-08-16T14:13:21+08:00
 * @Last modified time: 2017-08-16T15:59:50+08:00
 */
import xs from 'xstream';
import {run} from '@cycle/run';
import {makeDOMDriver, div} from '@cycle/dom';

function main(sources) {
  const sinks = {
    DOM: sources.DOM.select('input').events('click')
      .map(ev => ev.target.checked)
      .startWith(false)
      .map(_ =>
        div(['test2'])
      )
  };
  return sinks;
}
const drivers = {
  DOM: makeDOMDriver('#app')
};
run(main, drivers);
