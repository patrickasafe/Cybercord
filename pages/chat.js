
import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';


/*supabase entries */
const SUPABASE_ANON_KEY =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NDI1MzMzMCwiZXhwIjoxOTU5ODI5MzMwfQ.fRWpRNAoGzQa-koO3e0CFfsS9JE7TgVj3GIllceNGZU"
const SUPABASE_URL = "https://mnmawtrijgqrkozbhvvt.supabase.co"
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);




const Chat = () => {
  const [message, setMessage] = React.useState('');
  const [messagesList, setMessagesList] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from('messages')
      .select('*')
      .order('id', { ascending: false})
      .then(({data}) => {
        console.log('Dados da consulta:', data)
        setMessagesList(data)
      });
  }, [])



  /*
  // Usuário
  - Usuário digita no campo textarea
  - Aperta enter para enviar
  - Tem que adicionar o texto na listagem
  
  // Dev
  - [X] Campo criado
  - [X] Vamos usar o onChange usa o useState (ter if pra caso seja enter pra limpar a variavel)
  - [X] Lista de mensagens 
  */

  /*handle is a function that works directly with states
  (At least it's what i thik it does)
  they usually are overuseds. So it's a good idea to remove from body
  and describes as a function to be called*/
  const handleNewMessage = (newMessage) => {
    const message = {
      //id: messagesList.length + 1,//
      from: 'patrickasafe',
      text: newMessage,
    };

    supabaseClient
    .from('messages')
    .insert([
      message
    ])
    .then(({data}) => {
       console.log('Criando mensagem: ', data)
       setMessagesList([
         data[0],
         ...messagesList,
       ]);
    })

    setMessage('');
  }

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList mensagens={messagesList} />
          {/* {messagesList.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </l i>
                        )
                    })} */}
          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              value={message}
              onChange={(event) => {
                const value = event.target.value;
                setMessage(value);
              }}
              onKeyPress={(event) => {
                /*Detecting the "Enter" as a submit form */
                if (event.key === 'Enter') {
                  /*Disable the "new paragraph" function when "Enter" is keypressed */
                  event.preventDefault();
                  handleNewMessage(message);
                }
              }}
              placeholder="Insira sua message aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  console.log(props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.mensagens.map((message) => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
              }}
            >
              <Image
                styleSheet={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${message.from}.png`}
              />
              <Text tag="strong">
                {message.from}
              </Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
              </Text>
            </Box>
            {message.text}
          </Text>
        );
      })}
    </Box>
  )
}


export default Chat