import { act, useEffect, useReducer } from "react";
import DateCounter from "./DateCounter";
import Header from "./Header";
import Main from "./Main";
import Loader from './Loader'
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Quesiton";
import NextButton from "./NextButton";
import { computeHeadingLevel, queries } from "@testing-library/react";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
const initialState = {
  questions:[],

  //loading, error, ready, active , finished
  status:'loading',

  currentQuestionIndex: 0,
  answer: null,
  points: 0,
  highScore:0,
}

function reducer(state,action){ 
  switch(action.type){
    case 'dataReceived':
      return {...state,
         questions: action.payload,
         status:'ready'
        }
    case 'dataFailed':
      return{
        ...state,
        status:'error'
      }
    case 'start':
      return{
        ...state,
        status:'active'
      }
    case 'newAnswer':
      const question = state.questions.at(state.index) 
      return{
        ...state,
        answer:action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points
      }
    case 'nextQuestion':
      return{
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        answer:null
      }
    case 'finish':
      return{
        ...state,
        status:'finished',
        highScore: state.points  > state.highScore ? state.points : state.highScore
      }
    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready'
      }
    default:
      throw new Error('Action unkown')
  }
}
export default function App(){
  const [{questions,status, currentQuestionIndex, answer, points, highScore }, dispatch] = useReducer(reducer, initialState)

  const numQuestions= questions.length
  const maxPoints = questions.reduce((acc, question) =>acc + question.points, 0)

  console.log('app is rendering')

  useEffect(function(){
    const controller = new AbortController()
    async function fetchQuestions(){
      try {
        const response = await fetch('http://localhost:8000/questions', {signal:controller.signal})
        if(!response.ok) throw new Error('fetching went bad')
        const data = await response.json()

        dispatch({type:'dataReceived',payload: data })
        return data
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch was aborted:', error.message);
        } else {
          console.error('Error during fetch:', error.message);
          dispatch({ type: 'dataFailed' });
        }
      }
      
    }
    fetchQuestions()
    return function(){
      controller.abort()
    }
  },[])

  return(
    
    <div className="app">
      <Header/>
      <Main>
         {
          status === 'loading' && <Loader/>
         }
         {
          status === 'error' && <Error/>
         }
         {
          status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>
         }
         {
          status === 'active' &&
          <>
            <Progress index={currentQuestionIndex} numQuestions={numQuestions} points={points} maxPoints={maxPoints} answer={answer}/>
             <Question question={questions[currentQuestionIndex]} dispatch={dispatch} answer={answer}/>
             <Footer>
             <Timer dispatch={dispatch} numQuestions={numQuestions} />
             <NextButton dispatch={dispatch} answer={answer} index={currentQuestionIndex} numQuestions={numQuestions}/>
             </Footer>
          </>

         }
         {

         }
         {
          status === 'finished' &&
          <FinishScreen points={points} maxPoints={maxPoints} highScore={highScore} dispatch={dispatch}/>
         }
      </Main>
    </div>
  )
}