import React from 'react'

import styles from './index.module.scss'

interface Props {
  data: {
    level: 'info' | 'warn' | 'error',
    message: string
  },
  ref: React.RefObject<HTMLDivElement>
}

const theme = {
  info: {
    color: '#52c41a',
    borderColor: '#52c41a',
    backgroundColor: 'rgba(82, 196, 26, 0.3)'
  },
  warn: {
    color: '#faad14',
    borderColor: '#faad14',
    backgroundColor: 'rgba(250, 173, 20, 0.3)'
  },
  error: {
    color: '#ff4d4f',
    borderColor: '#ff4d4f',
    backgroundColor: 'rgba(255, 77, 79, 0.3)'
  }
}

const Placeholder = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { data: { level, message } } = props

  return (
    <div className={styles.container} style={theme[level]} ref={ref}>
      {message}
    </div>
  )
})

export default Placeholder
