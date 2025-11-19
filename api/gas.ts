export async function callGAS(endpoint: string, data: any) {
  // @ts-ignore
  // Vercel Serverless Functions use process.env, not import.meta.env
  const url = process.env.VITE_GAS_URL + "?action=" + endpoint;

  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(data)
  });

  return response.json();
}
