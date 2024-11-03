import React, { useState, useEffect } from 'react';
import Text from "../TextGeneration/Main";
import Audio from "../AudioToText/Main";
import LLamatext from "../LlamaTextGeneration/Main";
import StableDiffusion from "../StableDiffusionImage/Main";
import BlackForest from "../BlackForestImage/Main";


const Main = ({ component }) => {

  const [comp, setcomp] = useState("");


  useEffect(() => {
    setcomp(component);
  }, [component])


  const render = () => {
    switch (comp) {
      case "text":
        return <Text />

      case "audio":
        return <Audio />

      case "llama text":
        return <LLamatext />

      case "stable diffusion":
        return <StableDiffusion />

      case "black forest":
        return <BlackForest />

      default:
        return <Text />
    }
  }


  return (

    <>
      {render()}
    </>

  )

}

export default Main