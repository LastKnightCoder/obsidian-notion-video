const https = require('https');

class Notion {
  secret: string;
  constructor(secret: string) {
    this.secret = secret;
  }
    
  async getVideoURL(block_id: string): Promise<string> {
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
      // @ts-ignore
      const req = https.get(options, (res) => {
        // @ts-ignore
        const buffers = []
        // @ts-ignore
        res.on('data', data => {
          buffers.push(data)
        })
      
        res.on('end', () => {
          // @ts-ignore
          const buffer = Buffer.concat(buffers)
          const res = JSON.parse(buffer.toString())
          resolve(res?.video?.file?.url)
        })
      })

      // @ts-ignore
      req.on('err', err => {
        reject(err)
      })
    })
  }
}

export default Notion;