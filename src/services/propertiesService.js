const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/properties`;

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const PropertiesService = {
  async getProperties(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error('Failed to fetch property');

    return res.json();
  },

  async getAllProperties() {
    const res = await fetch(BASE_URL, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error('Failed to fetch properties');

    return res.json();
  },

  async createProperties(formData) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error('Failed to create property');

    return res.json();
  },

  async updateProperties(id, formData) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error('Failed to update property');

    return res.json();
  },

  async deleteProperties(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error('Failed to delete property');

    return res.json();
  },
};
