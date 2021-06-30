import React from 'react'
import moment from 'moment'

export function contractGeneral(
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
  logoURL,
) {
  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '\n        @font-face {\n            font-family: Arial, Helvetica, sans-serif;\n            src: url(Arial, Helvetica, sans-serif);\n        }\n        div {\n            text-align: justify;\n            text-justify: inter-word;\n            font-family: Arial\n        }\n        * {\n            box-sizing: border-box;\n        }   \n        .column {\n            float: left;\n            width: 50%;\n            padding: 10px;\n            height: 150px;\n        } \n        .row:after {\n            content: "";\n            display: table;\n            clear: both;\n        }\n    ',
        }}
      />
      <meta charSet="utf-8" />
      <div style={{ textAlign: 'right', paddingRight: '10%', paddingTop: '5%' }}>
        <img src="http://35.247.199.10/api/img/Logo.png" alt="some text" width="15%" height="15%" />
      </div>
      <div style={{ paddingRight: '10%', paddingLeft: '10%', paddingTop: '3%' }}>
        <h3>
          <center>CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS</center>
        </h3>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>{nome}</b>, <b>{nacionalidade}</b>, <b>{estadocivil}</b>, inscrito no CPF:
            <b> {cpf}</b>, RG: <b>{rg}</b>, residente e domiciliado no endereço: <b>{endereco}</b>,
            CEP: <b>{CEP}</b> e de outro lado, como prestador de serviço/contratado/escritório,
            assim doravante indicado, o escritório de Advocacia{' '}
            <b>BOCAYUVA &amp; ADVOGADOS ASSOCIADOS</b> S/S, Pessoa Jurídica registrada no CNPJ nº
            22.588.047/0001-50, inscrita na OAB/DF nº 2493/2015, neste ato representado por sua
            sócia <b>MARCELA CARVALHO BOCAYUVA</b>, brasileira, solteira, advogada, inscrita na
            OAB/DF 41.954, CPF: 021.164.381-52, e <b>LUIS FELIPE CARVALHO BOCAYUVA</b>, brasileiro,
            solteiro, advogado, inscrito na OAB/DF sob o nº 50829, CPF 021.164.431-56, com endereço
            profissional no SRTVS Quadra 701, BLOCO O, SALAS 430-433, Edifício Multiempresarial, Asa
            Sul, Brasília – DF, CEP 70340-000, Telefones: (61)3032-8936, (61)99192-9999,
            (61)98383-1993, e-mail contato@bocayuvaadvogados.com.br ajustam entre si, com fulcro no
            artigo 22 da Lei nº 8.906/94, mediante as seguintes cláusulas e condições:
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Primeira</b> - O ESCRITÓRIO compromete-se, em cumprimento ao mandato
            recebido, a postular o pedido de CONCESSÃO, RESTABELECIMENTO ou MANUTENÇÃO DE BENEFÍCIO,
            perante a Justiça Federal, de interesse do Contratante.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Segunda</b> - O (a) CLIENTE, que reconhece já haver recebido a Consultoria
            orientação preventiva comportamental e jurídica para a consecução dos serviços,
            fornecerá ao ESCRITÓRIO os documentos e meios necessários à comprovação processual do
            seu pretendido direito, bem como pagará as despesas judiciais que decorrem da causa.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Terceira</b> - Em remuneração pelos serviços profissionais ora contratados
            serão devidos pelo CLIENTE, a partir do trânsito em julgado do Acordo, da Sentença ou
            Acórdão Procedente,{' '}
            <b>
              <u>
                o percentual de 25% (vinte e cinco por cento) do valor bruto recebido a título de
                atrasados ou retroativos, inclusive sobre o CP
              </u>
            </b>{' '}
            – Complemento Positivo, a serem pagos através de RPV (Requisição de Pequeno Valor) ou
            PRECATÓRIO.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo único</b> - No caso de composição amigável e ainda na esfera
            administrativa, os honorários serão devidos na mesma proporção.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Quarta</b> - Serão ainda devidos honorários advocatícios, vinculados à
            concessão ou manutenção do benefício previdenciário, por meio de tutela antecipada
            deferida em qualquer fase processual, ou cumprimento do julgado/sentença, serão pagos
            pelo cliente ao escritório,{' '}
            <b>
              <u>
                20% (vinte por cento) do valor bruto mensal do benefício implantado pelo prazo de 12
                (doze) meses.
              </u>
            </b>
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Primeiro</b> - Os honorários contratuais serão fixados no valor mínimo de
            R$ 3.000,00 (três mil reais) caso o percentual de 25% do valor do recebido pelo CLIENTE
            seja aquém da quantia acima referenciada. Caso superior, permanecerá o valor de 25%;
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo segundo</b> - O CLIENTE autoriza o desconto das tarifas bancárias nos
            boletos mensais e o levantamento dos honorários advocatícios contratuais em alvará ou
            RPV apartados, na forma do artigo 22, §4º, da Lei 8.906/1994 (EAOAB) em nome do
            ESCRITÓRIO.{' '}
            <b>
              Autoriza também, no ato do pagamento dos valores a título de atrasados, por meio de
              RPV, o desconto da totalidade das parcelas mensais vencidas e vincendas, mencionada na
              cláusula quarta.
            </b>
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo terceiro</b> - O não pagamento de qualquer parcela no seu vencimento,
            importará no vencimento integral e antecipado de todas as parcelas vincendas, sujeitando
            o CLIENTE, além da execução do presente instrumento, ao pagamento do valor integral do
            débito, sobre o qual incidirá a aplicação de multa de 10%, juros de mora de 1% ao mês e
            correção monetária pelo índice INPC desde o primeiro vencimento, custas processuais e
            honorários advocatícios na base de 20% sobre o valor total do débito.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Quinta</b> - Na hipótese de revogação do mandato outorgado ao{' '}
            <b>ESCRITÓRIO</b> para a prestação do serviço objeto deste contrato após o ajuizamento
            da ação, terá o escritório direito a ao recebimento integral do valor dos honorários
            advocatícios contratuais e de sucumbência.{' '}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo único</b> - O presente contrato obriga os sucessores, herdeiros e
            legatários do cliente ao seu fiel cumprimento.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Sétima</b> - Os honorários de condenação (sucumbência), caso sejam
            pertencerão EXCLUSIVAMENTE ao ESCRITÓRIO, sem exclusão dos que ora são contratados, de
            conformidade com os artigos 23 da Lei nº 8.906/94 e 35, parágrafo 1º, do Código de Ética
            e Disciplina da Ordem dos Advogados do Brasil.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            Elegem as partes o foro da Circunscrição judiciária de Brasília-DF, para dirimir
            controvérsias que possam surgir do presente contrato.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            E por estarem assim justos e contratados, saibam as partes que se trata de um título
            executivo nos termos do artigo Art. 24. Do EOAB e 784, III do Código de Processo Civil,
            portanto, assinam o presente em duas vias de igual forma e teor, para que possa produzir
            todos os seus efeitos de direito.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }} />
        </p>
        <center>Brasília, {moment().format('LL')}.</center>
        <p />
      </div>
      <div className="row">
        <div className="column">
          <center>
            <p>__________________________________</p>
            <p>Contratante</p>
          </center>
        </div>
        <div className="column">
          <center>
            <p>__________________________________</p>
            <p>Contratado</p>
          </center>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'goldenrod', marginTop: '10px' }}>
          _______________________________________
        </p>
        <p style={{ paddingBottom: '50px' }}>
          <span>
            SRTVS Quadra 701 – bloco O – salas 430/433 – Multiempresarial – Brasília/DF – 70340-000
          </span>
          <br />
          <span style={{ color: 'blue' }}>
            <u>www.bocayuvaadvogados.com.br</u> –<u>contato@bocayuvaadvogados.com.br</u>
          </span>
          <br />
          <span>
            (61) 3032-8936 / (61) 3032-8933
            <br />
            <br />
          </span>
        </p>
      </div>
    </div>
  )
}

