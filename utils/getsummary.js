import { pipeline } from "@xenova/transformers";
async function getSummary(text) {
  const pipe = await pipeline("summarization");
  const result=await pipe(text,{max_length: 100});
  console.log(result);
  return result[0].summary_text;
}
export default getSummary
