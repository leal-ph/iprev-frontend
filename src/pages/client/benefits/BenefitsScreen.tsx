import React, { memo, useEffect, useState, useMemo } from 'react'
import { List, message } from 'antd'
import DoubleCard from '~/assets/components/DoubleCard'
import GlobalLayout from '~/assets/components/GlobalLayout'
import ScheduleList from '~/assets/components/ScheduleList'
import CustomButton from '~/assets/components/CustomButton'
import { useStores } from '~/hooks/use-stores'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Benefit, ScheduledBenefit, ResponseStatus } from '~/types'

const BenefitScreen = () => {
  const { benefitStore, clientStore, authStore } = useStores()

  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [scheduledBenefits, setScheduledBenefits] = useState<ScheduledBenefit[]>([])

  const scheduleList = useMemo(() => {
    if (scheduledBenefits) {
      return scheduledBenefits.map((b) => ({
        id: b.benefit._id,
        dateTime: b.date ? b.date.toString() : 'null',
        name: `${b.benefit.companyName} ${b.benefit.companyCategory}`,
        status: b.status,
        canEdit: false,
        canExclude: true,
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

  const selectBenefit = useCallback(
    async (benefitId: string) => {
      let benefitExists = false

      await scheduledBenefits.forEach(async (b) => {
        if (b.benefit._id === benefitId) {
          benefitExists = true
        }
      })

      if (!benefitExists) {
        const response = await clientStore.updateBenefits(benefitId, clientStore.currentUser?._id)
        if (response === ResponseStatus.SUCCESS) {
          message.success('Solicitado com sucesso')
          if (authStore.loggedUser?._id) {
            await clientStore.loadClient(authStore.loggedUser._id)
            if (clientStore.currentUser?.required_benefits) {
              setScheduledBenefits(clientStore.currentUser.required_benefits)
            }
          }
          return
        } else {
          message.error('Erro na solicitação')
          return
        }
      } else {
        message.error('Benefício já solicitado!')
        return
      }
    },
    [clientStore, authStore.loggedUser, scheduledBenefits],
  )

  const onExclude = useCallback(
    async (benefitId: string) => {
      const response = await clientStore.excludeBenefits(benefitId, clientStore.currentUser?._id)
      if (response === ResponseStatus.SUCCESS) {
        message.success('Solicitação removida com sucesso')
        if (authStore.loggedUser?._id) {
          await clientStore.loadClient(authStore.loggedUser._id)
          if (clientStore.currentUser?.required_benefits) {
            setScheduledBenefits(clientStore.currentUser.required_benefits)
          }
        }
        return
      } else {
        message.error('Erro na solicitação')
        return
      }
    },
    [clientStore, authStore.loggedUser],
  )

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
            children: <ScheduleList itens={scheduleList} onExclude={onExclude} />,
            title: 'Benefícios Agendados',
          }}
        />
      }
    />
  )
}

export default memo(BenefitScreen)
