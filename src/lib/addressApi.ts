export interface Address {
  id: string; // MongoDB _id
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  type: 'HOME' | 'WORK';
}

const API_URL = "https://dhanalaxmi-backend.onrender.com/api/addresses";

// బ్యాకెండ్ నుండి యూజర్ అడ్రస్‌లను ఫెచ్ చేస్తుంది
export const fetchUserAddresses = async (): Promise<Address[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch addresses.");
  
  const data = await response.json();
  return data.map((addr: any) => ({ ...addr, id: addr._id }));
};

// కొత్త అడ్రస్‌ను బ్యాకెండ్‌లో సేవ్ చేస్తుంది
export const saveUserAddress = async (address: Omit<Address, 'id'>): Promise<Address> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(address),
  });
  
  if (!response.ok) throw new Error("Failed to save address.");

  const savedAddr = await response.json();
  return { ...savedAddr, id: savedAddr._id };
};

// ===================================================================
// కొత్త ఫంక్షన్: ఇప్పటికే ఉన్న అడ్రస్‌ను అప్‌డేట్ చేయడానికి
// ===================================================================
export const updateUserAddress = async (addressId: string, addressData: Omit<Address, 'id'>): Promise<Address> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${API_URL}/${addressId}`, {
    method: 'PUT', // PUT మెథడ్ వాడండి
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });

  if (!response.ok) throw new Error("Failed to update address.");

  const updatedAddr = await response.json();
  return { ...updatedAddr, id: updatedAddr._id };
};