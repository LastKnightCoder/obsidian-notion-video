const https = require('https');

class Notion {
  constructor(secret) {
    this.secret = secret;
  }
    
  async getVideoURL(block_id) {
    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: `/v1/blocks/${block_id}`,
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Notion-Version": "2022-02-22",
        "Authorization": `Bearer ${this.secret}`
      }
    }

    return new Promise((resolve, reject) => {
      const req = https.get(options, (res) => {
        const buffers = []
        res.on('data', data => {
          buffers.push(data)
        })
      
        res.on('end', () => {
          const buffer = Buffer.concat(buffers)
          const res = JSON.parse(buffer.toString())
          resolve(res?.video?.file?.url)
        })
      })

      req.on('err', err => {
        reject(err)
      })
    })
  }
}

export default Notion;