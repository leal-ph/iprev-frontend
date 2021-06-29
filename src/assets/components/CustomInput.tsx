import { Input } from 'antd'
import { InputProps } from 'antd/lib/input'
import React, { memo } from 'react'
import { ReactNode } from 'react'

interface Props extends InputProps {
  children?: ReactNode
}

const CustomInput = ({ children, ...props }: Props) => {
  return (
    <Input className="custom-input" {...props}>
      {children}
    </Input>
  )
}

export default memo(CustomInput)
