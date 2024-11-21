import Button from "./Button";
function FinishScreen({points, maxPoints, highScore ,dispatch}) {
    const percentage = (points / maxPoints) * 100

    function handleReset(){
        dispatch({type:'restart'})
    }

  return (
    <>
    <p className="result">
        You scored <strong>{points}</strong> out of 
        {maxPoints} ({Math.ceil(percentage)} %)
    </p>
    <p className="highscore">
         (Highscore: {highScore} points)
    </p>
    <Button handler={handleReset}>
        Reset quiz
    </Button>
    </>
  );
}

export default  FinishScreen;

