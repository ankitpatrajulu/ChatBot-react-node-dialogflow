const dfff = require('dialogflow-fulfillment')
const {WebhookClient} = require('dialogflow-fulfillment')
const structjson = require('../chatbot/structjson')
const chatbot = require('../chatbot/chatbot')
const axios = require('axios')
const date = require('date-and-time')
const jsonQuery = require('json-query')
const random = require('random-number')
const mongoose = require('mongoose');

const Login = mongoose.model('registration')

const {
  Readable,
  Writable,
  Transform,
  Duplex,
  pipeline,
  finished 
} = require('readable-stream')

let jsonFetch = undefined
let jsonFetchPO = undefined
let jsonFetchNONPO = undefined
let jsonFetchMetrics = undefined
let jsonFetchWeekEndDup = undefined
let userTypeDefine = undefined

module.exports = app => {
    app.post('/', async (req, res) => {
        const agent = new WebhookClient({
            request: req, 
            response: res
        })

        function countIntentYes(agent) {     
          agent.add('This is where the link would populate!')
      }

        function getSpreadsheetData() {
          if(jsonFetch === undefined){
            jsonFetch = axios.get('https://sheetdb.io/api/v1/4w9863nrgi2l4')
          }
          return jsonFetch
        }

        function getPOSpreadsheetData() {
          if(jsonFetchPO === undefined){
            jsonFetchPO = axios.get('https://sheetdb.io/api/v1/x8wyjtqfkwnxg')
          }
          return jsonFetchPO
        }

        function getNONPOSpreadsheetData() {
          if(jsonFetchNONPO === undefined){
            jsonFetchNONPO = axios.get('https://sheetdb.io/api/v1/nc2daw5oaennt')
          }
          return jsonFetchNONPO
        }

        function getMetricsSpreadsheetData() {
          if(jsonFetchMetrics === undefined){
              jsonFetchMetrics = axios.get('https://sheetdb.io/api/v1/ju9kztgsx5q84')
          }
          return jsonFetchMetrics
      }
      
      function getWeekEndDupSpreadsheetData() {
          if(jsonFetchWeekEndDup === undefined){
              jsonFetchWeekEndDup = axios.get('https://sheetdb.io/api/v1/wgh5gffe9h29e')
          }
          return jsonFetchWeekEndDup
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

    function formattedDate2(givenDate) {
      const pattern = date.compile('YYYY-MM-DD...')
      const newdate = date.parse(givenDate, pattern)
      let formattedDate = ''
      formattedDate = date.format(newdate, 'DD/MM/YYYY')
      return formattedDate
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


        function errorCountInvoices(agent) {
          const user = userType()
          console.log(user)
          switch(user) {
          case 'vendor': 
            agent.add('You do not have access to this scope.')
            break;
          
          case 'none':
            agent.add('Login/Register to get access to the data!')
            break;
          
          case 'admin':
          const parameters = agent.parameters
          return getSpreadsheetData().then((res) => {
            let condition = ''
            let datenew = '*'
            if(parameters.date) {
              datenew = formattedDate(parameters.date, parameters.InvoiceType)
            }
            if(parameters.InvoiceType[0] === 'Exception'){
              if(parameters.InvoiceType[1]){
                switch (parameters.InvoiceType[1]){
                  case 'PO':
                    console.log(datenew)
                    condition = `PO_Invoice=TRUE & InvoiceDate=${datenew}`
                    break;

                  case 'Non PO':
                    condition = `PO_Invoice=FALSE & InvoiceDate=${datenew}`
                    break;
                  
                  case 'All': 
                    condition = ''
                    break;
                  }
                  
                }
              }else {
              switch(parameters.InvoiceType[0]){
                case 'PO':
                  console.log(datenew)
                  condition = `PO_Invoice=TRUE & InvoiceDate=${datenew}`
                  
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
            }
            
            let count = querySpreadsheet(res, condition)

            customPayload(parameters, count)
          }).catch((e) => {
            console.log(e)
            agent.add('I had some error on my end')
          })
        }
        }

        function querySpreadsheet(res, condition){
          var result = jsonQuery(`data[*${condition}].InvoiceNumber`, {
              data: res
          }).value
          let count = 0
          result.map(invoice => {
              count++
          })
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
          const user = userType()
          console.log(user)
          switch(user) {
          case 'vendor': 
            agent.add('You do not have access to this scope.')
            break;
          
          case 'none':
            agent.add('Login/Register to get access to the data!')
            break;
          
          case 'admin':
          const parameters = agent.parameters
          return getSpreadsheetData().then((res) => {
              const condition = "*ErrDup=TRUE"
              const condition2 = formattedDate('2020-03-31T06:30:00.000+00:00')
              var resultSN = jsonQuery(`data[${condition}].Supplier_Name`, {
                  data: res
              }).value
              var resultIT = jsonQuery(`data[${condition}].InvoiceTotal`, {
                  data: res
              }).value
              var arr = []
              const distinct = [...new Set(resultSN)]
              distinct.map(invoice => {
                  var rep = getOccurrence(resultSN, resultIT, invoice)
                  arr.push([invoice, rep.count, rep.total.toFixed(3)])
              })
              if(parameters.maxDupCount === 'amount') {
                arr.sort(compareThirdColumn)
              } else{
                arr.sort(compareSecondColumn)
              }
              customPayloadSupplier(arr)
          }).catch((e) => {
              console.log(e)
          })
        }
      }

      function getTopPOSupplier(agent) {
        const user = userType()
        console.log(user)
        switch(user) {
          case 'vendor': 
            agent.add('You do not have access to this scope.')
            break;
          
          case 'none':
            agent.add('Login/Register to get access to the data!')
            break;
          
          case 'admin':
            return getPOSpreadsheetData().then((res) => {
              var resultSN = jsonQuery(`data.SupplierNumber`, {
                  data: res
              }).value
              var resultIT = jsonQuery(`data.InvoiceTotal`, {
                  data: res
              }).value
              var arr = []
              const distinct = [...new Set(resultSN)]
              distinct.map(invoice => {
                  var rep = getOccurrence(resultSN, resultIT, invoice)
                  arr.push([invoice, rep.count, rep.total.toFixed(1)])
              })
              arr.sort(compareThirdColumn)
              arr.shift()
              let count = 0
              distinct.map(invoice => {
                  count++
              })
  
              topFiveSupplierPO_NONPO_Payload(arr, count, 'PO')
          }).catch((e) => {
              console.log(e)
          })
          break;
        }
        
    }
    
    function getTopNONPOSupplier(agent) {
      const user = userType()
        console.log(user)
        switch(user) {
          case 'vendor': 
            agent.add('You do not have access to this scope.')
            break;
          
          case 'none':
            agent.add('Login/Register to get access to the data!')
            break;
          
          case 'admin':
        return getNONPOSpreadsheetData().then((res) => {
            var resultSN = jsonQuery(`data.SupplierNumber`, {
                data: res
            }).value
            var resultIT = jsonQuery(`data.InvoiceTotal`, {
                data: res
            }).value

            var arr = []
            const distinct = [...new Set(resultSN)]
            distinct.map(invoice => {
                var rep = getOccurrence(resultSN, resultIT, invoice)
                arr.push([invoice, rep.count, rep.total.toFixed(1)])
            })

            arr.sort(compareThirdColumn)

            let count = 0
            distinct.map(invoice => {
                count++
            })

            topFiveSupplierPO_NONPO_Payload(arr, count, 'NON PO')

        }).catch((e) => {
            console.log(e)
        })
      }
    }

    function topFiveSupplierPO_NONPO_Payload(array, count, type) {
      var payloadData = {
          "richContent": [
                {
                  "type": `Top 5 ${type} Supplier`,
                  "title": "default",
                  "subtitle": `1- ${array[0][0]}/n2- ${array[1][0]}/n3- ${array[2][0]}/n4- ${array[3][0]}/n5- ${array[4][0]}`,
                  "image": {
                    "src": {
                      "rawUrl": "https://example.com/images/logo.png"
                    }
                  },
                  "text": `Total Distinct Vendors- ${count}`,
                  "vendor1" : `${array[0][0]}`,
                  "data1" : `${array[0][2]}`,
                  "vendor2": `${array[1][0]}`,
                  "data2": `${array[1][2]}`,
                  "vendor3": `${array[2][0]}`,
                  "data3": `${array[2][2]}`,
                  "vendor4": `${array[3][0]}`,
                  "data4": `${array[3][2]}`,
                  "vendor5": `${array[4][0]}`,
                  "data5": `${array[4][2]}`
                }
            ]
      }

      agent.add( new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}))
    }
    

      function customPayloadSupplier(array) {
        var payloadData = {
            "richContent": [
                  {
                    "type": `${array[1][0]}`,
                    "title": `Duplicate Invoices- ${array[1][1]}`,
                    "subtitle": "https://kaiser-deloitte-powerbi.herokuapp.com/",
                    "image": {
                      "src": {
                        "rawUrl": "https://kaiser-deloitte-powerbi.herokuapp.com/"
                      }
                    },
                    "text": `${array[1][2]} $`
                  },
                  {
                    "type": `${array[2][0]}`,
                    "title": `Duplicate Invoices- ${array[2][1]}`,
                    "subtitle": "https://kaiser-deloitte-powerbi.herokuapp.com/",
                    "image": {
                      "src": {
                        "rawUrl": "https://kaiser-deloitte-powerbi.herokuapp.com/"
                      }
                    },
                    "text": `${array[2][2]} $`
                   }
                  ,
                  {
                    "type": `${array[3][0]}`,
                    "title": `Duplicate Invoices- ${array[3][1]}`,
                    "subtitle": "https://kaiser-deloitte-powerbi.herokuapp.com/",
                    "image": {
                      "src": {
                        "rawUrl": "https://kaiser-deloitte-powerbi.herokuapp.com/"
                      }
                    },
                    "text": `${array[3][2]} $`
                  },
                  {
                    "type": `${array[4][0]}`,
                    "title": `Duplicate Invoices- ${array[4][1]}`,
                    "subtitle": "https://kaiser-deloitte-powerbi.herokuapp.com/",
                    "image": {
                      "src": {
                        "rawUrl": "https://kaiser-deloitte-powerbi.herokuapp.com/"
                      }
                    },
                    "text": `${array[4][2]} $`
                  },
                  {
                    "type": `${array[5][0]}`,
                    "title": `Duplicate Invoices- ${array[5][1]}`,
                    "subtitle":"https://kaiser-deloitte-powerbi.herokuapp.com/",
                    "image": {
                      "src": {
                        "rawUrl": "https://kaiser-deloitte-powerbi.herokuapp.com/"
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

      function getProcessedInvoicesCount(agent) {
        const user = userType()
        console.log(user)
        switch(user) {
          case 'vendor': 
            agent.add('You do not have access to this scope.')
            break;
          
          case 'none':
            agent.add('Login/Register to get access to the data!')
            break;
          
          case 'admin':
        const date = agent.parameters.date[0]
        return getMetricsSpreadsheetData().then((res) => {
            const condition = formattedDate2(date)
            var resultSN = jsonQuery(`data[ProcessingDate=${condition}].InvoicesSuccesssfulProcessed`, {
                data: res
            }).value
            agent.add(`Total Processed Invoices on ${condition} are ${resultSN}`)
        }).catch((e) => {
            console.log(e)
        })
      }
    }

    function getAllInvoicesCount(agent) {
      const user = userType()
        console.log(user)
        switch(user) {
          case 'vendor': 
            agent.add('You do not have access to this scope.')
            break;
          
          case 'none':
            agent.add('Login/Register to get access to the data!')
            break;
          
          case 'admin':
      const date = agent.parameters.date
      return getMetricsSpreadsheetData().then((res) => {
          const condition = formattedDate2(date)
          var totalInvoicesReceived = jsonQuery(`data[ProcessingDate=${condition}].InvoiceCount`, {
              data: res
          }).value
          var successfulProcessed = jsonQuery(`data[ProcessingDate=${condition}].InvoicesSuccesssfulProcessed`, {
              data: res
          }).value
          var successfulPOProcessed = jsonQuery(`data[ProcessingDate=${condition}].Invoices Successsful Processed-PO`, {
              data: res
          }).value
          var successfulNONPOProcessed = jsonQuery(`data[ProcessingDate=${condition}].Invoices Successsful Processed-non-PO`, {
              data: res
          }).value
          var deloitteRejected = jsonQuery(`data[ProcessingDate=${condition}].DeloitteRejected`, {
              data: res
          }).value

          console.log(`On ${condition}, Deloitte received ${totalInvoicesReceived} Invoices.\nWe successfully processed ${successfulProcessed} invoices\n-> ${successfulPOProcessed} PO and ${successfulNONPOProcessed} Non-PO.\n->We rejected ${deloitteRejected} Invoices.`)

          totalInvoiceCountPayload({
            datenew : condition,
            totalInvoicesReceived,
            successfulProcessed,
            successfulPOProcessed,
            successfulNONPOProcessed,
            deloitteRejected
          })
            
      }).catch((e) => {
          console.log(e)
      })
    }
    }

    function totalInvoiceCountPayload(invoice) {
      console.log(invoice)
      var payloadData = {
          "richContent": [
                {
                  "type": `On ${invoice.datenew}\n, Deloitte received ${invoice.totalInvoicesReceived} invoices`,
                  "title": `Successfully Processed -> ${invoice.successfulProcessed}\nPO -> ${invoice.successfulPOProcessed}\nNON PO -> ${invoice.successfulNONPOProcessed}`,
                  "subtitle": "Not Used Payload Field",
                  "image": {
                    "src": {
                      "rawUrl": "https://example.com/images/logo.png"
                    }
                  },
                  "text": `Deloitte Rejected- ${invoice.deloitteRejected}`
                }
            ]
      }

      agent.add( new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}))
    }
      
      
        function WelcomeIntent(agent) {

          getSpreadsheetData()
          getPOSpreadsheetData()
          getNONPOSpreadsheetData()
          getMetricsSpreadsheetData()
          getWeekEndDupSpreadsheetData()
          var options = ({
            min: 0,
            max: 3,
            integer: true
          })
          var rn = random(options)
          switch(rn) {
            case 0 : agent.add('Hello! I am Invoice Bot.')
            break;
            case 1 : agent.add('Good day! I am Invoice Bot.')
            break;
            case 2 : agent.add('Greetings! I am Invoice Bot.')
            break;
            case 3 : agent.add('Welcome to Invoice Bot!')
            break;
          }

          agent.add(' What can I do for you today?')
        }

        function userType(){
          if(userTypeDefine === undefined){
            return 'none'
          } else if(userTypeDefine === 'vendor'){
            return 'vendor'
          } else if (userTypeDefine === 'admin'){
            return 'admin'
          }
        }

        function resetUserType(){
          userTypeDefine = undefined
          agent.add('You have been logged out!')
        }

        function getUserType(agent) {

          return Login.find({
            email: agent.parameters.email,
            password: agent.parameters.password
          }).then((user) => {
            console.log(user[0].userType)
            if(user.length > 0) {
              switch(user[0].userType) {
                case 'yes': 
                  userTypeDefine = 'vendor'
                  break;
                
                case 'admin':
                  userTypeDefine = 'admin'
                  break;

                default: userTypeDefine = 'none'
              }
              agent.add('Your Login was successful. Access the functions within your scope!')
            } else {
              agent.add('Login Unsuccessful. Incorrect Email or Password')
            }
           
          }).catch((e) => {

          })
          
        }

        function fallback(agent) {
            agent.add('I didn\'t understand!')
            agent.add('I\'m sorry, can you try again?')
        }

        let intentMap = new Map()
        //intentMap.set('LoadData', loadData)
        intentMap.set('WelcomeIntent', WelcomeIntent)
        intentMap.set('ErrorCountIntent', errorCountInvoices)
        intentMap.set('Default Fallback Intent', fallback)
        //intentMap.set('customPayloadFunction', customPayloadFunction)
        //intentMap.set('connectSpreadsheet', connectSpreadsheet)
        intentMap.set('CountIntent-yes', countIntentYes)
        intentMap.set('topFiveDuplicateSupplier', getTopSupplierDuplicate)
        intentMap.set('TopSupplierPO', getTopPOSupplier)
        intentMap.set('TopSupplierNONPO', getTopNONPOSupplier)
        intentMap.set('ProcessedInvoicesIntent', getProcessedInvoicesCount)
        intentMap.set('TotalCountIntent', getAllInvoicesCount)
        intentMap.set('userLogin', getUserType)
        intentMap.set('userLogout', resetUserType)
        
        agent.handleRequest(intentMap)

    })
}