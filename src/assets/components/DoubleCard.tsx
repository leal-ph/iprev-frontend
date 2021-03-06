import { CardProps } from 'antd/lib/card'
import React, { memo, ReactNode } from 'react'
import { useMediaQuery } from 'react-responsive'
import CustomCard from './CustomCard'
import { titleStyle } from '~/pages/styles'

interface CustomProps {
  children: ReactNode
  title?: string
  style?: React.CSSProperties
  props?: CardProps
}

interface Props {
  cardOne: CustomProps
  cardTwo: CustomProps
}

const DoubleCard = ({ cardOne, cardTwo }: Props) => {
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isPortrait ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CustomCard
        style={{
          ...cardOne.style,
          marginRight: isPortrait ? 0 : '5px',
          marginBottom: isPortrait ? '5px' : 0,
          width: isPortrait ? '90vw' : '40vw',
          height: isPortrait ? '50vh' : '75vh',
          overflowY: 'auto',
        }}
        title={<span style={titleStyle('20px')}>{cardOne.title}</span>}
        {...cardOne.props}
      >
        {cardOne.children}
      </CustomCard>
      <CustomCard
        style={{
          ...cardTwo.style,
          marginLeft: isPortrait ? 0 : '5px',
          marginTop: isPortrait ? '5px' : 0,
          width: isPortrait ? '90vw' : '40vw',
          height: isPortrait ? '50vh' : '75vh',
          overflowY: 'auto',
        }}
        title={<span style={titleStyle('20px')}>{cardTwo.title}</span>}
        {...cardTwo.props}
      >
        {cardTwo.children}
      </CustomCard>
    </div>
  )
}

export default memo(DoubleCard)
