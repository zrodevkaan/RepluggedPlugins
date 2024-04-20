import { useState } from 'react';
import { Injector, settings, util, webpack } from 'replugged';
import { SwitchItem, TextArea } from 'replugged/components';
import './styles.css';

const owo = await settings.init('dev.kaan.morenotes');
const injector = new Injector();
const NotesArea = webpack.getBySource('action:"SET_NOTE"', { raw: true })?.exports;
const { Heading }: any = webpack.getByProps('Heading');
//const UserProfileNotesArea: any = webpack.getBySource("UserProfileSections.USER_INFO_CONNECTIONS", { raw: true })?.exports;
const ProfilePopoutNotesArea: any = webpack.getBySource('.Messages.NOTE_PLACEHOLDER', { raw: true })?.exports

export function start() {
  injector.after(
    NotesArea,
    'default',
    (args: any, res, instance) => {
      addMoreNotesComponent(res.props.children, args[0].user?.id);
    }
  );
  injector.after(
    ProfilePopoutNotesArea,
    'default',
    (args: any, res, instance) => {
      //console.log(args, res)
      if (!res?.props?.children) return
      return <div>
        uwu
      </div>
      //addMoreNotesComponent(res?.props?.children, args[0].user?.id);
    }
  );
  /*injector.after(
    webpack.getByProps('createScroller'),
    'createScroller',
    (args: any, res, instance) => {
      console.log(args, res, instance)
      //addMoreNotesComponent(args?.children?.[0]?.[0]?.props?.children, args[0].user.id);
    }
  );*/
  // doesnt work on full profile popout yet. im lazy
}

export function stop() {
  injector.uninjectAll();
}

function handleNoteChange(event, userId, setText) {
  const notes = owo.get('notes') || [];
  const existingNoteIndex = notes.findIndex((note) => note.userId === userId);

  if (existingNoteIndex !== -1) {
    notes[existingNoteIndex].note = event;
  } else {
    notes.push({ userId, note: event });
  }
  owo.set('notes', notes);
  setText(event);
}

function getUserNote(userId) {
  const notes = owo.get('notes') || [];
  const userNote = notes.find((note) => note.userId === userId);
  return userNote ? userNote.note : '';
}

function addMoreNotesComponent(children, userId) {
  const [text, setText] = useState(getUserNote(userId));
  const notesEnabled = owo.get('defaultNotesEnabled');
  const notesHeader = <Heading className="moreNotesHeader">MORE NOTES</Heading>;
  const notesTextArea =
    <TextArea
      placeholder="Click to add MORE notes."
      className="moreNotes_uwu"
      onChange={(e) => handleNoteChange(e, userId, setText)}
      value={text}
    />;

  notesEnabled ? children.splice(0, 2, notesHeader, notesTextArea) : children.push(notesHeader, notesTextArea);
}

export function Settings() {
  return (
    <div>
      <SwitchItem note={"This allows you to remove the default note area."}
        {...util.useSetting(owo, 'defaultNotesEnabled', false)}>
        Disable Normal Notes
      </SwitchItem>
    </div>
  )
}
