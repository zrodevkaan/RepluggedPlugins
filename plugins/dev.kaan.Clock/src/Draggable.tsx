import React, { useEffect, useState } from "react";
import { webpack } from "replugged";
const Shiny: { shinyButton: string } = webpack.getByProps("shinyButton");
const Gift: { giftButton: string } = webpack.getByProps("giftButton");
const MoreGifStuffSmh: { giftButton: string } = webpack.getByProps("innerGiftButton");
const ButtonsDudeIHateThis: { button: string } = webpack.getByProps("disabledButtonOverlay");

const DraggableComponent: React.FC = () => {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rel, setRel] = useState(null);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  );

  const onMouseDown = (e: any) => {
    if (e.button !== 0) return;
    const pos = e.target.getBoundingClientRect();
    setDragging(true);
    setRel({ x: e.pageX - pos.left, y: e.pageY - pos.top });
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseUp = (e: any) => {
    setDragging(false);
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMove = (e: any) => {
    if (!dragging) return;
    setPos({
      x: e.pageX - rel.x,
      y: e.pageY - rel.y,
    });
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedTime = currentTime.startsWith("0") ? currentTime.substring(1) : currentTime;
      setTime(formattedTime);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      className={
        Shiny.shinyButton +
        " " +
        Gift.giftButton +
        " " +
        MoreGifStuffSmh.giftButton +
        " " +
        ButtonsDudeIHateThis.button
      }
      // this is so terrible.
      // why am I doing this.
      // someone send help.
      style={{
        position: "absolute",
        top: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        padding: "10px",
        display: "flex",
        width: "200px",
        height: "40px",
        alignItems: "center",
        justifyContent: "center",
        cursor: "move",
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: "1.1",
        backgroundColor: "black",
      }}>
      {time}
    </div>
  );
};

export default DraggableComponent;
