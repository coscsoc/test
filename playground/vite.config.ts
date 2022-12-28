import { defineConfig } from "vite";

interface Options{

}

export default function (options:Options={}){
  console.log(options);
  
  return defineConfig({
    plugins:[]
  })
}