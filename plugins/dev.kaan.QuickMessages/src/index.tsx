import { common, Injector, util, webpack, settings, components } from "replugged";
import { ContextMenuTypes } from "replugged/types";
import {createElement, Suspense, useState} from "react";
import * as repl from "repl";
import exp from "node:constants";

const injector = new Injector();
const owo = await settings.init('dev.kaan.QuickMessages');
const {textArea}: any = webpack.getByProps("textAreaDisabled")
const {TrashIcon}: any = webpack.getByProps("TrashIcon")
const {
  ContextMenu: { MenuItem },
} = components;

interface QuickMessagesState {
  quickMessages: string[];
}

interface Type {
  GET: 1,
  SET: 2
}

enum Types {
  GET = 1,
  SET = 2
}

function getMessages() {
  return owo.get('messages', ['This is a default message :D']);
}

export function start() {
  injector.utils.addMenuItem("textarea-context" as ContextMenuTypes,  (data, objectSomething: any) => {
    const messages = getMessages();
    return (
      <>
        <MenuItem
          id="add-birthday-copy-paste-LEL"
          label="Add Quick Message"
          action={() => {
            const selectedText: HTMLElement = document.querySelector(`.${textArea}`);
            addQuickMessage(selectedText.innerText);
          }}
        />
        <MenuItem id={'nuh-uh-two'} label="Quick Messages">
          {messages.map((message: string) => (
            <MenuItem
              label={message}
              action={() => {
                // @ts-ignore
                // im so SICK of typescript saying "oh well do it thi-" NOO. STOP IT.
                const Instance: {insertText: (message: string) => void} = util.findInTree(objectSomething, x=>Boolean(x?.editor)).editor
                Instance.insertText(message)
              }}
              id={`quick-message-${message}`}/>
          ))}
        </MenuItem>
      </>
    );
    
  });
  injector.utils.addMenuItem("message" as ContextMenuTypes,  (data: {message: { content: string }}, objectSomething: any) => {
    return (
      <>
        <MenuItem
          id="add-birthday-copy-paste-LEL"
          label="Copy as Quick Message"
          action={() => {
            addQuickMessage(data.message.content)
          }}
        />
      </>
    );
  });
}

export function addQuickMessage(message: string): void {
  const currentMessages = getMessages();
  if (!currentMessages.includes(message)) {
    currentMessages.push(message);
    owo.set('quickMessages', currentMessages);
  }
}


export function stop(): void {
  injector.uninjectAll();
}

export function Settings()
{
  function Blahblahbalhreactsucks()
  {
    const [messages, setMessages] = useState(getMessages() || []);

    function deleteMessage(index: number) {
      const newMessages = [...messages];
      newMessages.splice(index, 1);
      setMessages(newMessages);
      owo.set('messages', newMessages);
      console.log(newMessages);
    }

    return (
      <div>
        {messages.map((message, index) =>
          <div key={index}>
            <p style={{ color: "white" }}>{message}</p>
            <TrashIcon onClick={() => deleteMessage(index)}>Delete</TrashIcon>
          </div>
        )}
      </div>
    );

  }
  
  return Blahblahbalhreactsucks();
}
