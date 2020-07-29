const express = require('express')
const app = express()

const bodyParser = require('body-parser')
require('dotenv').config()

const morgan=require('morgan')
const Person = require('./models/person')

const cors = require('cors')
app.use(cors())


app.use(express.json())
const { response } = require('express')


app.use(bodyParser.json())
app.use(express.static('build'))




  
  morgan.token('jsonBody', (req, res) => JSON.stringify(req.body))

  const morgenLogger = morgan(function (tokens, req, res) {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['jsonBody'](req, res)
      ].join(' ')
    })

app.use(morgenLogger) 



app.get('/info',(req,res) => {
    const date=new Date();


    res.send('<p>Phonebook has info for ' +persons.length +' people</p>'+date+' (Eactern European Standard Time)')
})


  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons =>{
    res.json(persons.map(person => person.toJSON()))


    })
  })

  const generateId = () => {
    let randomId = () => Math.floor(Math.random() * 1000);
    let id = randomId(); 
    while (persons.some((p) => p.id === id)) {
        id = randomId();
    }
    return id
}  


app.post('/api/persons', (request, response) => {
  const body = request.body

 
 if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name and/or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
})


app.get('/api/persons/:id', (request, response) => {
      Person.findById(rewuest.params.id)
      .then(person => {
            if (person) {
              response.json(person)
            } else {
              response.status(404).end()
            }
      })
      .catch(error => next(error))
  })



  app.delete('/api/persons/:id', (request, response,next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})



const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)








const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  

app.use(unknownEndpoint)
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})