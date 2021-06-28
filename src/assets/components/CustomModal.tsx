import React from 'react'
import { Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal'

interface Props extends ModalProps {
  content: React.ReactNode
}

const CustomModal = ({ content, ...props }: Props) => {
  return (
    <Modal {...props}>
      <div>{content}</div>
    </Modal>
  )
}

export default CustomModal
