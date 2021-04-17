import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';

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
    // 事件处理
    function messageHandler(event: MessageEvent) {
      const { type, payload } = event.data;
      if (/^edit-a-/.test(type)) {
        console.log('received-from-admin:', type, payload);
      }
      switch(type) {
        case 'edit-a-common':
          // load common js
          $script(payload.editJS, () => {
            sendMessage('edit-i-common_loaded');
          });
          break;
        case 'edit-a-module_all':
          // Load scripts
          const scriptFiles = _.uniq<string>(payload.map((module: Module) => _.get(module, 'component.editJS')).filter((item: string) => !!item));
          // reset refs
          refs.current = payload.map((module: Module) => ({
            moduleID: module.moduleID,
            ref: React.createRef<HTMLDivElement>()
          }));
          if (scriptFiles.length) {
            $script(scriptFiles, () => {
              setModules(payload)
            });
          } else {
            setModules(payload);
          }
          break;
        case 'edit-a-module_single':
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
    // 监听
    window.addEventListener('message', messageHandler ,false);
    // ready
    sendMessage('edit-i-ready');

    // 注销
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
    return list;
  };

  const toggelPageResize = () => {
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
    sendMessage('edit-i-rendered', {
      pageHeight: pageRef.current?.getBoundingClientRect().height,
      modules: layoutModules
    });
  }

  // layout change
  useLayoutEffect(() => {
    toggelPageResize();
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
