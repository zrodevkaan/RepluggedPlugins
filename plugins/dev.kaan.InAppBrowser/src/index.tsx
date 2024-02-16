/* eslint-disable no-extend-native */
import React, { useRef, useState } from "react";
import { Injector, util, webpack } from "replugged";
import { contextMenu, ReactDOM } from "replugged/common";
import { ContextMenu } from "replugged/components";
import { ContextMenuTypes } from "replugged/types";
import { Base } from "replugged/dist/renderer/coremods/badges/badge";
import './styles.css';

const Modals: any = webpack.getByProps("TextInput");
const injector = new Injector();

function EmbeddingInput() {
  const [link, setLink] = useState("");
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [position, setPosition] = useState({ x: 500, y: 300 });
  const [iframeDims, setIframeDims] = useState({ width: 500, height: 500 });
  const draggableDiv = useRef(null);
  const resizableDiv = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [initialGrip, setInitialGrip] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleInput = (e) => {
    setLink(e);
  };

  const startDrag = (e) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const doDrag = (e) => {
    if (!dragging) return;
    setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const stopDrag = () => {
    setDragging(false);
  };

  const startResize = (e) => {
    e.stopPropagation();
    setInitialGrip({ x: e.clientX, y: e.clientY });
    setResizing(true);
  };

  const doResize = (e) => {
    if (!resizing) return;
    const width = iframeDims.width + (e.clientX - initialGrip.x);
    const height = iframeDims.height + (e.clientY - initialGrip.y);
    setIframeDims({ width, height });
    setInitialGrip({ x: e.clientX, y: e.clientY });
  };

  const stopResize = () => {
    setResizing(false);
  };

  const handleDelete = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    isVisible && (
      <div className={"inappbrowser-textbar"}>
        <Modals.TextInput
          style={{
            position: "absolute",
            top: "90px",
            width: 200,
            height: 30,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          onChange={handleInput}
          value={link}
        />
        {link && (
          <div
            className={"inappbrowser-draggable"}
            ref={draggableDiv}
            onMouseDown={startDrag}
            onMouseMove={doDrag}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            style={{
              position: "absolute",
              top: position.y + "px",
              left: position.x + "px",
              padding: "15px",
              width: iframeDims.width + "px",
              height: iframeDims.height + "px",
              backgroundColor: "transparent",
            }}>
            <div 
              className={"inappbrowser-toolbar"}
              style={{
                width: "100%",
                height: "35px",
                backgroundColor: "#ccc",
                display: "flex",
                justifyContent: "space-between",
                padding: "5px",
              }}>
              <button onClick={handleMinimize}> {isMinimized ? "Maximize" : "Minimize"} </button>
              <button onClick={handleDelete}> Delete</button>
            </div>

            <div
              className={"inappbrowser-resizer"}
              ref={resizableDiv}
              style={{
                position: "relative",
                width: "calc(100% - 30px)",
                height: "calc(100% - 30px)",
                boxSizing: "border-box",
                display: isMinimized ? "none" : "block",
              }}>
              <iframe
                src={link}
                style={{ position: "absolute", top: "0px", width: "100%", height: "100%" }}
              />
            </div>

            <div 
              className={"inappbrowser-otherStuiff"}
              onMouseDown={startResize}
              onMouseMove={doResize}
              onMouseUp={stopResize}
              onMouseLeave={stopResize}
              style={{
                position: "absolute",
                right: "0px",
                bottom: "0px",
                width: "20px",
                height: "20px",
                backgroundColor: "red",
                cursor: "nwse-resize",
              }}
            />
          </div>
        )}
      </div>
    )
  );
}

export function start() {
  const rootDiv = document.createElement("div");
  rootDiv.id = "rootDiv";
  document.body.appendChild(rootDiv);
  ReactDOM.render(<EmbeddingInput />, rootDiv);
}

export function stop(): void {
  const rootDiv = document.getElementById("rootDiv");
  if (rootDiv) {
    ReactDOM.unmountComponentAtNode(rootDiv);
    rootDiv.remove();
  }
  injector.uninjectAll();
}
