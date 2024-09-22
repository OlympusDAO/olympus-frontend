import axios from "axios";

export const fetchFunctionInterface = async (selector: string): Promise<any[]> => {
  // from api.openchain.xyz
  const response = await axios.get("https://api.openchain.xyz/signature-database/v1/lookup", {
    params: {
      function: selector,
    },
  });
  const results = response.data.result.function[selector].map((f: { name: string }) => f.name);

  if (results.length > 0) {
    return results;
  } else {
    // from 4byte.directory
    const response = await axios.get("https://www.4byte.directory/api/v1/signatures/", {
      params: {
        hex_signature: selector,
      },
    });
    const results = response.data.results.map((f: { text_signature: string }) => f.text_signature);

    return results;
  }
};
