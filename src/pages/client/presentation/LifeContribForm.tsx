import React, { memo, useState, useCallback, useEffect } from 'react'
import { Card, Radio, Button, Input, Select } from 'antd'
import PresentationLayout from './PresentationLayout'
import { useHistory } from 'react-router-dom'
import ClientLayout from '~/pages/GlobalLayout'

import { observer } from 'mobx-react-lite'
import { useStores } from '~/hooks/use-stores'
import { ResponseStatus } from '~/types'
import { useMediaQuery } from 'react-responsive'

const formOne = [
  'Entrar com pedido do benefício',
  'Receber valores atrasados',
  'Voltar a receber o benefício, pois ele foi cancelado',
  'Aumentar o valor do benefício',
  'Aumentar o prazo do benefício',
]

const formTwo = ['Sim, já dei entrada no INSS', 'Sim, mas meu pedido foi negado', 'Não']

const formThree = ['Sim', 'Não']

const formFour = [
  'Nunca contribuiu',
  '0 a 5 anos',
  '6 a 10 anos',
  '11 a 15 anos',
  '16 a 20 anos',
  '21 a 25 anos',
  '26 a 30 anos',
  'Acima de 30 anos',
]

const formFive = [
  'Até R$ 1.000,00',
  'Entre R$ 1.001,00 e R$ 2.000,00',
  'Entre R$ 2.001,00 e R$ 3.000,00',
  'Entre R$ 3.001,00 e R$ 5.000,00',
  'Acima de R$ 5.000,00',
]

/* const formSix = [
  'Sim, preciso de um advogado para resolver',
  'Já tenho advogado, mas preciso de uma orientação',
  'Não preciso de advogado, só quero uma orientação',
  'Caso necessário, gostaria de um advogado',
] */

