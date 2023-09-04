import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  // POST request to create a new resource
  let postRes = http.post('https://jsonplaceholder.typicode.com/posts', JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(postRes, {
    'POST: Status 201': (r) => r.status === 201,
  });

  sleep(1);

  // Assume new resource ID is 101 (This will vary based on your API)
  let resourceId = 101;

  // PUT request to update the resource
  let putRes = http.put(`https://jsonplaceholder.typicode.com/posts/${resourceId}`, JSON.stringify({
    id: resourceId,
    title: 'updated title',
    body: 'updated body',
    userId: 1,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(putRes, {
    'PUT: Status 200': (r) => r.status === 200,
  });

  sleep(1);

  // DELETE request to delete the resource
  let deleteRes = http.del(`https://jsonplaceholder.typicode.com/posts/${resourceId}`);

  check(deleteRes, {
    'DELETE: Status 200': (r) => r.status === 200,
  });

  sleep(1);
}
