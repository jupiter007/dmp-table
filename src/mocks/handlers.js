import { http, HttpResponse } from 'msw';
import data from '../db/data.json';

export const saveData = http.post('/dmps/:id', async ({ request, params }) => {
  const { id } = params;
  const updatedId = `https://doi.org/10.48321/${id}`;

  const originalItem = data.find((item) => {
    return item.dmp.dmp_id.identifier === updatedId;
  });
  if (!originalItem) {
    return HttpResponse.status(404);
  }

  return HttpResponse.json(data);
});
export const handlers = [saveData];
