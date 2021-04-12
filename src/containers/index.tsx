import React, { useRef, useLayoutEffect } from 'react';

import ResizeObserver from 'rc-resize-observer';

import styles from './index.module.scss';

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
