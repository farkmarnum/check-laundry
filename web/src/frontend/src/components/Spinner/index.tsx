/* From https://loading.io/ */

import s from './style.css';

const Spinner = () => (
  <div
    class={s.ldsSpinner}
    style="transform: scale(0.5); margin: 0 auto; display: block;"
  >
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default Spinner;
