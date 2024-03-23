//@ts-nocheck
//ignoring typescript for this file as we dotn knoiw data coming from gpt



// Import the openAi module
import OpenAI from "openai";

import JobApplication from "../../persistance/entities/JobApplication";

// Insatantiate our an openAi instance
const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY });


export async function generateRating(jobApplicationId){
    //findbyid is a methoid in mongose that fetched the data with the id
    // findbyId(jobapplaction) only gives the id, we want the entire collection  so we use populate to get all the collection of job
    const jobApplication =  await JobApplication.findById(jobApplicationId).populate("job");

    //we have to formate to sof5ware engineer , dfescrtiption : dfsadf
    //using join we combine the array of answers to a single one sepered by a .
    const content = `Role:${jobApplication?.job.title} User Description: ${jobApplication?.answers.join(". ")}`
    const completion = await client.chat.completions.create(
        {
            messages:[{role:'user',content}], 
            model : "ft:gpt-3.5-turbo-0613:stemlink:fullstacktutorial:8dWQ9vUC"

        }
    );

    // Converting the output string to a json , OPEN AI gives us a json looking string, we convert it to actual json to access attribute 
    const response  = JSON.parse(completion.choices[0].message.content);

    if(!response.rate){
        // if no response  we retun nothing
        return;
    }


    // from jobapplication entity find the id of jobid and updatw the rating 
    await JobApplication.findOneAndUpdate({_id: jobApplicationId } ,{ rating: response.rate});

    


    }