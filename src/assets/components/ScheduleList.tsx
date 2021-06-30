import { faCalendarAlt, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { List, Tag } from 'antd'
import React, { memo, useCallback } from 'react'

interface ScheduleItem {
  id: string
  dateTime: string
  name: string
  status: string
  canExclude?: boolean
  canEdit?: boolean
}

interface Props {
  itens: ScheduleItem[]
  onExclude?: (id: string) => void
  onEdit?: (id: string) => void
}

const ScheduleList = ({ itens, onExclude, onEdit }: Props) => {
  const getStatusTag = useCallback((status: string) => {
    if (status === 'Marcado') {
      return <Tag color="green">Marcado</Tag>
    } else {
      return <Tag color="gold">Aguardando Marcação</Tag>
    }
  }, [])

  return (
    <List>
      {itens.map((i) => (
        <List.Item className="custom-list-item" key={i.id}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: '10px',
              marginRight: '10px',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <div style={{ marginRight: '5px' }}>
                <FontAwesomeIcon icon={faCalendarAlt} size="2x" color="#FBB829" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '5px' }}>
                <span>{i.name}</span>
                <span>Status: {getStatusTag(i.status)}</span>
              </div>
            </div>
            {(i.canEdit || i.canExclude) && (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {i.canEdit && onEdit && (
                  <div style={{ marginRight: i.canExclude ? '5px' : 0 }}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => onEdit(i.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                )}
                {i.canExclude && onExclude && (
                  <div>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => onExclude(i.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </List.Item>
      ))}
    </List>
  )
}

export default memo(ScheduleList)
