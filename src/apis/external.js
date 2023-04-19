const { fetch } = require('../utils/fetch')

const baseUrl = 'https://echo-serv.tbxnet.com'
const authToken = 'aSuperSecretKey'

const baseRequestOptions = {
  hostname: `${baseUrl.replace(/^https:\/\//, '')}`,
  port: 443,
  headers: {
    Authorization: `Bearer ${authToken}`
  }
}

const getFileList = async () => {
  try {
    const response = await fetch({ ...baseRequestOptions, path: '/v1/secret/files' })

    return { ok: true, value: JSON.parse(response) }
  } catch (error) {
    return { ok: false, error }
  }
}

const getFile = async (filePath) => {
  try {
    const response = await fetch({ ...baseRequestOptions, path: `/v1/secret/file/${filePath}` })

    return { ok: true, value: response }
  } catch (error) {
    return { ok: false, error }
  }
}

module.exports = {
  getFileList,
  getFile
}
