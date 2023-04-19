const { Router } = require('express')
const { getFileList, getFile } = require('../apis/external')

const filesRouter = Router()

filesRouter.get('/list', async (_req, res) => {
  try {
    const fileListResponse = await getFileList()

    if (!fileListResponse.ok) {
      res.status(fileListResponse.error?.status || 500).send({ error: fileListResponse.error })
      return
    }

    res.status(200).send(fileListResponse.value)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error })
  }
})

filesRouter.get('/data', async (req, res) => {
  try {
    const fileListResponse = await getFileList()

    if (!fileListResponse.ok) {
      res.status(fileListResponse.error?.status || 500).send({ error: fileListResponse.error })
      return
    }

    const { files } = fileListResponse.value

    const { fileName: fileNameQuery } = req.query || {}

    const parsedFiles = await Promise.all(
      files
        .filter((fileName) => !fileNameQuery || fileNameQuery === fileName)
        .map(async (filePath) => {
          try {
            const fileResponse = await getFile(filePath)

            if (!fileResponse.ok) return { file: filePath, error: fileResponse.error }

            const file = fileResponse.value

            const [headersStr, ...lineStrs] = file.split('\n')

            const headers = headersStr.split(',')

            const lines = lineStrs
              .map((lineStr) => {
                const linePropertyArr = lineStr.split(',')
                return linePropertyArr.length === headers.length
                  ? headers.reduce((acc, property, idx) => {
                    if (property === 'file') return acc

                    acc[property] = linePropertyArr[idx]
                    return acc
                  }, {})
                  : null
              })
              .filter((lineArr) => !!lineArr)

            return { file: filePath, lines }
          } catch (error) {
            return { file: filePath, error }
          }
        })
    )

    res.status(200).send(parsedFiles.filter(({ error }) => !error))
  } catch (error) {
    console.error(error)
    res.status(500).send({ error })
  }
})

module.exports = filesRouter
