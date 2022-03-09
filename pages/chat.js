import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NDI1MzMzMCwiZXhwIjoxOTU5ODI5MzMwfQ.fRWpRNAoGzQa-koO3e0CFfsS9JE7TgVj3GIllceNGZU";
const SUPABASE_URL = "https://mnmawtrijgqrkozbhvvt.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const listenRealTimeMessages = (addMessage) => {
  return supabaseClient
    .from("messages")
    .on("INSERT", (liveAnswer) => {
      addMessage(liveAnswer.new);
    })
    .subscribe();
};

export const ChatPage = () => {
  const routing = useRouter();
  const loggedUser = routing.query.username;
  const [message, setMessage] = React.useState("");
  const [messagesList, setMessagesList] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from("messages")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setMessagesList(data);
      });

    const subscription = listenRealTimeMessages((newMessage) => {
      setMessagesList((updatedMessageList) => {
        return [newMessage, ...updatedMessageList];
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleNewMessage = (newMessage) => {
    const message = {
      from: loggedUser,
      text: newMessage,
    };

    supabaseClient
      .from("messages")
      .insert([message])
      .then(({ data }) => {
        // setMessagesList([data[0], ...messagesList]);
      });

    setMessage("");
  };

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={messagesList} />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
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
                if (event.key === "Enter") {
                  /*Disable the "new paragraph" function when "Enter" is keypressed */
                  event.preventDefault();
                  handleNewMessage(message);
                }
              }}
              placeholder="Insert your message here..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNewMessage(`:sticker:${sticker}`);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((message) => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
                display: "flex",
              }}
            >
              <Image
                styleSheet={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${message.from}.png`}
              />
              <Box
                styleSheet={{
                  marginLeft: "20px",
                  marginTop: "8px",
                }}
              >
                <Box
                  styleSheet={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Text tag="strong">{message.from}</Text>
                  <Text
                    styleSheet={{
                      fontSize: "10px",
                      marginLeft: "8px",
                      color: appConfig.theme.colors.neutrals[300],
                    }}
                    tag="span"
                  >
                    {new Date().toLocaleDateString()}
                  </Text>
                </Box>

                <Text>
                  {message.text.startsWith(":sticker:") ? (
                    <Image src={message.text.replace(":sticker:", "")} />
                  ) : (
                    message.text
                  )}
                </Text>
              </Box>
            </Box>
          </Text>
        );
      })}
    </Box>
  );
}

export default ChatPage;
