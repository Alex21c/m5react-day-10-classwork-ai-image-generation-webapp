import { useState } from "react";
import { HfInference } from "@huggingface/inference";
import { useEffect } from "react";
import SuccessAndErrorMsg from "./SuccessAndErrorMsg";

const token1 = process.env.REACT_APP_HF_TOKEN1;
const token2 = process.env.REACT_APP_HF_TOKEN2;

const inference = new HfInference(HF_TOKEN2);


export default function HuggingFace(){
  let [image, updateStateImage] = useState('');
  let [stateTextQuery, updateStateTextQuery] = useState('');
  let [stateIsSubmitBtnDisabled, upateStateIsSubmitBtnDisabled] = useState(false);
  let [stateSuccessAndErrorMsg, updateStateSuccessAndErrorMsg] = useState({
      style: {
        Success: "text-green-300 text-[1.5rem]",
        Error: "text-red-300 text-[1.5rem]"
      },
      msgType: "Success",
      msg: "",
      displayNone: 'displayNone'        
    
  });
  function showError(error){
    updateStateSuccessAndErrorMsg(previousState=>{
      return {
        ...previousState,
        msgType: 'Error',
        msg : error, 
        displayNone: ''
      }
    });
  }
  function hideError(){
    updateStateSuccessAndErrorMsg(previousState=>{
      return {
        ...previousState,
        displayNone: 'displayNone'
      }
    });
  }

  function handleRequestGenerateImage(event){
    // Safeguard
      if(stateIsSubmitBtnDisabled){
        return;
      }

    event.preventDefault();
    console.log(stateTextQuery);
    if(stateTextQuery === ''){
      showError('Yes, we need your search query first, which image you want to generate, pile of gold or cash? let me know by typing in the search box above!');
      return;
    }

    // i need to fetch the text value?
    hideError();
    // make api call

  }
  async function makeAPICall(){
    // disable btn
    upateStateIsSubmitBtnDisabled(true);
    console.log('making api calll');
    return ;
    let  result = await inference.textToImage({
       model: 'stabilityai/stable-diffusion-2',
       inputs: 'award winning high resolution photo of a giant tortoise/((ladybird)) hybrid, [trending on artstation]',
     });
     console.log('here is the result', result);
     // creating url for image    
     updateStateImage(URL.createObjectURL(result));
   
   
   } 

  useEffect(()=>{
    makeAPICall();
  },[])
   

  return (
     <div className="border-2 border-slate-200 p-[2rem] w-[50rem] mt-[1rem] m-auto rounded-md flex flex-col gap-[1rem] text-[1.2rem] text-slate-200">
      <h1 className="font-semibold text-[3rem] text-slate-50 flex gap-[1rem] justify-center">
        <i className="fa-solid fa-microchip-ai"></i>
        <span>Image Generation WebApp</span>
      </h1>
      <input
         onChange={(event)=>{
          updateStateTextQuery(event.target.value);
          }
        } 
      type="search" className="text-slate-900 transition focus:outline focus:outline-2 focus:outline-yellow-500 p-[1rem]    rounded-md"   placeholder="Enter any text and AI will generate an Image for You. e.g. investing in gold & silver"/>
      <SuccessAndErrorMsg  stateSuccessAndErrorMsg={stateSuccessAndErrorMsg}/>

      <button className={`select-none wrapperGeneratePassword mt-[1rem] flex gap-[1rem] items-center justify-center outline outline-2 outline-amber-50  hover:bg-yellow-500 transition cursor-pointer p-[1rem] rounded-md hover:text-slate-50 text-slate-900  ${stateIsSubmitBtnDisabled? "disabled"  : "bg-yellow-399" }  `}  onClick={handleRequestGenerateImage}>
        <div className="flex gap-[.5rem] text-[1.5rem]">
          <i className="fa-sharp fa-solid fa-flask"></i>
          <i className="fa-solid fa-image"></i>
        </div>
        <span className="font-semibold">Generate Image</span>
      </button>  
        
     </div>
  );
  
}