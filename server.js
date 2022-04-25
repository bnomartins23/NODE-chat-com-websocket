const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

let messages = []

const gerarCor = () => {
    let r = Math.random()*255
    let g = Math.random()*255
    let b = Math.random()*255
    return `rgba(${r}, ${g}, ${b}, 1)`
}

io.on('connection', socket => { // Iniciar o protocolo socket
    console.log(`Socket Conectado  ${socket.id}`) // consultar o id 

    //verifico se existe id no message 
    // senão insiro uma cor aleatória


    socket.emit('previosMessage', messages) // Enviar mensagens gravadas no lista

    //On -Ouvir, emit-enviar 1 broacast - todos
    socket.on('sendMessage', data =>{ //Ouvir palavra chave sendMessage
        data.id = socket.id
        const checaColor = messages.filter((item) => {
            const color = gerarCor()
            data.color = color
            data.alinhamento = ''
            if(item.id === socket.id){
                data.color = item.color === 'brown' ? color : item.color ;
            } else {
                data.color =  color
            }
        })
        // data.color ? data.color : 'blue'
        messages.push(data); // guardar mensagem
        console.log(messages)
        socket.broadcast.emit('receivedMessage', data) //enviar para todos (broadcast)
    })
})

server.listen(3000, (err)=>{
    if (err) console.log("Erro")
    console.log("Servidor rodando em - http://localhost:3000")
})