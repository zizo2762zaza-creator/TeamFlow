export async function callGAS(endpoint: string, data: any) {
  const url = import.meta.env.VITE_GAS_URL + "?action=" + endpoint;

  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(data)
  });

  return response.json();
}
