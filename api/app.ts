import express from 'express'
import { readFileSync } from 'fs'

const PORT = 8999

const app = express()

const allData = JSON.parse(readFileSync('./data/all_data.json').toString())

app.get('/all-data', (req, res) => {
  return res.status(200).json(allData)
})

app.listen(PORT, () => {
  console.log(`dexpooler api is running on port ${ PORT }...`)
})
