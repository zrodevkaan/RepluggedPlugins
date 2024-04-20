import {components, Injector, settings, util, webpack} from "replugged";
import {ContextMenuTypes} from "replugged/types";
import {useState} from "react";

const injector = new Injector();
const owo = await settings.init('dev.kaan.QuickMessages');
const {textArea}: any = webpack.getByProps("textAreaDisabled")
const {TrashIcon}: any = webpack.getByProps("TrashIcon")
const {
  ContextMenu: { MenuItem },
} = components;

interface Inserts
{
  insertText: (message: string) => void
}

function getMessages() {
  return owo.get('messages', ['This is a default message :D']);
}

export function start() {
  injector.utils.addMenuItem(ContextMenuTypes.TextareaContext,  (data, objectSomething: any) => {
    const messages = getMessages();
    return (
      <>
        <MenuItem
          id="add-quick-message"
          label="Add Quick Message"
          action={() => {
            const selectedText: HTMLElement = document.querySelector(`.${textArea}`);
            addQuickMessage(selectedText.innerText);
          }}
        />
        <MenuItem id={'quick-message'} label="Quick Messages">
          {messages.map((message: string) => (
            <MenuItem
              label={message}
              action={() => {
                const Instance: Inserts = util.findInTree(objectSomething, x=>Boolean(x?.editor)).editor
                Instance.insertText(message)
              }}
              id={`quick-message-${message}`}/>
          ))}
        </MenuItem>
      </>
    );
    
  });
  injector.utils.addMenuItem(ContextMenuTypes.Message, (data: {message: { content: string }}, objectSomething: any) => {
    return (
      <>
        <MenuItem
          id="copy-as-quick-message"
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
    }

    return (
      <div>
        {messages.map((message, index) =>
          <div key={index}>
            <p style={{ color: "white" }}>
              {message}
              <TrashIcon style={{top: '-10px'}} onClick={() => deleteMessage(index)}>Delete</TrashIcon>
            </p>
          </div>
        )}
      </div>
    );

  }
  
  return Blahblahbalhreactsucks();
}
