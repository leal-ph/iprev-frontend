import moment, { Moment } from 'moment'

moment.locale('pt-BR')

export const displayMoment = (display: Moment) => {
  return display.format('DD/MM/YYYY HH:mm')
}