export function contractConsultoria(
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
  logoURL,
) {
  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '\n        @font-face {\n            font-family: Arial, Helvetica, sans-serif;\n            src: url(Arial, Helvetica, sans-serif);\n        }\n        div {\n            text-align: justify;\n            text-justify: inter-word;\n            font-family: Arial\n        }\n        * {\n            box-sizing: border-box;\n        }   \n        .column {\n            float: left;\n            width: 50%;\n            padding: 10px;\n            height: 150px;\n        } \n        .row:after {\n            content: "";\n            display: table;\n            clear: both;\n        }\n    ',
        }}
      />
      <meta charSet="utf-8" />
      <div style={{ paddingRight: '10%', paddingLeft: '10%', paddingTop: '3%' }}>
        <h3>
          <center>CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS</center>
        </h3>
        <p>
          <span style={{ fontWeight: 400 }}>
            Pelo presente instrumento particular, que entre si fazem, de um lado como <b>CLIENTE</b>{' '}
            e assim doravante indicado, <b>{nome}</b>, <b>{nacionalidade}</b>, <b>{estadocivil}</b>,
            portador do RG nº{' '}
            <b>
              {rg} - {orgaoexpedidor}
            </b>
            , CPF nº <b>{cpf}</b>, residente e domiciliado no endereço <b>{endereco}</b>, CEP{' '}
            <b>{CEP}</b>, e de outro lado, como <b>ESCRITÓRIO</b>, assim doravante indicado, o
            escritório de Advocacia <b>BOCAYUVA &amp; ADVOGADOS ASSOCIADOS S/S</b>, Pessoa Jurídica
            registrada no CNPJ nº 22.588.047/0001-50, inscrita na OAB/DF nº 2493/2015, neste ato
            representado por sua sócia <b>MARCELA CARVALHO BOCAYUVA</b>, brasileira, solteira,
            advogada, inscrita na OAB/DF 41.954, CPF: 021.164.381-52, e{' '}
            <b>LUIS FELIPE CARVALHO BOCAYUVA</b>, brasileiro, solteiro, advogado, inscrito na OAB/DF
            sob o nº 50829, CPF 021.164.431-56, com endereço profissional no SRTVS Quadra 701,
            Edifício Multiempresarial, Salas 430-433, CEP 70340-000, Telefones: (61)3032-8936,
            (61)9192-9999, (61)8383-1993, e-mail contato@bocayuvaadvogados.com.br, ajustam entre si,
            com fulcro no artigo 22 da Lei nº 8.906/94, mediante as seguintes cláusulas e condições:
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Primeira</b> - O <b>ESCRITÓRIO</b> compromete-se, em cumprimento ao acordo
            celebrado, prestar serviços de <b>CONSULTORIA DE DIREITO PREVIDENCIÁRIO</b>, de
            interesse do Contratante.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Segunda</b> - O (a) <b>CLIENTE</b>, reconhece já receber orientação
            preventiva comportamental para a consecução dos serviços, bem como fornecerá ao
            ESCRITÓRIO os documentos e meios necessários à comprovação processual do seu pretendido
            direito.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Terceira</b> - Em remuneração pelos serviços profissionais ora contratados
            serão devidos pelo <b>CLIENTE</b>, a partir da imediata contratação, o valor de R$200,00
            (duzentos reais).
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Primeiro</b> - A respectiva prestação de serviços só será realizada após o
            efetivo recebimento dos valores pactuados.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Segundo</b> - Os valores contratados não abarcam qualquer possibilidade de
            postulação judicial ou eventual requerimento administrativo perante o INSS.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Quarta</b> - O presente contrato obriga os sucessores, herdeiros e
            legatários do cliente ao seu fiel cumprimento.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Primeiro</b> - Os honorários contratuais serão fixados no valor mínimo de
            R$ 3.000,00 (três mil reais) caso o percentual de 25% do valor do recebido pelo CLIENTE
            seja aquém da quantia acima referenciada. Caso superior, permanecerá o valor de 25%;
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo segundo</b> - O CLIENTE autoriza o desconto das tarifas bancárias nos
            boletos mensais e o levantamento dos honorários advocatícios contratuais em alvará ou
            RPV apartados, na forma do artigo 22, §4º, da Lei 8.906/1994 (EAOAB) em nome do
            ESCRITÓRIO.{' '}
            <b>
              Autoriza também, no ato do pagamento dos valores a título de atrasados, por meio de
              RPV, o desconto da totalidade das parcelas mensais vencidas e vincendas, mencionada na
              cláusula quarta.
            </b>
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            Elegem as partes o foro da Circunscrição judiciária de Brasília-DF, para dirimir
            controvérsias que possam surgir do presente contrato, podendo o Advogado optar pelo foro
            de residência do Contratante.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            E por estarem assim justos e contratados, saibam as partes que se trata de um título
            executivo nos termos do artigo Art. 24. Do EOAB e 784, II do Código de Processo Civil,
            portanto, assinam o presente em duas vias de igual forma e teor, para que possa produzir
            todos os seus efeitos de direito.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }} />
        </p>
        <center>Brasília, {moment().format('LL')}.</center>
        <p />
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'goldenrod', marginTop: '0 px' }}>
          _______________________________________
        </p>
        {/* <p style={{ paddingBottom: '50px' }}>
          <span>
            SRTVS Quadra 701 – bloco O – salas 430/433 – Multiempresarial – Brasília/DF – 70340-000
          </span>
          <br />
          <span style={{ color: 'blue' }}>
            <u>www.bocayuvaadvogados.com.br</u> –<u>contato@bocayuvaadvogados.com.br</u>
          </span>
          <br />
          <span>
            (61) 3032-8936 / (61) 3032-8933
            <br />
            <br />
          </span>
        </p> */}
      </div>
    </div>
  )
}

