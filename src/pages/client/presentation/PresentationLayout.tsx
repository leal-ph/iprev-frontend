import React, { memo, ReactNode } from 'react'

import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import '~/assets/styles/carousel.css'

interface Props {
  children?: ReactNode
}

const PresentationLayout = ({ children }: Props) => {
  return (
    <div style={{ backgroundColor: '#F6F6F6', marginBottom: '10px', marginTop: '50px' }}>
      <div style={{ marginTop: '-20px' }}>{children}</div>
    </div>
  )
}

export default memo(PresentationLayout)
