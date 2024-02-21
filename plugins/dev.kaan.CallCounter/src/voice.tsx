import { useEffect, useState } from "react";

const VoiceRegisteredComponent = () => {
  const [timer, setTimer] = useState(new Date(0));
  // 00:00:00
  // :3

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => new Date(prevTimer.getTime() + 1000));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date) => {
    return date.toISOString().substr(11, 8);
  };
  return (
    <div>
      <div>Call: {formatTime(timer)}</div>
    </div>
  );
};

export default VoiceRegisteredComponent;
