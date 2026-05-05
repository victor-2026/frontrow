import { http, HttpResponse } from 'msw';

import { endpoints } from '../../api/endpoints';
import { mockState } from '../state';

export const eventHandlers = [
  http.get(endpoints.events.list(), ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase();
    const genre = url.searchParams.get('genre')?.toLowerCase();
    let results = [...mockState.events];
    if (q) {
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.artist.toLowerCase().includes(q) ||
          e.venue.city.toLowerCase().includes(q),
      );
    }
    if (genre) {
      results = results.filter((e) => e.genre.toLowerCase() === genre);
    }
    return HttpResponse.json(results);
  }),

  http.get(`${endpoints.events.list()}/:id`, ({ params }) => {
    const id = params['id'] as string;
    const event = mockState.events.find((e) => e.id === id);
    if (!event) {
      return HttpResponse.json(
        { code: 'not_found', message: `Event ${id} not found.` },
        { status: 404 },
      );
    }
    return HttpResponse.json(event);
  }),
];
