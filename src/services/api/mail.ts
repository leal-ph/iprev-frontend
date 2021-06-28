import { post } from './client'
import { PREFIX_URL } from '~/utils/consts'

const endpoint = PREFIX_URL + '/mail'

export const sendNotificationMail = (
  email: string,
  clientName: string,
  lawyerName: string,
  lawsuitCode: string,
  content: string,
  isLinkNotification: boolean,
): Promise<any> => {
  return post(`${endpoint}/sendnotification`, {
    email,
    clientName,
    lawyerName,
    lawsuitCode,
    content,
    isLinkNotification: isLinkNotification,
  })
}
