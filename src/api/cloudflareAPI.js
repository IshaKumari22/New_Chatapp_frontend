// export async function callCloudflareAI(prompt) {
//     const accountId=import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
//     const apiToken=import.meta.env.VITE_CLOUDFLARE_API_TOKEN;
//     const model=import.meta.env.VITE_CLOUDFLARE_MODEL;

//     const res=await fetch(
//         `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
//         {
//             method:"POST",
//             headers:{
//                 "Content-Type":"application/json",
//                 Authorization:`Bearer ${apiToken}`
            
//             },
//             body:JSON.stringify({prompt}),
//         }
//     );
//     const data=await res.json();
//     return data.result?.response || "No response from LLAMA";
    
// }



// src/api/cloudflareAPI.js
export async function callCloudflareAI(prompt) {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/generate/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error("Backend Error");
    const data = await res.json();
    return data.response || "No response from backend.";
  } catch (err) {
    console.error("AI Error:", err);
    throw err;
  }
}
