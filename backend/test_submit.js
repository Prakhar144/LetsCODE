import axios from 'axios';

async function testSubmit() {
  try {
    const res = await axios.post('http://localhost:8000/code/submit', {
      problem_id: '6a76e27c934297b471963251',
      code: 'print("hello")',
      language: 'python',
      run_only: true
    }, {
      // Mock auth headers or bypass if not strictly enforced, wait, authenticate middleware is used!
      // Let's create a token.
    });
    console.log(res.data);
  } catch(e) {
    console.error(e.message);
  }
}
testSubmit();