export function contractMaternidade(
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
  logoURL,
) {
  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '\n        @font-face {\n            font-family: Arial, Helvetica, sans-serif;\n            src: url(Arial, Helvetica, sans-serif);\n        }\n\n        div {\n            text-align: justify;\n            text-justify: inter-word;\n            font-family: Arial\n        }\n\n        * {\n            box-sizing: border-box;\n        }\n\n        .column {\n            float: left;\n            width: 50%;\n            padding: 10px;\n            height: 150px;\n        }\n\n        .row:after {\n            content: "";\n            display: table;\n            clear: both;\n        }\n    ',
        }}
      />
      <meta charSet="utf-8" />
      <div style={{ textAlign: 'right', paddingRight: '10%', paddingTop: '5%' }}>
        <img src="http://35.247.199.10/api/img/Logo.png" alt="BCA" width="15%" height="15%" />
      </div>
      <div style={{ paddingRight: '10%', paddingLeft: '10%', paddingTop: '3%' }}>
        <h3>
          <center>CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS</center>
        </h3>
        <p>
          <span style={{ fontWeight: 400 }}>
            Pelo presente instrumento particular, que entre si fazem, de um lado como
            cliente/contratante e assim doravante indicado, <b>{nome}</b>, <b>{nacionalidade}</b>,
            <b> {estadocivil}</b>, portador(a) do RG: <b>{rg}</b> <b> {orgaoexpedidor}</b>, CPF:
            <b> {cpf}</b>, domiciliado(a) no(a) <b> {endereco}</b>, <b>{cidade}</b> -
            <b> {estado}</b>, CEP: <b>{CEP}</b> telefone: <b>{telefone}</b>, e de outro lado, como
            prestador de serviço/contratado/escritório, assim doravante indicado, o escritório de
            Advocacia
            <b> BOCAYUVA &amp; ADVOGADOS ASSOCIADOS S/S</b>, Pessoa Jurídica registrada no CNPJ nº
            22.588.047/0001-50, inscrita na OAB/DF nº 2493/2015, neste ato representado por sua
            sócia <b>MARCELA CARVALHO BOCAYUVA</b>, brasileira, solteira, advogada, inscrita na
            OAB/DF 41.954, CPF: 021.164.381-52, e <b>LUIS FELIPE CARVALHO BOCAYUVA</b>, brasileiro,
            solteiro, advogado, inscrito na OAB/DF sob o nº 50829, CPF 021.164.431-56, com endereço
            profissional no SRTVS Quadra 701, Edifício Multiempresarial, Salas 430-433, Brasília –
            DF, CEP 70340-907, Telefones: (61) 3032-8936, (61) 9192-9999, (61) 8383-1993, e-mail
            contato@bocayuvaadvogados.com.br, ajustam entre si, com fulcro no artigo 22 da Lei nº
            8.906/94, mediante as seguintes cláusulas e condições:
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Primeira</b> - O ESCRITÓRIO compromete-se, em cumprimento ao mandato
            recebido, perante a Justiça Federal, de interesse do Contratante, para acompanhamento e
            ajuizamento de ação previdenciária cujo objeto é pedido de <b>SALÁRIO MATERNIDADE.</b>
          </span>{' '}
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Segunda</b> - O (a) CLIENTE, que reconhece já haver recebido a Consultoria e
            orientação preventiva comportamental e jurídica para a consecução dos serviços,
            fornecerá ao ESCRITÓRIO os documentos e meios necessários à comprovação processual do
            seu pretendido direito, bem como pagará as despesas judiciais que decorrem da causa.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Terceira</b> - Em remuneração pelos serviços profissionais ora contratados
            serão devidos pelo CLIENTE, a partir do trânsito em julgado do Acordo, da Sentença ou
            Acórdão Procedente,{' '}
            <b>
              <u>
                o percentual de 25% (vinte e cinco por cento) do valor bruto recebido a título de
                atrasados ou retroativos, inclusive sobre o CP
              </u>
            </b>{' '}
            – Complemento Positivo, a serem pagos através de RPV (Requisição de Pequeno Valor) ou
            PRECATÓRIO.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Primeiro</b> - Os honorários contratuais serão fixados no valor mínimo de
            R$ 1.200,00 (MIL E DUZENTOS REAIS) caso o percentual de 25% do valor do recebido pelo
            CLIENTE seja aquém da quantia acima referenciada. Caso superior, permanecerá o
            percentual de 25%;
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Segundo</b> - A respectiva quitação será dada quando da emissão, pelo
            ESCRITÓRIO, da respectiva RPA- Recibo de Prestação de Serviço Autônomo, com quitação
            total e/ou mediante recibo.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Terceiro</b> - O CLIENTE autoriza o desconto das tarifas bancárias nos
            boletos mensais e o levantamento dos honorários advocatícios contratuais em alvará ou
            RPV apartados, na forma do artigo 22, §4º, da Lei 8.906/1994 (EAOAB) em nome do
            ESCRITÓRIO.{' '}
            <b>
              Autoriza também, no ato do pagamento dos valores a título de atrasados, por meio de
              RPV, o desconto da totalidade das parcelas mensais vencidas e vincendas, mencionada na
              cláusula quarta.
            </b>
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Quarto</b> - No caso de composição amigável e ainda na esfera
            administrativa perante o INSS, os honorários serão devidos na mesma proporção.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Quarta</b> - Considerar-se-ão vencidos e imediatamente exigíveis os
            honorários ora contratados a partir do quinto dia útil do mês subsequente ao mês de
            vencimento.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Único</b> - Pelo inadimplemento dos honorários contratuais expostos na
            Cláusula Terceira, incidirão juros moratórios mensais de 1% (um por cento), correção
            monetária de indexador INPC e multa de 30% (trinta por cento), a título de cláusula
            penal, sobre o valor de cada parcela devida e não adimplida;
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Quinta</b> - Na hipótese de revogação do mandato outorgado ao
            <b>ESCRITÓRIO</b> para a prestação do serviço objeto deste contrato após o ajuizamento
            da ação, terá o escritório direito ao valor cobrado pela tabela da OAB para ingresso da
            ação previdenciária que equivale a 30URH, além de possuir direito ao recebimento
            integral do valor dos honorários advocatícios contratuais e de sucumbência. O presente
            contrato obriga os sucessores, herdeiros e legatários do cliente ao seu fiel
            cumprimento.{' '}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Sexta</b> - Os honorários de condenação (sucumbência), caso sejam fixados,
            pertencerão EXCLUSIVAMENTE ao ESCRITÓRIO, sem exclusão dos que ora são contratados, de
            conformidade com os artigos 23 da Lei nº 8.906/94 e 35, parágrafo 1º, do Código de Ética
            e Disciplina da Ordem dos Advogados do Brasil.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            Elegem as partes o foro da Circunscrição judiciária de Brasília-DF, para dirimir
            controvérsias que possam surgir do presente contrato, podendo o Advogado optar pelo foro
            de residência do Contratante.{' '}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            E por estarem assim justos e contratados, saibam as partes que se trata de um título
            executivo nos termos do artigo Art. 24. Do EOAB e 585, II do Código de Processo Civil,
            portanto, assinam o presente em duas vias de igual forma e teor, para que possa produzir
            todos os seus efeitos de direito.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}></span>
        </p>
        <center>Brasília, {moment().format('LL')}.</center>
        <p />
      </div>
      <div className="row">
        <div className="column">
          <center>
            <p>__________________________________</p>
            <p>Contratante</p>
          </center>
        </div>
        <div className="column">
          <center>
            <p>__________________________________</p>
            <p>Contratado</p>
          </center>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'goldenrod', marginTop: '0 px' }}>
          ________________________________________
        </p>
        <p style={{ paddingBottom: '50px' }}>
          <span>
            SRTVS Quadra 701 – bloco O – salas 430/433 – Multiempresarial – Brasília/DF – 70340-000
          </span>
          <br />
          <span style={{ color: 'blue' }}>
            <u>www.bocayuvaadvogados.com.br</u> –<u>contato@bocayuvaadvogados.com.br</u>
          </span>
          <br />
          <span>
            (61) 3032-8936 / (61) 3032-8933
            <br />
            <br />
          </span>
        </p>
      </div>
    </div>
  )
}

