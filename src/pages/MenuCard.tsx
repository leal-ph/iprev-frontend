import React, { memo } from 'react'
import { Card } from 'antd'
import { useMediaQuery } from 'react-responsive'
interface Props {
  image: string
  label: string | React.ReactNode
  text?: string
  onClick: () => void
}

const MenuCard = ({ image, label, text, onClick }: Props) => {
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  return (
    <Card
      onClick={onClick}
      className="card-menu"
      style={{
        width: isPortrait ? '90vw' : '20vw',
        maxHeight: '45vh',
        margin: '0 10px',
        marginBottom: isPortrait ? '15vh' : 0,
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: isPortrait ? '-80px' : 0 }}
      >
        <img
          style={{
            width: isPortrait ? '80vw' : '15vw',
            marginTop: isPortrait ? '-5vh' : '-15vh',
            maxHeight: '32vh',
            borderRadius: '5%',
          }}
          src={image}
          alt={'img'}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div>
          <p className="subtitle">{label}</p>
        </div>
        {text && (
          <div>
            <p className="text" style={{ maxWidth: isPortrait ? '85vw' : '25vw' }}>
              {text}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default memo(MenuCard)
