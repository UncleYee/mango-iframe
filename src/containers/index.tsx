import React, { useRef, useLayoutEffect } from 'react';

import ResizeObserver from 'rc-resize-observer';

import { external } from '../common/external';

import styles from './index.module.scss';

external(window);

const Home: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  const renderComponentList = () => {
    return (<div>Render List</div>);
  };

  const toggelPageResize = () => {
    // TODO: layout change
  }

  // layout change
  useLayoutEffect(() => {
    toggelPageResize()
  })

  return (
    <ResizeObserver>
      <div className={styles.container} ref={pageRef}>
        {
          renderComponentList()
        }
      </div>
    </ResizeObserver>
  );
}

export default Home;
