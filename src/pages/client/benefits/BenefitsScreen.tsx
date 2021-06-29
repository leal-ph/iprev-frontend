import React, { memo, useEffect, useState } from 'react'
import { List } from 'antd'
import DoubleCard from '~/assets/components/DoubleCard'
import GlobalLayout from '~/pages/GlobalLayout'
import ScheduleList from '~/assets/components/ScheduleList'
import CustomButton from '~/assets/components/CustomButton'
import { useStores } from '~/hooks/use-stores'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Benefit } from '~/types'

const BenefitScreen = () => {
  // const { companies, load, loading } = benefitStore
  // const { loggedAssociated, loadAssociated, loggedUser } = authStore

  /* const scheduleList = useMemo(() => {
    if (loggedAssociated) {
      return loggedAssociated.benefits.map((b) => ({
        id: b.benefit._id,
        dateTime: b.date.toISOString(),
        name: `${b.benefit.companyName} ${b.benefit.companyCategory}`,
        canEdit: false,
        canExclude: false,
      }))
    }

    return []
  }, [loggedAssociated]) */

  const { benefitStore } = useStores()

  const [benefits, setBenefits] = useState<Benefit[]>([])

  useEffect(() => {
    async function loadBenefits() {
      await benefitStore.loadAll()
      setBenefits(benefitStore.benefits)
    }
    loadBenefits()
  }, [benefitStore])

  const history = useHistory()

  const selectBenefit = useCallback((benefitId: string) => {
    console.log(benefitId)
  }, [])

  const scheduleList = [
    {
      id: '001',
      dateTime: 'string',
      name: 'Comp A',
      link: 'http://link',
      canExclude: false,
      canEdit: false,
    },
  ]

  return (
    <GlobalLayout
      title="Benefícios"
      onBack={() => history.push('/client/menu')}
      content={
        <DoubleCard
          cardOne={{
            children: (
              <List>
                {benefits.map((c) => (
                  <List.Item className="custom-list-item" key={c._id}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        marginLeft: '10px',
                        marginRight: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>{c.companyName}</span>
                        <span>{c.companyCategory}</span>
                      </div>
                      <div>
                        <CustomButton type="primary" onClick={() => selectBenefit(c._id)}>
                          Solicitar
                        </CustomButton>
                      </div>
                    </div>
                  </List.Item>
                ))}
              </List>
            ),
            title: 'Empresas Convêniadas',
          }}
          cardTwo={{
            children: <ScheduleList itens={scheduleList} />,
            title: 'Benefícios Agendados',
          }}
        />
      }
    />
  )
}

export default memo(BenefitScreen)
