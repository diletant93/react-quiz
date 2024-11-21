function Options({question, options, dispatch, answer}){
    const hasAnswered = answer !== null
    function isCorrectAnswer(index){
        return index === question.correctOption
    }
    return(
        <div className="options">
            {options.map((option,index)=> 
            <Option key={option}>
                <button className= {`btn btn-option ${index === answer ? "answer" : ''} ${
                    hasAnswered ? isCorrectAnswer(index) ? 'correct': 'wrong':'' 
                    }`}
                disabled={hasAnswered}
                 onClick={()=>{dispatch({type:'newAnswer', payload:index})}}>
                    {option}
                </button>
            </Option>
            )}
         </div>
    )
}
function Option({children}){
    return (
        <div>
            {children}
        </div>
    )
}
export default Options