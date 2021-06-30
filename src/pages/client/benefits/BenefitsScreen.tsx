import React, { memo, useEffect, useState, useMemo } from 'react'
import { List } from 'antd'
import DoubleCard from '~/assets/components/DoubleCard'
import GlobalLayout from '~/pages/GlobalLayout'
import ScheduleList from '~/assets/components/ScheduleList'
import CustomButton from '~/assets/components/CustomButton'
import { useStores } from '~/hooks/use-stores'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Benefit, ScheduledBenefit } from '~/types'

const BenefitScreen = () => {
  const { benefitStore, clientStore, authStore } = useStores()

  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [scheduledBenefits, setScheduledBenefits] = useState<ScheduledBenefit[]>([])

  const scheduleList = useMemo(() => {
    if (scheduledBenefits) {
      return scheduledBenefits.map((b) => ({
        id: b.benefit._id,
        dateTime: b.date.toString(),
        name: `${b.benefit.companyName} ${b.benefit.companyCategory}`,
        status: b.status,
        canEdit: false,
        canExclude: false,
      }))
    }

    return []
  }, [scheduledBenefits])

  useEffect(() => {
    async function loadBenefits() {
      await benefitStore.loadAll()
      setBenefits(benefitStore.benefits)
    }
    loadBenefits()
  }, [benefitStore])

  useEffect(() => {
    async function loadClient() {
      if (authStore.loggedUser?._id) {
        await clientStore.loadClient(authStore.loggedUser._id)
        if (clientStore.currentUser?.required_benefits) {
          setScheduledBenefits(clientStore.currentUser.required_benefits)
        }
      }
    }
    loadClient()
  }, [authStore.loggedUser, clientStore])

  const history = useHistory()

  const selectBenefit = useCallback((benefitId: string) => {
    console.log(benefitId)
  }, [])

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
            title: 'Empresas Conveniadas',
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