export function contractRevisao(
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
  logoURL,
) {
  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '\n        @font-face {\n            font-family: Arial, Helvetica, sans-serif;\n            src: url(Arial, Helvetica, sans-serif);\n        }\n\n        div {\n            text-align: justify;\n            text-justify: inter-word;\n            font-family: Arial\n        }\n\n        * {\n            box-sizing: border-box;\n        }\n\n        .column {\n            float: left;\n            width: 50%;\n            padding: 10px;\n            height: 150px;\n        }\n\n        .row:after {\n            content: "";\n            display: table;\n            clear: both;\n        }\n    ',
        }}
      />
      <meta charSet="utf-8" />
      <div style={{ textAlign: 'right', paddingRight: '10%', paddingTop: '5%' }}>
        <img src="http://35.247.199.10/api/img/Logo.png" alt="BCA" width="15%" height="15%" />
      </div>
      <div style={{ paddingRight: '10%', paddingLeft: '10%', paddingTop: '3%' }}>
        <h3>
          <center>CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS</center>
        </h3>
        <p>
          <span style={{ fontWeight: 400 }}>
            Pelo presente instrumento particular, que entre si fazem, de um lado como
            cliente/contratante e assim doravante indicado, <b>{nome}</b>, <b>{nacionalidade}</b>,
            <b> {estadocivil}</b>, portador(a) do RG: <b>{rg}</b> <b> {orgaoexpedidor}</b>, CPF:
            <b> {cpf}</b>, domiciliado(a) no(a) <b> {endereco}</b>, <b>{cidade}</b> -
            <b> {estado}</b>, CEP: <b>{CEP}</b> telefone: <b>{telefone}</b>, e de outro lado, como
            prestador de serviço/contratado/escritório, assim doravante indicado, o escritório de
            Advocacia
            <b> BOCAYUVA &amp; ADVOGADOS ASSOCIADOS S/S</b>, Pessoa Jurídica registrada no CNPJ nº
            22.588.047/0001-50, inscrita na OAB/DF nº 2493/2015, neste ato representado por sua
            sócia <b>MARCELA CARVALHO BOCAYUVA</b>, brasileira, solteira, advogada, inscrita na
            OAB/DF 41.954, CPF: 021.164.381-52, e <b>LUIS FELIPE CARVALHO BOCAYUVA</b>, brasileiro,
            solteiro, advogado, inscrito na OAB/DF sob o nº 50829, CPF 021.164.431-56, com endereço
            profissional no SRTVS Quadra 701, Edifício Multiempresarial, Salas 430-433, Brasília –
            DF, CEP 70340-907, Telefones: (61) 3032-8936, (61) 9192-9999, (61) 8383-1993, e-mail
            contato@bocayuvaadvogados.com.br, ajustam entre si, com fulcro no artigo 22 da Lei nº
            8.906/94, mediante as seguintes cláusulas e condições:
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Primeira</b> - O ESCRITÓRIO compromete-se, em cumprimento ao mandato
            recebido, perante a Justiça Federal, de interesse do Contratante, para acompanhamento e
            ajuizamento de ação previdenciária de <b>REVISÃO DE BENEFÍCIO</b>, de titularidade do
            Cliente.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Segunda</b> - O (a) CLIENTE, que reconhece já haver recebido a Consultoria e
            orientação preventiva comportamental e jurídica para a consecução dos serviços,
            fornecerá ao ESCRITÓRIO os documentos e meios necessários à comprovação processual do
            seu pretendido direito, bem como pagará as despesas judiciais que decorrem da causa.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Terceira</b> - Em remuneração pelos serviços profissionais ora contratados
            serão devidos pelo CLIENTE, a partir do trânsito em julgado do Acordo, da Sentença ou
            Acórdão Procedente,{' '}
            <b>
              <u>
                o percentual de 25% (vinte e cinco por cento) do valor bruto recebido a título de
                atrasados ou retroativos, inclusive sobre o CP
              </u>
            </b>{' '}
            – Complemento Positivo, a serem pagos através de RPV (Requisição de Pequeno Valor) ou
            PRECATÓRIO.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Primeiro</b> - A respectiva quitação será dada quando da emissão, pelo
            ESCRITÓRIO, da respectiva RPA- Recibo de Prestação de Serviço Autônomo, com quitação
            total e/ou mediante recibo.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Segundo</b> - Também serão devidos, enquanto durar o processo, HONORÁRIOS
            PRO LABORE na quantia de R$50,00 (cinquenta reais) mensais.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Terceiro</b> - O CLIENTE autoriza o desconto, no ato do pagamento dos
            valores a título de atrasados, por meio de RPV, dos valores de honorários acima
            referenciados.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Quarto</b> - No caso de composição amigável e ainda na esfera
            administrativa perante o INSS, os honorários serão devidos na mesma proporção.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Quarta</b> - Considerar-se-ão vencidos e imediatamente exigíveis os
            honorários ora contratados a partir do quinto dia útil do mês subsequente ao mês de
            vencimento.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Parágrafo Único</b> - Pelo inadimplemento dos honorários contratuais expostos na
            Cláusula Terceira, incidirão juros moratórios mensais de 1% (um por cento), correção
            monetária de indexador INPC e multa de 30% (trinta por cento), a título de cláusula
            penal, sobre o valor de cada parcela devida e não adimplida;
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Quinta</b> - Na hipótese de revogação do mandato outorgado ao
            <b>ESCRITÓRIO</b> para a prestação do serviço objeto deste contrato após o ajuizamento
            da ação, terá o escritório direito ao valor cobrado pela tabela da OAB para ingresso da
            ação previdenciária que equivale a 30URH, além de possuir direito ao recebimento
            integral do valor dos honorários advocatícios contratuais e de sucumbência. O presente
            contrato obriga os sucessores, herdeiros e legatários do cliente ao seu fiel
            cumprimento.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            <b>Cláusula Sexta</b> - Os honorários de condenação (sucumbência), caso sejam fixados,
            pertencerão EXCLUSIVAMENTE ao ESCRITÓRIO, sem exclusão dos que ora são contratados, de
            conformidade com os artigos 23 da Lei nº 8.906/94 e 35, parágrafo 1º, do Código de Ética
            e Disciplina da Ordem dos Advogados do Brasil.{' '}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            Elegem as partes o foro da Circunscrição judiciária de Brasília-DF, para dirimir
            controvérsias que possam surgir do presente contrato, podendo o Advogado optar pelo foro
            de residência do Contratante.{' '}
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            E por estarem assim justos e contratados, saibam as partes que se trata de um título
            executivo nos termos do artigo Art. 24. Do EOAB e 585, II do Código de Processo Civil,
            portanto, assinam o presente em duas vias de igual forma e teor, para que possa produzir
            todos os seus efeitos de direito.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}></span>
        </p>
        <center>Brasília, {moment().format('LL')}.</center>
        <p />
      </div>
      <div className="row">
        <div className="column">
          <center>
            <p>__________________________________</p>
            <p>Contratante</p>
          </center>
        </div>
        <div className="column">
          <center>
            <p>__________________________________</p>
            <p>Contratado</p>
          </center>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'goldenrod', marginTop: '0 px' }}>
          _______________________________________________________________________________________________
        </p>
        <p style={{ paddingBottom: '50px' }}>
          <span>
            SRTVS Quadra 701 – bloco O – salas 430/433 – Multiempresarial – Brasília/DF – 70340-000
          </span>
          <br />
          <span style={{ color: 'blue' }}>
            <u>www.bocayuvaadvogados.com.br</u> –<u>contato@bocayuvaadvogados.com.br</u>
          </span>
          <br />
          <span>
            (61) 3032-8936 / (61) 3032-8933
            <br />
            <br />
          </span>
        </p>
      </div>
    </div>
  )
}

