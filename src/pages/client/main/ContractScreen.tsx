import React, { memo, useCallback, useEffect, useState } from 'react'
import ClientLayout from '~/assets/components/GlobalLayout'
import { Layout, Card, Checkbox, Button, Modal, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { useStores } from '~/hooks/use-stores'
import { observer } from 'mobx-react-lite'
import { useMediaQuery } from 'react-responsive'
import { policy, use_terms } from '~/pages/client/presentation/terms'
import { contractGeneral, procuracao } from './ContractsPages'
import { PDFInfo } from '~/types'

import ReactHtmlParser from 'react-html-parser'

import * as documentApi from '~/services/api/document'

const { Content } = Layout

const ContractScreen = observer(() => {
  const { authStore, clientStore, documentStore } = useStores()

  const history = useHistory()

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  const [confirmAccept, setConfirmAccept] = useState(false)
  const [termsModalState, setTermsModalState] = useState(false)
  const [policyModalState, setPolicyModalState] = useState(false)
  const [loadingAcceptLater, setLoadingAcceptLater] = useState(false)
  const [loadingAcceptNow, setLoadingAcceptNow] = useState(false)

  // eslint-disable-next-line new-cap
  const parsedHTML_policy = ReactHtmlParser(policy)
  // eslint-disable-next-line new-cap
  const parsedHTML_terms = ReactHtmlParser(use_terms)

  const signHandle = useCallback(async () => {
    let info: PDFInfo

    setLoadingAcceptNow(true)

    if (clientStore.currentUser) {
      info = {
        name: clientStore.currentUser?.name,
        marital_status: clientStore.currentUser?.marital_status,
        cpf: clientStore.currentUser?.cpf,
        rg: clientStore.currentUser?.rg,
        address: clientStore.currentUser.address!,
        zipcode: clientStore.currentUser.zipcode!,
      }

      await documentStore.generateContractPDFDocument(info, clientStore.currentUser?._id)
      await documentApi.sendFileToSign(`Contrato-${clientStore.currentUser?._id}.pdf`, [
        clientStore.currentUser?.email,
      ])
      await documentStore.generateProcuracaoPDFDocument(info, clientStore.currentUser?._id)
      await documentApi.sendFileToSign(`Procuracao-${clientStore.currentUser?._id}.pdf`, [
        clientStore.currentUser?.email,
      ])
    }

    setLoadingAcceptNow(false)
    history.push('/client/documents/sign')
  }, [history, clientStore.currentUser, documentStore])

  const generateContract = useCallback(
    (
      type?: string,
      nome?: string,
      nacionalidade?: string,
      estadocivil?: string,
      cpf?: string,
      rg?: string,
      endereco?: string,
      CEP?: string,
      orgaoexpedidor?: string,
      cidade?: string,
      estado?: string,
      telefone?: string,
    ) => {
      return contractGeneral(
        nome,
        nacionalidade,
        estadocivil,
        cpf,
        rg,
        endereco,
        CEP,
        orgaoexpedidor,
        cidade,
        estado,
        telefone,
      )
    },
    [],
  )

  const notSignHandle = useCallback(async () => {
    let info: PDFInfo

    setLoadingAcceptLater(true)
    if (clientStore.currentUser) {
      info = {
        name: clientStore.currentUser?.name,
        marital_status: clientStore.currentUser?.marital_status,
        cpf: clientStore.currentUser?.cpf,
        rg: clientStore.currentUser?.rg,
        address: clientStore.currentUser.address!,
        zipcode: clientStore.currentUser.zipcode!,
      }

      try {
        await documentStore.generateContractPDFDocument(info, clientStore.currentUser?._id)
        await documentApi.sendFileToSign(`Contrato-${clientStore.currentUser?._id}.pdf`, [
          clientStore.currentUser?.email,
        ])
        await documentStore.generateProcuracaoPDFDocument(info, clientStore.currentUser?._id)
        await documentApi.sendFileToSign(`Procuracao-${clientStore.currentUser?._id}.pdf`, [
          clientStore.currentUser?.email,
        ])
        setLoadingAcceptLater(false)
        message.success('Documento adicionado para assinatura na área "Assinar Documentos"')
      } catch (err) {
        message.error(err)
      }
    }
    history.push('/client/documents')
  }, [history, clientStore.currentUser, documentStore])

  useEffect(() => {
    if (authStore.loggedUser && authStore.loggedUser._id) {
      clientStore.loadClient(authStore.loggedUser._id)
    }
  }, [authStore.loggedUser, clientStore])

  return (
    <ClientLayout
      title="PROCURAÇÃO E CONTRATO"
      content={
        <Content
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Card
            className="custom-card"
            style={{ width: isPortrait ? '90vw' : '60vw', marginBottom: '10px' }}
          >
            <h3 style={{ color: '#04093b', fontFamily: 'Bebas Neue', fontSize: '30px' }}>
              PROCURAÇÃO PARA ABERTURA DE PROCESSO
            </h3>
            <Card className="custom-card" style={{ marginBottom: '50px' }}>
              {procuracao(
                clientStore.currentUser?.name,
                'Brasileiro(a)',
                clientStore.currentUser?.marital_status,
                clientStore.currentUser?.cpf,
                clientStore.currentUser?.rg,
                clientStore.currentUser?.address,
                clientStore.currentUser?.zipcode,
              )}
            </Card>
            <h3 style={{ color: '#04093b', fontFamily: 'Bebas Neue', fontSize: '25px' }}>
              CONTRATO DE PRESTAÇÃO DE SERVIÇOS E PAGAMENTO DE HONORÁRIOS
            </h3>
            <Card
              className="custom-card"
              // style={{ width: isPortrait ? '90vw' : '60vw', marginBottom: '10px' }}
            >
              {generateContract(
                clientStore.currentUser?.name,
                'Brasileiro(a)',
                clientStore.currentUser?.marital_status,
                clientStore.currentUser?.cpf,
                clientStore.currentUser?.rg,
                clientStore.currentUser?.address,
                clientStore.currentUser?.zipcode,
                clientStore.currentUser?.rg_consignor,
                clientStore.currentUser?.city,
                clientStore.currentUser?.state,
                clientStore.currentUser?.telephone,
              )}
            </Card>
            <div style={{ marginTop: '20px' }}>
              <Checkbox
                checked={confirmAccept}
                onChange={() => setConfirmAccept(!confirmAccept)}
              ></Checkbox>
              {'  '}Declaro que li e aceito as {/* eslint-disable-next-line */}
              <a onClick={() => setPolicyModalState(true)}>Políticas de Privacidade</a> e{' '}
              {/* eslint-disable-next-line */}
              <a onClick={() => setTermsModalState(true)}>Termos de Uso</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2vh' }}>
              <Button
                type="default"
                style={{
                  width: isPortrait ? '40vw' : '20vw',
                  marginRight: isPortrait ? '1vh' : '4vh',
                }}
                disabled={!confirmAccept}
                onClick={notSignHandle}
                loading={loadingAcceptLater}
              >
                ASSINAR DEPOIS
              </Button>
              <Button
                type="primary"
                style={{ width: isPortrait ? '40vw' : '20vw' }}
                onClick={signHandle}
                disabled={!confirmAccept}
                loading={loadingAcceptNow}
              >
                ASSINAR AGORA
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
          </Modal>
        </Content>
      }
    />
  )
})

export default memo(ContractScreen)
