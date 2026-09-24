export const formDemo = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><title>Q1 controlled demonstration</title></head>
<body>
  <h1>Form demonstration</h1>
  <label>Search <input type="text" aria-label="Search"></label><button>Search</button>
  <form id="profile">
    <label for="name">Name</label><input id="name" type="text" required>
    <button type="submit">Submit form</button>
  </form>
  <p class="success-message" role="status" hidden></p>
  <script>
    document.querySelector('#profile').addEventListener('submit', (event) => {
      event.preventDefault();
      setTimeout(() => {
        const toast = document.querySelector('.success-message');
        toast.textContent = 'Form Submitted'; toast.hidden = false;
      }, 150);
    });
  </script>
</body></html>`;
