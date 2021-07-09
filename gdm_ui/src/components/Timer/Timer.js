import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import moment from "moment";

import classes from "./styles.css";

const renderTime = ({ remainingTime }) => {
  const names = ["Seconds", "Minutes", "Hours", "Days", "Months", "Years"];
  let index = 0;
  let time = remainingTime;
  for (; index < names.length; index++) {
    if (time / 60 > 0) time /= 60;
    else break;
  }
  return (
    <div className={classes.timeWrapper}>
      <div key={time} className={classes.time}>
        {time}
      </div>
      <div key={names[index]} className={classes.label}>
        {names[index]}
      </div>
    </div>
  );
};

const Timer = ({ deadline }) => {
  return (
    <div className={classes.timerWrapper}>
      <CountdownCircleTimer
        isPlaying
        duration={moment.duration(moment(deadline).diff(moment())).asSeconds()}
        colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
      >
        {renderTime}
      </CountdownCircleTimer>
    </div>
  );
};

export default Timer;
