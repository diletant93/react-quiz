import { type } from "@testing-library/user-event/dist/type";
import { useEffect, useState } from "react";

const SECS_PER_QUESTION = 30
function Timer({dispatch, numQuestions}) {
    const [secondsRemaining, setSecondsRemaining] = useState(numQuestions * SECS_PER_QUESTION)
    const minutes = Math.floor(secondsRemaining / 60)
    const seconds = secondsRemaining  % 60
    function handleSecondsDecrease(currentTime){
        if(currentTime > 0)
            return currentTime - 1
        else{
            return 0
        }
    }
    useEffect(function(){
       const id = setInterval(()=>{
        setSecondsRemaining(currentTime => handleSecondsDecrease(currentTime))
        },1000)
        return () => clearInterval(id)
    },[])

    useEffect(() => {
        if (secondsRemaining === 0) {
          dispatch({ type: 'finish' });
        }
      }, [secondsRemaining, dispatch]);
      function formatTime(value){
        return value < 10? `0${value}`: value
      }
  return (
    <div className="timer">
        {formatTime(minutes)}:{formatTime(seconds)}
        </div>
  );
}

export default  Timer;