const LifeContribForm = observer(() => {
  const { clientStore } = useStores()

  const history = useHistory()

  const [activeForm, setActiveForm] = useState(<></>)
  const [formResponses] = useState<any[]>([])

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  const saveHandler = useCallback(async () => {
    const response = await clientStore.updateAnswer(formResponses)
    if (response === ResponseStatus.SUCCESS) {
      history.push('/client/additional')
    }
  }, [clientStore, formResponses, history])

  const update = (response: any, formIndex: number) => {
    if (formResponses.length > formIndex - 1) {
      formResponses[formIndex] = response
    } else {
      formResponses.push(response)
    }
  }

  const renderFormSeven = useCallback(
    (saveInfos: boolean) => {
      if (saveInfos) {
        // TODO: Salvar dados no Banco.
      }
      setActiveForm(
        <div>
          <h3 style={{ marginBottom: '10px' }}>Número do processo RPV:</h3>
          <Input
            className="custom-input"
            name="rpv"
            key="rpv"
            maxLength={200}
            onChange={(e) => {
              update(['Número do processo RPV:', e.target.value], 6)
            }}
          />
          <h3 style={{ marginBottom: '10px' }}>Número do precatório:</h3>
          <Input
            className="custom-input"
            name="precatorio"
            key="precatorio"
            maxLength={200}
            onChange={(e) => {
              update(['Número do precatório:', e.target.value], 7)
            }}
          />
          <div style={{ marginTop: '5vh', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              style={{ width: '50%', marginRight: '1vh' }}
              onClick={() => renderFormSix(false)}
            >
              VOLTAR
            </Button>
            <Button
              style={{ width: '50%', marginLeft: '1vh' }}
              type="primary"
              onClick={() => saveHandler()}
            >
              CONTINUAR
            </Button>
          </div>
        </div>,
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saveHandler, update],
  )

  const renderFormSix = useCallback(
    (saveInfos: boolean) => {
      if (saveInfos) {
        // TODO: Salvar dados no Banco.
      }
      setActiveForm(
        <div>
          <h3>Resuma seu problema em até 200 caracteres:</h3>
          <Input.TextArea
            className="custom-input"
            name="problemdescription"
            key="problemdescription"
            maxLength={200}
            onChange={(e) => {
              update(['Descrição do problema:', e.target.value], 5)
            }}
          />
          <div style={{ marginTop: '5vh', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              style={{ width: '50%', marginRight: '1vh' }}
              onClick={() => renderFormFive(false)}
            >
              VOLTAR
            </Button>
            <Button
              style={{ width: '50%', marginLeft: '1vh' }}
              type="primary"
              onClick={() => renderFormSeven(false)}
            >
              CONTINUAR
            </Button>
          </div>
        </div>,
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saveHandler, update],
  )

  const renderFormFive = useCallback(
    (saveInfos: boolean) => {
      if (saveInfos) {
        // TODO: Salvar dados no Banco.
      }
      setActiveForm(
        <div>
          <h3>Informe o valor da sua última renda:</h3>
          <Radio.Group
            style={{ display: 'flex', flexDirection: 'column' }}
            onChange={(e) => {
              update(['Informe o valor da sua última renda', e.target.value], 4)
            }}
          >
            {formFive.map((entry) => (
              <Radio value={entry} key={entry}>
                {isPortrait ? (
                  <span>{entry.length > 40 ? `${entry.substring(0, 40)}...` : entry}</span>
                ) : (
                  entry
                )}
              </Radio>
            ))}
          </Radio.Group>
          <div style={{ marginTop: '5vh', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              style={{ width: '50%', marginRight: '1vh' }}
              onClick={() => renderFormThree(false)}
            >
              VOLTAR
            </Button>
            <Button
              style={{ width: '50%', marginLeft: '1vh' }}
              type="primary"
              onClick={() => renderFormSix(true)}
            >
              CONTINUAR
            </Button>
          </div>
        </div>,
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPortrait, update],
  )

  const renderFormFour = useCallback(
    (saveInfos: boolean) => {
      if (saveInfos) {
        // TODO: Salvar dados no Banco.
      }
      setActiveForm(
        <div>
          <h3>Qual foi o tempo de contribuição?</h3>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Select
              className="custom-select"
              onChange={(time) => {
                update(['Qual foi o tempo de contribuição?', time], 3)
              }}
              style={{ width: '100%' }}
            >
              {formFour.map((time) => (
                <Select.Option value={time} key={time}>
                  {time}
                </Select.Option>
              ))}
            </Select>
          </div>
          {/* <Input
          className="custom-list"
          name="contrib-time"
          key="contrib-time"
          onChange={(e) => {
            update(['Qual foi o tempo de contribuição?', e.target.value], 3)
          }}
        /> */}
          <div style={{ marginTop: '5vh', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              style={{ width: '50%', marginRight: '1vh' }}
              onClick={() => renderFormThree(false)}
            >
              VOLTAR
            </Button>
            <Button
              style={{ width: '50%', marginLeft: '1vh' }}
              type="primary"
              onClick={() => renderFormFive(true)}
            >
              CONTINUAR
            </Button>
          </div>
        </div>,
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [update],
  )

  const renderFormThree = useCallback(
    (saveInfos: boolean) => {
      if (saveInfos) {
        // TODO: Salvar dados no Banco.
      }
      setActiveForm(
        <div>
          <h3>Já contribuiu para o INSS?</h3>
          <Radio.Group
            style={{ display: 'flex', flexDirection: 'column' }}
            onChange={(e) => {
              update(['Já contribuiu para o INSS?', e.target.value], 2)
            }}
          >
            {formThree.map((entry) => (
              <Radio value={entry} key={entry}>
                {isPortrait ? (
                  <span>{entry.length > 40 ? `${entry.substring(0, 40)}...` : entry}</span>
                ) : (
                  entry
                )}
              </Radio>
            ))}
          </Radio.Group>
          <div style={{ marginTop: '5vh', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              style={{ width: '50%', marginRight: '1vh' }}
              onClick={() => renderFormTwo(false)}
            >
              VOLTAR
            </Button>
            <Button
              style={{ width: '50%', marginLeft: '1vh' }}
              type="primary"
              onClick={() => renderFormFour(true)} // TODO: Adicionar checagem para caso a resposta seja não.
            >
              CONTINUAR
            </Button>
          </div>
        </div>,
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPortrait, update],
  )

  const renderFormTwo = useCallback(
    (saveInfos: boolean) => {
      setActiveForm(
        <div>
          <h3>Já procurou o INSS?</h3>
          <Radio.Group
            style={{ display: 'flex', flexDirection: 'column' }}
            onChange={(e) => {
              update(['Já procurou o INSS?', e.target.value], 1)
            }}
          >
            {formTwo.map((entry) => (
              <Radio value={entry} key={entry}>
                {isPortrait ? (
                  <span>{entry.length > 40 ? `${entry.substring(0, 40)}...` : entry}</span>
                ) : (
                  entry
                )}
              </Radio>
            ))}
          </Radio.Group>
          <div style={{ marginTop: '5vh', display: 'flex', justifyContent: 'space-between' }}>
            <Button style={{ width: '50%', marginRight: '1vh' }} onClick={() => renderFormOne()}>
              VOLTAR
            </Button>
            <Button
              style={{ width: '50%', marginLeft: '1vh' }}
              type="primary"
              onClick={() => renderFormThree(true)}
            >
              CONTINUAR
            </Button>
          </div>
        </div>,
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPortrait, update],
  )

  const renderFormOne = useCallback(() => {
    setActiveForm(
      <div style={{ maxWidth: '100%' }}>
        <h3>O que você deseja?</h3>
        <Radio.Group
          style={{ display: 'flex', flexDirection: 'column' }}
          onChange={(e) => {
            update(['O que você deseja?', e.target.value], 0)
          }}
        >
          {formOne.map((entry) => (
            <Radio value={entry} key={entry}>
              {isPortrait ? (
                <span>{entry.length > 40 ? `${entry.substring(0, 40)}...` : entry}</span>
              ) : (
                entry
              )}
            </Radio>
          ))}
        </Radio.Group>
        <div style={{ marginTop: '5vh', display: 'flex', justifyContent: 'space-between' }}>
          <Button
            style={{ width: '50%', marginRight: '1vh' }}
            onClick={() => history.push('/client/benefits')}
          >
            VOLTAR
          </Button>
          <Button
            style={{ width: '50%', marginLeft: '1vh' }}
            type="primary"
            onClick={() => renderFormTwo(true)}
          >
            CONTINUAR
          </Button>
        </div>
      </div>,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPortrait, update, history])

  useEffect(() => {
    renderFormOne()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ClientLayout
      content={
        <PresentationLayout>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <span className="title">Formulário de vida contributiva</span>
            <span className="subtitle">
              Responda as perguntas abaixo para finalizar a análise de perfil
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card className="custom-card" style={{ width: isPortrait ? '90vw' : '40vw' }}>
              {activeForm}
            </Card>
          </div>
        </PresentationLayout>
      }
    />
  )
})

export default memo(LifeContribForm)
