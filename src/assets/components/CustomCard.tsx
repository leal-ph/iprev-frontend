import React from 'react'
import { memo } from 'react'
import { Card } from 'antd'
import { ReactNode } from 'react'
import { CardProps } from 'antd/lib/card'

interface Props extends CardProps {
  children: ReactNode
  title?: any
  style?: React.CSSProperties
}

const CustomCard = ({ children, title, style, ...props }: Props) => {
  return (
    <Card
      style={{ ...style }}
      title={title ? <span className="card-title">{title}</span> : undefined}
      className="custom-card"
      {...props}
    >
      {children}
    </Card>
  )
}

export default memo(CustomCard)
