const express = require('express')
const morgan=require('morgan')
const bodyParser = require('body-parser')
require('dotenv').config()

const cors = require('cors')

const app = express()

app.use(express.static('build'))

app.use(express.json())
app.use(cors())

const Person = require('./models/person')
const { response } = require('express')

app.use(bodyParser.json())


  
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


let persons= [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1,
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]

app.get('/info',(req,res) => {
    const date=new Date();


    res.send('<p>Phonebook has info for ' +persons.length +' people</p>'+date+' (Eactern European Standard Time)')
})




app.get('/api/persons/:id', (request, response) => {
      Person.findById(rewuest.params.id).then(person => {
        response.json(person.toJSON())
      })
  })



  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
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

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'Name and/or number missing' 
        })
    }

    if (persons.some((p) => p.name === body.name)) {
        return res.status(400).json({ 
            error: 'Name must be unique' 
        })    
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }

    persons = persons.concat(person)

    res.json(person)
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  

  
app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001

app.listen(PORT)
console.log(`Server running on port ${PORT}`)