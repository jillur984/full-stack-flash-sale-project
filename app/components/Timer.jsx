"use client";
import React, { useState, useEffect } from "react";

const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Set your target deadline (example: 5 hours from now)
  const deadline = Date.now() + 5 * 60 * 60 * 1000; // 3 hours in ms

  const getTime = () => {
    const time = deadline - Date.now();

    if (time > 0) {
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    } else {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  };

  useEffect(() => {
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer bg- text-center text-xl flex gap-1 p-0.5 font-bold">
      <span className="p-[1px] bg-[#0B2A6E] text-[17px] text-white ">
        {String(hours).padStart(2, "0")}
      </span>

      <span className="p-[1px] bg-[#0B2A6E] text-[17px] text-white">
        {String(minutes).padStart(2, "0")}
      </span>

      <span className="p-[1px] bg-[#0B2A6E] text-[17px] text-white">
        {String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
};

export default Timer;
