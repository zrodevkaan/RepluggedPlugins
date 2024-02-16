/* eslint-disable no-extend-native */
import React, { useRef, useState } from "react";
import { Injector, util, webpack } from "replugged";
import { ReactDOM } from "replugged/common";
import "./styles.css";

const Modals: any = webpack.getByProps("TextInput");
const injector = new Injector();

function EmbeddingInput() {
  const [link, setLink] = useState("");
  const [tabs, setTabs] = useState([
    {
      link: "",
      isVisible: true,
      isMinimized: false,
      position: { x: 500, y: 300 },
      iframeDims: { width: 500, height: 500 },
    },
  ]);
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
  const [activeTab, setActiveTab] = useState(1);

  const handleInput = (e, index) => {
    if (e.keyCode === 13) {
      // enter key !!!
      e.preventDefault();
      setLink(e.target.value);
      setIsVisible(true);
      setTabs((prevTabs) => {
        const newTabs = [...prevTabs];
        newTabs[index] = { ...newTabs[index], link: e.target.value, isVisible: true };
        return newTabs;
      });
    }
  };

  const handleCloseTab = (index) => {
    setTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      newTabs.splice(index, 1);
      setActiveTab(Math.min(activeTab, newTabs.length - 1));
      return newTabs;
    });
  };

  const handleAddTab = () => {
    setTabs((prevTabs) => [
      ...prevTabs,
      {
        link: "",
        isVisible: true,
        isMinimized: false,
        position: { x: 500, y: 300 },
        iframeDims: { width: 500, height: 500 },
      },
    ]);
  };

  const startDrag = (e) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
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
    setTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      newTabs[activeTab] = {
        ...newTabs[activeTab],
        isMinimized: !newTabs[activeTab].isMinimized,
      };
      return newTabs;
    });
  };

  return (
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
        onKeyDown={(e) => handleInput(e, activeTab)}
      />
      {link && isVisible && (
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
          {tabs.map((tab, index) => (
            <div
              key={index}
              style={{
                display: index === activeTab ? "block" : "none",
                position: "absolute",
                top: "35px",
                left: "0px",
                width: "100%",
                height: `calc(100% - 35px)`,
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
                <div>
                  {tabs.map((tab, tabIndex) => {
                    const tabName = tab.link ? new URL(tab.link).hostname : "No Link";
                    return (
                      <div key={tabIndex} style={{ display: "flex", alignItems: "center" }}>
                        <button onClick={() => handleTabClick(tabIndex)}>
                          {tabIndex === activeTab ? `Active Tab: ${tabName}` : `${tabName}`}
                        </button>
                        <button onClick={() => handleCloseTab(tabIndex)}>Close</button>
                      </div>
                    );
                  })}
                  <button onClick={handleAddTab}>+</button>
                </div>
                <button onClick={handleMinimize}>
                  {tab.isMinimized ? "Maximize" : "Minimize"}
                </button>
                <button onClick={handleDelete}>Delete</button>
              </div>

              <div
                className={"inappbrowser-resizer"}
                ref={resizableDiv}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  boxSizing: "border-box",
                  display: tab.isMinimized ? "none" : "block",
                }}>
                <iframe
                  src={tab.link}
                  style={{
                    position: "absolute",
                    top: "0px",
                    width: "100%",
                    height: "100%",
                  }}
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
          ))}
        </div>
      )}
    </div>
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
