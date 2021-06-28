import React, { memo } from 'react'
import GlobalHeader from './GlobalHeader'
import { LayoutType } from '~/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive'
import { MATERIAL_ICON_COLOR } from '~/consts/consts'

interface Props {
  content: JSX.Element
  title?: string
  subtitle?: string
  noShowHeader?: boolean
  noShowFooter?: boolean
  isAdminPage?: boolean
  onBack?: () => void
}

const GlobalLayout = ({
  content,
  title,
  subtitle,
  noShowHeader,
  noShowFooter,
  isAdminPage,
  onBack,
}: Props) => {
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const checkOnBack = onBack === undefined

  const subHeader = noShowHeader ? 60 : 100
  const subTitle = title ? (isPortrait ? 120 : 50) : 0
  const subFooter = noShowFooter ? 0 : 50
  // const subSubtitle =

  return (
    <div style={{ height: '100vh', overflow: 'auto', backgroundColor: '#F6F6F6' }}>
      {!noShowHeader && (
        <div style={{ height: '100px' }}>
          <GlobalHeader loginPrefix={isAdminPage ? LayoutType.ADMIN : LayoutType.CLIENT} />
        </div>
      )}
      <div>
        {title && (
          <div
            className="content-header"
            style={{
              width: '100%',
              height: isPortrait ? '120px' : '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: noShowHeader ? '150px' : 0,
              marginBottom: noShowHeader ? '40px' : 0,
              textAlign: 'center',
            }}
          >
            <div style={{ flex: 1 }}>
              {!checkOnBack && !isPortrait && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={onBack}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    size="2x"
                    color={MATERIAL_ICON_COLOR}
                    style={{ marginRight: '10px' }}
                  />
                  <span className="subtitle">Voltar</span>
                </div>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <span className="title">{title}</span>
              {subtitle && (
                <span className="subtitle" style={{ textAlign: 'center' }}>
                  {subtitle}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}></div>
          </div>
        )}
        {
          <div
            className="custom-content"
            style={{
              minHeight: `calc(100vh - ${subHeader + subTitle + subFooter}px)`,
              // marginTop: isPortrait ? '30px' : '0px',
            }}
          >
            {content}
          </div>
        }
      </div>
    </div>
  )
}

export default memo(GlobalLayout)
