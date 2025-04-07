# images.defeo.io

**[images.defeo.io](https://images.defeo.io/)** is a clean, modern royalty-free image search tool built to help creators quickly find stunning, high-quality photos with zero friction. It currently supports **Pexels** as the image source, with plans to expand to additional APIs.

---

## Features

- Instant search for royalty-free images
- Powered by the [Pexels API](https://www.pexels.com/api/)
- Minimal UI for a distraction-free experience
- Responsive image previews
- Free to use

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API:** [Pexels API](https://www.pexels.com/api/)

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/mdefeo/images.defeo.io.git
cd images.defeo.io
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create a .env.local file

```bash
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key_here
```

### 4. Run the development server

```bash
pnpm dev
```

### 5. Open the site

Go to [http://localhost:3000](http://localhost:3000) to view it in the browser.

## To Do

- Add support for Pixabay API
- Add support for Unsplash API
- Add source filters (e.g. show only Pexels or Unsplash results)
- Save/bookmark favorite images
- Dark mode toggle
- Support infinite scroll

## License

[Apache](./LICENSE)

## Author

Marcello De Feo
[defeo.io](https://defeo.io/)
