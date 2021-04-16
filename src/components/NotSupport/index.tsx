import React from 'react'

import styles from './index.module.scss'

interface Props {
  ref: React.RefObject<HTMLDivElement>
}

const NotSupport = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div className={styles.container}>
      页面不支持此组件
    </div>
  )
})

export default NotSupport
