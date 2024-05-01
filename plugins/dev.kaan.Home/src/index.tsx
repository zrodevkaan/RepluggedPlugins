import { Injector, webpack } from "replugged";
import React, { useEffect, useState } from 'react';

const inject = new Injector();
const HomeButton: any = webpack.getByProps('HomeButton')

export function start() {
  inject.after(HomeButton, "HomeButton", (args, ret) => {
    const TimerDisplay = () => {
      const [currentTime, setCurrentTime] = useState(new Date());

      useEffect(() => {
        const timerID = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);

        return function cleanup() {
          clearInterval(timerID);
        };
      }, []);

      return (
        <span style={{ fontSize: '13px', color: "white" }}>
            {currentTime.toLocaleTimeString()}
          </span>
      );
    }

    const newButton = <TimerDisplay />;
    const containerDiv = (
      <div style={{
        margin: "5px 0",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}>
        {newButton}
      </div>
    );

    return [containerDiv, ret];
  });
}

export function stop() {
  inject.uninjectAll();
}
