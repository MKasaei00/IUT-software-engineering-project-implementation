import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import moment from "moment";
import { Check } from "@material-ui/icons";

import classes from "./style.module.css";

const renderTime = (done, { remainingTime }) => {
  const names = ["Seconds", "Minutes", "Hours", "Days", "Months", "Years"];
  const times = [60, 60, 24, 30, 12, 1];
  let index = 0;
  let time = remainingTime;
  for (; index < names.length; index++) {
    const next = Math.floor(time / times[index]);
    if (next > 0) time = next;
    else break;
  }
  return (
    <div className={classes.timeWrapper}>
      {done ? (
        <div key={time}>
          <Check fontSize="inherit" />
        </div>
      ) : remainingTime > 0 ? (
        <>
          <div key={time}>{time}</div>
          <div key={names[index]} className={classes.label}>
            {names[index]}
          </div>
        </>
      ) : (
        <div key={time} className={classes.expire}>
          Expired
        </div>
      )}
    </div>
  );
};

const Timer = ({ deadline, done }) => {
  const seconds = moment.duration(moment(deadline).diff(moment())).asSeconds();

  return (
    <div className={classes.timerWrapper}>
      <CountdownCircleTimer
        key={deadline}
        isPlaying={!done}
        duration={isNaN(seconds) ? 0 : Math.max(seconds, 0)}
        colors={[["#66A103", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
      >
        {renderTime.bind(this, done)}
      </CountdownCircleTimer>
    </div>
  );
};

export default Timer;