export function procuracao(nome, nacionalidade, estadocivil, cpf, rg, endereco, CEP, logoURL) {
  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '\n        @font-face {\n            font-family: Arial, Helvetica, sans-serif;\n            src: url(Arial, Helvetica, sans-serif);\n        }\n\n        div {\n            text-align: justify;\n            text-justify: inter-word;\n            font-family: Arial\n        }\n\n        * {\n            box-sizing: border-box;\n        }\n\n        .column {\n            float: left;\n            width: 50%;\n            padding: 10px;\n            height: 300px;\n        }\n\n        .row:after {\n            content: "";\n            display: table;\n            clear: both;\n        }\n    ',
        }}
      />
      <meta charSet="utf-8" />
      <div>
        <div style={{ textAlign: 'right', paddingRight: '10%', paddingTop: '5%' }}>
          <img
            src="http://35.247.199.10/api/img/Logo.png"
            alt="some text"
            width="15%"
            height="15%"
          />
        </div>
        <div style={{ paddingRight: '10%', paddingLeft: '10%', paddingTop: '3%' }}>
          <h3>
            <center>PROCURAÇÃO</center>
          </h3>
          <span style={{ fontWeight: 400 }}>
            <b>{nome}</b>, brasileiro(a), <b>{estadocivil}</b>, inscrito no CPF:
            <b> {cpf}, </b>
            RG: <b>{rg}</b>, residente e domiciliado no endereço: <b>{endereco}</b>, CEP:
            <b> {CEP}</b>, nomeia e constitui seu bastante procurador o advogado
            <b> LUIS FELIPE CARVALHO BOCAYUVA</b>, inscrito na Ordem dos Advogados do Brasil sob o
            nº 50.829 e a advogada
            <b> MARCELA CARVALHO BOCAYUVA</b>, inscrita na Ordem dos Advogados do Brasil, com o
            respectivo número: 41.954/DF, sócia do escritório de Advocacia{' '}
            <b>BOCAYUVA &amp; ADVOGADOS ASSOCIADOS</b>, Pessoa Jurídica registrada no CNPJ nº
            22.588.047/0001-50, inscrita na OAB/DF nº 2493/2015, om endereço profissional no SRTVS
            Quadra 701, BLOCO O, SALAS 430-433, Edifício Multiempresarial, Asa Sul, Brasília – DF,
            CEP 70340-000, Telefones: (61)3032-8936, (61)99192-9999, (61)98383-1993, e-mail
            contato@bocayuvaadvogados.com.br, onde recebe intimações, para representá-lo, em Juízo,
            em quaisquer Instâncias, em qualquer ação em que seja autor, réu, assistente ou
            oponente, em especial para o ingresso de ação judicial, podendo os referidos
            procuradores usar de todos os poderes da cláusula ad juditia, e mais, receber citação e
            intimações, extrair fotocópias, acordar, desistir, transigir, firmar compromisso,
            recorrer, receber valores e realizar o levantamento de alvará judicial, renunciar a
            crédito, prestar e firmar declaração de isenção de imposto de renda junto ao Banco do
            Brasil e Caixa Econômica Federal, substabelecendo ou não, em quem e como convir.
          </span>
          <p>
            <span style={{ fontWeight: 400 }}></span>
          </p>
          <center>Brasília, {moment().format('LL')}.</center>
          <p />
        </div>
        <div className="row">
          <center>
            <p>__________________________________</p>
            <p>{nome}</p>
          </center>
        </div>
        <div style={{ paddingRight: '10%', paddingLeft: '10%', paddingTop: '3%' }}>
          <h3>
            <center>DECLARAÇÃO DE GRATUIDADE</center>
          </h3>
          <p>
            <span style={{ fontWeight: 400 }}>
              Eu, <b>{nome}</b>, declaro na conformidade do disposto nos artigos 98 e seguintes, do
              Código de Processo Civil, que não tenho condições financeiras de com as despesas
              processuais sem prejuízo do meu sustento próprio bem como de minha família.
            </span>
          </p>
          <span style={{ fontWeight: 400 }}></span>
          <br></br>
          <center>Brasília, {moment().format('LL')}.</center>
        </div>
        <div className="row">
          <center>
            <p>__________________________________</p>
            <p>{nome}</p>
          </center>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'goldenrod', marginTop: '0 px' }}>
            _______________________________________________________________________________________________
          </p>
          <p style={{ paddingBottom: '50px' }}>
            <span>
              SRTVS Quadra 701 – bloco O – salas 430/433 – Multiempresarial – Brasília/DF –
              70340-000
            </span>
            <br />
            <span style={{ color: 'blue' }}>
              <u>www.bocayuvaadvogados.com.br</u> –<u>contato@bocayuvaadvogados.com.br</u>
            </span>
            <br />
            <span>
              (61) 3032-8936 / (61) 3032-8933
              <br />
              <br />
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
