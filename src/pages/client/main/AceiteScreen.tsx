import React, { memo, useCallback, useEffect, useState } from 'react'
import ClientLayout from '~/pages/GlobalLayout'
import { Layout, Card, Checkbox, Button, message, Modal } from 'antd'
import { useStores } from '~/hooks/use-stores'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { PaymentStatus } from '~/types'
import { MSG_HONORARIOS_ERROR } from '~/utils/messages'
import { useMediaQuery } from 'react-responsive'
import { contractConsultoria } from './ContractsPages'
// import * as documentApi from '~/services/api/document'

import { policy, use_terms } from '~/pages/client/presentation/terms'

import ReactHtmlParser from 'react-html-parser'

const { Content } = Layout

const AceiteScreen = observer(() => {
  const { authStore, clientStore, paymentStore } = useStores()

  const [confirmAccept, setConfirmAccept] = useState(false)
  const [loadingAccept, setLoadingAccept] = useState(false)
  const [termsModalState, setTermsModalState] = useState(false)
  const [policyModalState, setPolicyModalState] = useState(false)

  const history = useHistory()

  const date = new Date()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

  // eslint-disable-next-line new-cap
  const parsedHTML_policy = ReactHtmlParser(policy)
  // eslint-disable-next-line new-cap
  const parsedHTML_terms = ReactHtmlParser(use_terms)

  const aceiteHandle = useCallback(async () => {
    // TODO: Salvar informações do termo de aceite
    // TODO: Gerar o pagamento de honorário

    if (!confirmAccept) {
      message.error('Você deve concordar com os termos antes de prosseguir!')
      return
    }

    setLoadingAccept(true)

    /* if (clientStore.currentUser) {
      const info: PDFInfo = {
        name: clientStore.currentUser?.name,
        marital_status: clientStore.currentUser?.marital_status,
        cpf: clientStore.currentUser?.cpf,
        rg: clientStore.currentUser?.rg,
        address: clientStore.currentUser.address!,
        zipcode: clientStore.currentUser.zipcode!,
      }

      try {
        await documentStore.generateAceitePDFDocument(info, clientStore.currentUser?._id)
        await documentApi.sendFileToSign(`Aceite-${clientStore.currentUser?._id}.pdf`, [
          clientStore.currentUser?.email,
        ])
        message.success('Documento adicionado para assinatura na área "Assinar Documentos"')
      } catch (err) {
        message.error(err)
      }
    } */

    if (clientStore.currentUser) {
      const payment = {
        charge_identification: 'HONORÁRIOS',
        max_parcels: 1,
        item: {
          description: 'HONORÁRIOS',
          quantity: 1,
          price_cents: process.env.INITIAL_PRICE ? parseInt(process.env.INITIAL_PRICE) : 5000,
        },
        type: undefined,
        expiry_date: new Date(date.setTime(date.getTime() + 14 * 86400000)),
        status: PaymentStatus.PLACEHOLDER,
      }

      if (await paymentStore.generatePlaceHolder(clientStore.currentUser._id, payment)) {
        setLoadingAccept(false)
        history.push('/client/menu')
        return
      }

      setLoadingAccept(false)
      history.push('/client/menu')
      message.error(MSG_HONORARIOS_ERROR)
    }
  }, [clientStore.currentUser, paymentStore, date, history, confirmAccept])

  useEffect(() => {
    if (authStore.loggedUser && authStore.loggedUser._id) {
      clientStore.loadClient(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, clientStore])

  return (
    <ClientLayout
      title="Contrato de Aceite"
      content={
        <Content
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <Card
            className="custom-card"
            style={{ width: isPortrait ? '90vw' : '60vw', marginBottom: '10px' }}
          >
            <Card className="custom-card" style={{ marginBottom: '50px' }}>
              {contractConsultoria(
                clientStore.currentUser?.name,
                'Brasileiro(a)',
                clientStore.currentUser?.marital_status,
                clientStore.currentUser?.cpf,
                clientStore.currentUser?.rg,
                clientStore.currentUser?.address,
                clientStore.currentUser?.zipcode,
                process.env.LOGOURL,
              )}
            </Card>
            <Checkbox
              checked={confirmAccept}
              onChange={() => setConfirmAccept(!confirmAccept)}
            ></Checkbox>
            {'  '}Declaro que li e aceito as {/* eslint-disable-next-line */}
              <a onClick={() => setPolicyModalState(true)}>Políticas de Privacidade</a> e{' '}
            {/* eslint-disable-next-line */}
              <a onClick={() => setTermsModalState(true)}>Termos de Uso</a>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2vh' }}>
              <Button
                type="primary"
                style={{ width: isPortrait ? '40vw' : '20vw' }}
                onClick={aceiteHandle}
                loading={loadingAccept}
              >
                CONTINUAR
              </Button>
            </div>
          </Card>
          <Modal
            title="Política de Privacidade"
            visible={policyModalState}
            cancelButtonProps={{ style: { display: 'none' } }}
            onOk={() => setPolicyModalState(false)}
            onCancel={() => setPolicyModalState(false)}
            width="90%"
          >
            {parsedHTML_policy}
            {/*  <div
          dangerouslySetInnerHTML={{
            __html: termstext,
          }}
        ></div> */}
          </Modal>
          <Modal
            title="Termos de Uso"
            visible={termsModalState}
            cancelButtonProps={{ style: { display: 'none' } }}
            onOk={() => setTermsModalState(false)}
            onCancel={() => setTermsModalState(false)}
            width="90%"
          >
            {parsedHTML_terms}
            {/*  <div
          dangerouslySetInnerHTML={{
            __html: termstext,
          }}
        ></div> */}
          </Modal>
        </Content>
      }
    />
  )
})

export default memo(AceiteScreen)
