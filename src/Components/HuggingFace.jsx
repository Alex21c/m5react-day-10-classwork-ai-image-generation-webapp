import { useRef, useState } from "react";
import { HfInference } from "@huggingface/inference";
import { useEffect } from "react";
import SuccessAndErrorMsg from "./SuccessAndErrorMsg";
import userEvent from "@testing-library/user-event";


const HF_TOKEN1 = process.env.REACT_APP_HF_TOKEN1;
// const HF_TOKEN2 = process.env.REACT_APP_HF_TOKEN2;

const inference = new HfInference(HF_TOKEN1);


export default function HuggingFace(){  
  let [stateTextQuery, updateStateTextQuery] = useState('');
  let [stateIsSubmitBtnDisabled, upateStateIsSubmitBtnDisabled] = useState(false);
  let [stateLoaderImageHidden, updateStateLoaderImageHidden] = useState(true);
  let [stateResultImage, updateStateResultImage] = useState('');
  let [stateLabelSubmitButton, updateStateLabelSubmitButton] = useState('Generate Image');
  let refInput = useRef(null);

  // useEffect(()=>{//console.log(stateIsSubmitBtnDisabled)}, [stateIsSubmitBtnDisabled]);

  let [stateSuccessAndErrorMsg, updateStateSuccessAndErrorMsg] = useState({
      style: {
        Success: "text-green-300 text-[1.5rem]",
        Error: "text-red-300 text-[1.5rem]"
      },
      msgType: "Success",
      msg: "",
      displayNone: 'displayNone'        
    
  });

  function showLoaderImage(){
    updateStateLoaderImageHidden(false);
  }
  function hideLoaderImage(){
    updateStateLoaderImageHidden(true);
  }

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
    //console.log(stateTextQuery);
    if(stateTextQuery === ''){
      showError('Yes, we need your search query first, which image you want to generate, pile of gold or cash? let me know by typing in the search box above!');
      return;
    }

    // i need to fetch the text value?
    hideError();
    // make api call
    makeAPICall();

  }
  async function makeAPICall(){
    // showLoaderImage();
    // return ;
    
    try {
      updateStateResultImage(null);
      updateStateLabelSubmitButton('AI is Generating Your Image');
      // disable btn
        upateStateIsSubmitBtnDisabled(true);
        showLoaderImage();
      //console.log('making api call');   


      let  result = await inference.textToImage({
         model: 'stabilityai/stable-diffusion-2',
         inputs: stateTextQuery,
       });
       //console.log('here is the result', result);
       // creating url for image    
       updateStateResultImage(URL.createObjectURL(result));

       upateStateIsSubmitBtnDisabled(false);
       hideLoaderImage();

       // now i want to clear the text conent of input field
      refInput.current.value = "";
      updateStateLabelSubmitButton('Generate Image');
      
    } catch (error) {
      showError('Something went wrong, please try again later, here is the error: ' + error.message);
    }
   
   
   } 


   

  return (
     <div id='wrapperImageGenerationWebApp' className="border-2 border-slate-200 p-[2rem] w-[50rem] mt-[1rem] m-auto rounded-md flex flex-col gap-[1rem] text-[1.2rem] text-slate-200 ">
      <h1 className="font-semibold text-[3rem] text-slate-50 flex gap-[1rem] justify-center">
        <i className="fa-solid fa-microchip-ai"></i>
        <span className="smallCaps">Image Generation WebApp</span>
      </h1>
      <textarea
         ref={refInput}
         onChange={(event)=>{
          updateStateTextQuery(event.target.value);
          }
        } 
      rows="4"
      className="text-slate-900 transition focus:outline focus:outline-2 focus:outline-yellow-500 p-[1rem]    rounded-md"   placeholder="Describe as text and AI will generate an Image for You. e.g. macaw holding gold in rain of dollar OR  macaw flying over tree of money OR billionaire blue mouse  driving his yellow car with sunglasses..."/>
      <SuccessAndErrorMsg  stateSuccessAndErrorMsg={stateSuccessAndErrorMsg}/>

      <div className={`${stateLoaderImageHidden ? "displayNone" : "" } w-[25rem] h-[20rem] self-center `}>
        <img src={require('../Assests/Images/loader.png')} className="object-none  rounded-xl shadow-yellow-300 shadow-2xl  w-[100%] h-[100%]"/>
      </div>

      {
        stateResultImage && 

        <div>
          <img src={stateResultImage} />
        </div>
      }

      <button className={`submitBtn select-none wrapperGeneratePassword mt-[1rem] flex gap-[1rem] items-center justify-center outline outline-2 outline-amber-50  hover:bg-yellow-500 transition cursor-pointer p-[1rem] rounded-md hover:text-slate-50 text-slate-900  ${stateIsSubmitBtnDisabled === true? "disabled"  : "bg-yellow-300" }  `}  onClick={handleRequestGenerateImage}>
        <div className="flex gap-[.5rem] text-[1.5rem]">
          <i className="fa-sharp fa-solid fa-flask"></i>
          <i className="fa-solid fa-image"></i>
        </div>
        <span className="font-semibold">{stateLabelSubmitButton}</span>
      </button>  
        
     </div>
  );
  
}