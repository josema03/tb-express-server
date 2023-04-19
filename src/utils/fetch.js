const https = require('https')

const fetch = async (options) =>
  new Promise((resolve, reject) => {
    https
      .get(options, (resp) => {
        const data = []

        if (resp.statusCode < 200 || resp.statusCode > 299) {
          resp.on('data', (chunk) => {
            data.push(chunk)
          }).on('end', () => {
            const buffer = Buffer.concat(data)
            try {
              const error = JSON.parse(buffer.toString('utf-8'))
              reject(error)
            } catch (error) {
              reject({ status: 500 })
            }
          })
          return
        }

        resp.on('data', (chunk) => {
          data.push(chunk)
        }).on('end', () => {
          const buffer = Buffer.concat(data)
          try {
            resolve(buffer.toString('utf-8'))
          } catch (error) {
            reject(error)
          }
        })
      })
      .on('error', (error) => {
        reject(error)
      })
  })

module.exports = { fetch }
