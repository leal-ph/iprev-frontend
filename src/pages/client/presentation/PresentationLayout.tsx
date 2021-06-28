import React, { memo, ReactNode, useRef } from 'react'
import { Divider } from 'antd'
import { useMediaQuery } from 'react-responsive'
import Solution01 from '~/assets/img/solutions-01.png'
import Solution02 from '~/assets/img/solutions-02.png'
import Solution03 from '~/assets/img/solutions-03.png'
import { Carousel } from 'react-responsive-carousel'
import { titleStyle } from '../../styles'

import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import '~/assets/styles/carousel.css'

interface Props {
  children?: ReactNode
}

const PresentationLayout = ({ children }: Props) => {
  const ref = useRef<any>()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  return (
    <div style={{ backgroundColor: '#F6F6F6', marginBottom: '10px' }}>
      {isPortrait ? (
        <Carousel
          ref={ref}
          showThumbs={false}
          showStatus={false}
          showArrows={false}
          autoPlay
          infiniteLoop
        >
          <div style={{ display: 'flex', flexDirection: 'row', marginRight: '10px' }}>
            <div>
              <img src={Solution01} alt="solution-01" height="94px" width="80px" />
            </div>
            <div>
              <p>
                <span style={titleStyle('25px')}>EXPLIQUE SEU PROBLEMA</span>
              </p>
              <span style={{ maxWidth: '30px' }}>
                <b>Nossa equipe jurídica estará a sua disposição para lhe auxiliar</b>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <img src={Solution02} alt="solution-02" height="94px" width="80px" />
            </div>
            <div>
              <p>
                <span style={titleStyle('25px')}>DESCUBRA SOLUÇÕES</span>
              </p>
              <span style={{ maxWidth: '30px' }}>
                <b>Nossa equipe jurídica lhe apresentará a solução adequada para sua demanda</b>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <img src={Solution03} alt="solution-03" height="94px" width="80px" />
            </div>
            <div>
              <p>
                <span style={titleStyle('25px')}>PROFISSIONAIS CAPACITADS</span>
              </p>
              <span style={{ maxWidth: '30px' }}>
                <b>
                  Atuação de forma ética, justa, honesta e transparente junto aos nossos clientes
                </b>
              </span>
            </div>
          </div>
        </Carousel>
      ) : (
        <div
          style={{
            height: '50px',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <img
                src={Solution01}
                alt="solution-01"
                height="94px"
                width="80px"
                style={{ marginRight: '10px' }}
              />
            </div>
            <div>
              <p>
                <span style={titleStyle('20px')}>EXPLIQUE SEU PROBLEMA</span>
              </p>
              <span style={{ maxWidth: '30px' }}>
                <b>Nossa equipe jurídica estará a sua disposição para lhe auxiliar</b>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <img
                src={Solution02}
                alt="solution-02"
                height="94px"
                width="80px"
                style={{ marginRight: '10px', marginLeft: '10px' }}
              />
            </div>
            <div>
              <p>
                <span style={titleStyle('20px')}>DESCUBRA SOLUÇÕES</span>
              </p>
              <span style={{ maxWidth: '30px' }}>
                <b>Nossa equipe jurídica lhe apresentará a solução adequada para sua demanda</b>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <img
                src={Solution03}
                alt="solution-03"
                height="94px"
                width="80px"
                style={{ marginRight: '10px' }}
              />
            </div>
            <div>
              <p>
                <span style={titleStyle('20px')}>PROFISSIONAIS CAPACITADOS</span>
              </p>
              <span style={{ maxWidth: '30px', marginRight: '10px' }}>
                <b>
                  Atuação de forma ética, justa, honesta e transparente junto aos nossos clientes
                </b>
              </span>
            </div>
          </div>
        </div>
      )}
      <Divider />
      <div style={{ marginTop: '-20px' }}>{children}</div>
    </div>
  )
}

export default memo(PresentationLayout)
