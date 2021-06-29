import { Button } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import React, { memo } from 'react'
import { ReactNode } from 'react'

interface Props extends ButtonProps {
  children: ReactNode
}

const CustomButton = ({ children, ...props }: Props) => {
  return (
    <Button
      className="custom-button"
      style={{
        fontWeight: 'bold',
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

export default memo(CustomButton)
