import React, { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react';

import _ from 'lodash';
import $script from 'scriptjs';
import ResizeObserver from 'rc-resize-observer';

import { external } from '../common/external';
import NotSupport from '../components/NotSupport';
import Placeholder from '../components/Placeholder';

import styles from './index.module.scss';

external(window);

const sendMessage = (type: string, payload?: any) => {
  window.parent.postMessage({
    type,
    payload,
  }, '*');
};

const Home: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const refs = useRef<{moduleID: number, ref: React.RefObject<HTMLDivElement>}[]>([]);

  // first render
  useEffect(() => {
    // event handler
    function messageHandler(event: MessageEvent) {
      const { type, payload } = event.data;
      if (/^mango-iframe_/.test(type)) {
        console.log('received-message-from-mango-admin:', type, payload);
      }
      switch(type) {
        case 'mango-iframe_load-common-component':
          // load common js
          $script(payload.editJS, () => {
            sendMessage('mango-iframe_common-component-loaded');
          });
          break;
        case 'mango-iframe_load-components':
          // load scripts
          const scriptFiles = _.uniq<string>(payload.map((module: Module) => _.get(module, 'component.editJS')).filter((item: string) => !!item));
          // reset refs
          refs.current = payload.map((module: Module) => ({
            moduleID: module.moduleID,
            ref: React.createRef<HTMLDivElement>()
          }));
          // in general, scriptFiles will always be with length
          if (scriptFiles.length) {
            $script(scriptFiles, () => {
              setModules(payload)
            });
          } else {
            setModules(payload);
          }
          break;
        case 'mango-iframe_update-component-data':
          setModules(modules => {
            const copyModules = [...modules];
            const updateIndex = copyModules.findIndex(module => module.moduleID === payload.moduleID);
            if (updateIndex > -1) {
              copyModules[updateIndex] = payload;
            }
            return copyModules;
          })
          break;
      }
    }
    // listen
    window.addEventListener('message', messageHandler ,false);
    // ready
    sendMessage('mango-iframe_page-ready');

    // destory
    return () => window.removeEventListener('message', messageHandler);
  }, []);

  const callback = () => {};

  const renderComponentList = () => {
    // render
    const list = modules.map((module, index) => {
      const { moduleID, component, moduleData } = module;
      // 占位组件
      if (moduleID === 0) {
        return (
          <Placeholder
            key={moduleID}
            data={moduleData}
            ref={refs.current[index].ref}
          />
        );
      } else {
        if (!component) {
          return (
            <NotSupport
              key={moduleID}
              ref={refs.current[index].ref}
            />
          );
        } else {
          const Component = (window as any)[component.library];
          return Component ? (
            // eslint-disable-next-line react/jsx-pascal-case
            <Component.default
              ref={refs.current[index].ref}
              key={moduleID}
              defaultProps={component.defaultProps}
              data={moduleData}
              callback={callback}
            />)
          : null;
        }
      }
    })
    return list.length ? list : <p>请拖拽组件到容器内</p>;
  };

  // page resize handler
  const pageResizeHandler = useCallback(() => {
    const layoutModules: any[] = [];
    // refs entries
    refs.current.forEach(item => {
      const { moduleID, ref } = item;
      const rect = ref.current?.getBoundingClientRect();
      layoutModules.push({
        moduleID,
        offsetY: rect?.y,
        height: rect?.height
      });
    });
    console.log('****', layoutModules);
    sendMessage('mango-iframe_page-resized', {
      pageHeight: pageRef.current?.getBoundingClientRect().height,
      modules: layoutModules
    });
  }, []);

  // layout change
  useLayoutEffect(() => {
    pageResizeHandler();
  });

  return (
    <ResizeObserver>
      <div className={styles.container} ref={pageRef}>
        {
          renderComponentList()
        }
      </div>
    </ResizeObserver>
  );
};

export default Home;
