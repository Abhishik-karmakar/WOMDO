import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const anthropic = new Anthropic({
  apiKey:
    process.env["ANTHROPIC_API_KEY"], // This is the default and can be omitted
});

export async function getRating(content) {
    try {
      const message = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [{ role: "user", content: content }],
        model: "claude-3-opus-20240229",
      });
  return message.content;
      // console.log(message.content);
    } catch (error) {
      console.error("Error getting rating:-----", error);
    }
  }
  

// let content = "can you tell on the scale of 10 how the person in this text is rating product named Growth School:\n `Firstly, how you can use LinkedIn. Not just to get a job but to generate leads for your business. Also making your personal brand. Second is AI and ChatGPT. You can do your work 10x faster by mastering it. And for that I will personally recommend you three hour paid workshop of Growth School. On mastering LinkedIn and ChatGPT. This workshop is paid but it is absolutely free for the first 1000 people. Registration link is in the description. I have myself attended this workshop and I will give it 5 out of 5`. I just want rating on the scale of 10 from you. The result should be only this -> `Rating: {Rating}`"

// console.log('getContext("odoo") =====>>', getContext("Odoo", 12));

// let content = getContext("Odoo", 12);
// console.log('=====content========', content);
// let contentForAI = createContent("Odoo", content);
// console.log('contentForAI---------', contentForAI);

// let contentForAI = `context can you tell on the scale of 10 how the person in this text is rating product named Z9,Iqoo: 
// House Vishal Finally Missed Us Remember Us
// she used to come to me every day
// We have the link of Zoom every day.
// Someone else is left lying there in the chat
// Doesn't click, miss it a lot, just guys
// Today is a very special episode it is the
// Last Episode in Ike Mummy Night Season Two This
// Whole season you have tagged us in memes and you
// The Guy Who Did That Stand Chance to Win a
// Brand new aak smartphone today is the
// Episode and We Will Declare the Results of
// Aak Mam Nai Season 2 and Today's Episode is
// Brought to you by the brand new AK Z9 one it
// Is the fastest phone in its segment with
// 6000 mahapwd.com
// sir
// C is the website`
// const finalRating = await getRating(contentForAI);

// console.log('finalRating---------', finalRating);


