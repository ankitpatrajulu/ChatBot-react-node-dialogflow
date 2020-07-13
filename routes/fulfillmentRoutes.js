const dfff = require('dialogflow-fulfillment')
const {WebhookClient} = require('dialogflow-fulfillment')
const {findUser} = require('../dbquery/QueryHandler')
const structjson = require('../chatbot/structjson')
const chatbot = require('../chatbot/chatbot')
const axios = require('axios')
const alaql = require('alasql')
const date = require('date-and-time')
const jsonQuery = require('json-query')

const {
  Readable,
  Writable,
  Transform,
  Duplex,
  pipeline,
  finished 
} = require('readable-stream')

let jsonFetch = undefined

module.exports = app => {
    app.post('/', async (req, res) => {
        const agent = new WebhookClient({
            request: req, 
            response: res
        })

        function CountIntent(agent) {
           
            agent.add('Welcome to the CountIntent fulfillment. ')

        }

        function countIntentYes(agent) {     
          agent.add('This is where the link would populate!')
      }

        function getSpreadsheetData() {
          if(jsonFetch === undefined){
            jsonFetch = axios.get('https://sheetdb.io/api/v1/4w9863nrgi2l4')
          }
          return jsonFetch
        }

        function connectSpreadsheet(agent) {
          const name = agent.parameters.name
          // return obtainCondition(agent).then((count) => {
          //   agent.add(`The count is ${count}.`)
          // })
          
           return getSpreadsheetData().then((res) => {
             let flag = '0'
              res.data.map(invoice => {
                if(invoice.InvoiceNumber === name) {
                  agent.add(`Here are the details for ${name} Invoice Date: ${invoice.InvoiceDate} Error Comment : ${invoice.Error_Comments}`)
                  flag = '1'
                }
              })
              if(flag === '0'){
                agent.add('Invoice not found')
              }
           }).catch((err) => {
             console.log(err)
                agent.add('Something went wrong')
           })
      }

      

    function formattedDate(givenDate, type) {
      const pattern = date.compile('YYYY-MM-DD...')
      const newdate = date.parse(givenDate, pattern)
      let formattedDate = ''
      if(type === 'PO') {
        formattedDate = date.format(newdate, 'MM/DD/YY')
      }else {
        formattedDate = date.format(newdate, 'MM/DD/YYYY')
      }
      return formattedDate
    }

    async function obtainCondition(agent) {
      const parameters = agent.parameters
      let condition = ''
      let datenew
      if(parameters.date) {
        datenew = formattedDate(parameters.date)
        console.log(datenew)
      }
      switch(parameters.name){
        case 'PO':
          condition= `PO_Invoice=TRUE & Invoice_Date=${datenew}`
          querySpreadsheet(condition).then((count) => {
            console.log('In obtainCondition ', count)
            return count
          })
          break;
      }
    }

        function customPayloadFunction(agent) {
                const count = "7890"
                var payloadData = {
                    "richContent": [
                          {
                            "type": "Invoice Count",
                            "title": "The sum total of all invoices",
                            "subtitle": "--AMS Team",
                            "image": {
                              "src": {
                                "rawUrl": "https://example.com/images/logo.png"
                              }
                            },
                            "text": count
                          }
                      ]
                }
    
                agent.add( new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}))
        }

        function customDashboard() {
          var payloadData = {
            "richContent": [
                  {
                    "type": `${parameters.InvoiceType} Invoice Count`,
                    "title": "The sum total of all invoices",
                    "subtitle": `${parameters.InvoiceDate}`,
                    "image": {
                      "src": {
                        "rawUrl": "https://example.com/images/logo.png"
                      }
                    },
                    "text": `${count}`
                  }
              ]
        }

        agent.add( new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}))
        }

        function customPayload(parameters, count) {
          var payloadData = {
              "richContent": [
                    {
                      "type": `${parameters.InvoiceType} Invoice Count`,
                      "title": "The sum total of all invoices",
                      "subtitle": `${parameters.InvoiceDate}`,
                      "image": {
                        "src": {
                          "rawUrl": "https://example.com/images/logo.png"
                        }
                      },
                      "text": `${count}`
                    }
                ]
          }

          agent.add( new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}))
        }


        function countInvoices(agent) {
          const parameters = agent.parameters
          return getSpreadsheetData().then((res) => {
            //const res = jsonFetch
            //console.log(jsonFetch)
            let condition = ''
            let datenew = ''
            if(parameters.date) {
              datenew = formattedDate(parameters.date, parameters.InvoiceType)
              console.log(datenew)
            }
            console.log(parameters.InvoiceType)
            switch(parameters.InvoiceType){
              case 'PO':
                console.log(datenew)
                condition = `PO_Invoice=TRUE & InvoiceDate=${datenew}`
                // PO_Invoice=TRUE & 
                // let count = querySpreadsheet(res, condition)
                // var result = jsonQuery(`data[*${condition}].InvoiceNumber`, {
                //   data: res
                // }).value
                // console.log(result)
                //   let count = 0
                //   result.map(invoice => {
                //       count++
                //   })
                  // agent.add(`The count is ${count}.`)
                //console.log(result)
            break;

            case 'Non PO':
              condition = `PO_Invoice=FALSE & InvoiceDate=${datenew}`
              break;
            
            case 'Exception':
              condition = `InvoiceDate=${datenew}`
              break;

            case 'All': 
              condition = ''
              break;
            }
            let count = querySpreadsheet(res, condition)

            customPayload(parameters, count)

            //agent.add(`The count is ${count}.`)
          }).catch((e) => {
            console.log(e)
            agent.add('I had some error on my end')
          })
        }

        function querySpreadsheet(res, condition){
          var result = jsonQuery(`data[*${condition}].InvoiceNumber`, {
              data: res
          }).value
          //console.log(result)
          let count = 0
          result.map(invoice => {
              count++
          })
          //console.log('In querySpreadsheet ', count)
          return count
          }

        function loadData() {
          agent.add('Loaded')
          return getSpreadsheetData().then((res) => {
            console.log('Loaded')
          }).catch((e) => {
            console.log('Not Loaded')
          })
        }

        function getTopSupplierDuplicate(agent){
          const parameters = agent.parameters
          return getSpreadsheetData().then((res) => {
              const condition = "*ErrDup=TRUE"
              const condition2 = formattedDate('2020-03-31T06:30:00.000+00:00')
              //  & InvoiceDate=${condition2}
              var resultSN = jsonQuery(`data[${condition}].Supplier_Name`, {
                  data: res
              }).value
              var resultIT = jsonQuery(`data[${condition}].InvoiceTotal`, {
                  data: res
              }).value
              //console.log(result)
              var arr = []
              const distinct = [...new Set(resultSN)]
              distinct.map(invoice => {
                  var rep = getOccurrence(resultSN, resultIT, invoice)
                  arr.push([invoice, rep.count, rep.total.toFixed(3)])
              })
              //console.log(arr[0][1])
              if(parameters.maxDupCount === 'amount') {
                arr.sort(compareThirdColumn)
              } else{
                arr.sort(compareSecondColumn)
              }
              customPayloadSupplier(arr)
              
              //console.log(distinct)
              // let count = 0
              // distinct.map(invoice => {
              //     count++
              // })
              // console.log('For Distinct Vendors',count)
              // return count
          }).catch((e) => {
              console.log(e)
          })
      }

      function customPayloadSupplier(array) {
        var payloadData = {
            "richContent": [
                  {
                    "type": `${array[1][0]}`,
                    "title": `Duplicate Invoices- ${array[1][1]}`,
                    "subtitle": `Duplicate Invoices- ${array[1][1]}`,
                    "image": {
                      "src": {
                        "rawUrl": "https://example.com/images/logo.png"
                      }
                    },
                    "text": `${array[1][2]} $`
                  },
                  {
                    "type": `${array[2][0]}`,
                    "title": `Duplicate Invoices- ${array[2][1]}`,
                    "subtitle": `Duplicate Invoices- ${array[2][1]}`,
                    "image": {
                      "src": {
                        "rawUrl": "https://example.com/images/logo.png"
                      }
                    },
                    "text": `${array[2][2]} $`
                   }
                  ,
                  {
                    "type": `${array[3][0]}`,
                    "title": `Duplicate Invoices- ${array[3][1]}`,
                    "subtitle": `Duplicate Invoices- ${array[3][1]}`,
                    "image": {
                      "src": {
                        "rawUrl": "https://example.com/images/logo.png"
                      }
                    },
                    "text": `${array[3][2]} $`
                  },
                  {
                    "type": `${array[4][0]}`,
                    "title": `Duplicate Invoices- ${array[4][1]}`,
                    "subtitle": `Duplicate Invoices- ${array[4][1]}`,
                    "image": {
                      "src": {
                        "rawUrl": "https://example.com/images/logo.png"
                      }
                    },
                    "text": `${array[4][2]} $`
                  },
                  {
                    "type": `${array[5][0]}`,
                    "title": `Duplicate Invoices- ${array[5][1]}`,
                    "subtitle": `Duplicate Invoices- ${array[5][1]}`,
                    "image": {
                      "src": {
                        "rawUrl": "https://example.com/images/logo.png"
                      }
                    },
                    "text": `${array[5][2]} $`
                  }
                ]
             }
          agent.add( new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}))
      }
      
      function compareSecondColumn(a, b) {
          if (a[1] === b[1]) {
              return 0;
          }
          else {
              return (a[1] > b[1]) ? -1 : 1;
          }
      }

      function compareThirdColumn(a, b) {
        if (parseFloat(a[2]) === parseFloat(b[2])) {
            return 0;
        }
        else {
            return ( parseFloat(a[2]) >  parseFloat(b[2])) ? -1 : 1;
        }
    }
      
      function getOccurrence(array, arrayIT, value) {
          let total = 0.00
          let i = 0
          let count = array.filter((v) => {
              if(v === value) {
                  total = parseFloat(total) + parseFloat(arrayIT[i++])
                  return (v === value)
              }else {
                  i++
                  return (v === value)
              }
          }).length;
          return {
              count,
              total
          }
      }
      
      

        function fallback(agent) {
            agent.add('I didn\'t understand!')
            agent.add('I\'m sorry, can you try again?')
        }

        let intentMap = new Map()
        //intentMap.set('LoadData', loadData)
        intentMap.set('CountIntent', countInvoices)
        intentMap.set('Default Fallback Intent', fallback)
        intentMap.set('customPayloadFunction', customPayloadFunction)
        intentMap.set('connectSpreadsheet', connectSpreadsheet)
        intentMap.set('CountIntent-yes', countIntentYes)
        intentMap.set('topFiveDuplicateSupplier', getTopSupplierDuplicate)
        
        
        agent.handleRequest(intentMap)

    })
}