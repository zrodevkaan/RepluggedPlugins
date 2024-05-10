import {components, Injector, webpack} from "replugged";
import {ContextMenuTypes} from "replugged/types";
import {modal} from "replugged/common";
import {TextInput} from "replugged/components";
import {useState} from "react";

const { ContextMenu: { MenuItem }, } = components;
const inject = new Injector();
const {colorDanger}: any = webpack.getByProps(["colorDanger","caret"])
const Moderation: any = webpack.getByProps("setCommunicationDisabledDuration")
const ModalList: any = webpack.getByProps("ConfirmModal"); // CAN YOU STOP NOW. THANKS <3
const {Text}: any = webpack.getModule(x=>x?.exports?.default?.Text).default.Text

export function start() {
  inject.utils.addMenuItem(ContextMenuTypes.UserContext, (data, otherStuff) => (
   <MenuItem 
     id={''} 
     label={"Custom Timeout"}
     className={colorDanger}
     action={() => {OpenModal(otherStuff)}}
   />
  ));
}

export function OpenModal(user) {
  const durations = [
    { label: '1 MIN', value: 60 },
    { label: '5 MINS', value: 300 },
    { label: '10 MINS', value: 600 },
    { label: '30 MINS', value: 1800 },
    { label: '1 HOUR', value: 3600 },
    { label: '1 DAY', value: 86400 },
    { label: '3 DAYS', value: 259200 },
    { label: '5 DAYS', value: 432000 },
    { label: '7 DAYS', value: 604800 },
    { label: '14 DAYS', value: 1209600 },
    { label: '28 DAYS', value: 2419200 },
    { label: '1 MONTH', value: 2628000 }
  ];


  function ConfirmModal(props) {
    const [inputValue, setInputValue] = useState("");
    const [reason, setReason] = useState("");

    const handleDurationClick = (duration) => {
      setInputValue(duration.toString());
    };

    const handleReasonChange = (e) => {
      setReason(e);
    };
    const dat = user.data[0]
    const userData = dat.user
    return (
      <div>
        <ModalList.ConfirmModal
          {...props}
          header={`Timeout ${userData?.username}`}
          confirmText="Timeout"
          cancelText="Cancel"
          onConfirm={() => {
            Moderation.setCommunicationDisabledDuration(...[dat.guildId, userData.id, parseInt(inputValue), reason]);
            console.log(user)
          }}
        >
          <span style={{ color: 'var(--interactive-normal)'}}>
            This is basically timeout but better. I'll spare the details.
          </span>
          <TextInput
            placeholder={"Insert time in milliseconds"}
            value={inputValue}
            onChange={(e) => setInputValue(e)}
            style={{ margin: '10px 0px' }}
          />
          <TextInput
            placeholder={"Reason for timeout"}
            value={reason}
            onChange={handleReasonChange}
            style={{ margin: '3px 0px' }}
          />
          <div style={{
            display: 'grid',
            justifyContent: 'space-between',
            marginTop: '10px',
            overflow: 'hidden',
            borderRadius: '3px',
            border: '1px solid var(--primary-800)',
            gridTemplateColumns: '1fr 1fr 1fr',
          }}>
            {durations.map(duration => (
              <button
                key={duration.label}
                style={{
                  padding: '5px 10px',
                  backgroundColor: 'hsl(var(--primary-830-hsl) / 1)',
                  color: "var(--text-normal)",
                  cursor: 'pointer',
                  borderRight: '1px solid var(--primary-800)',
                  borderBottom: '1px solid var(--primary-800)'
                }}
                onClick={() => handleDurationClick(duration.value)}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </ModalList.ConfirmModal>
      </div>
    );
  }

  modal.openModal((props) => (
    <ConfirmModal {...props} />
  ));
}




export function stop() {
  inject.uninjectAll();
}
