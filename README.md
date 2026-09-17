# Builstry.com

## Development
npm install
npm run dev

## Routes
- /
- /insights
- /about
- /industry-solutions
- /business-product-strategy
- /innovation-community

### Deployment note
This project uses React Router with `BrowserRouter`. If the hosting platform returns 404 when directly opening `/insights`, configure SPA fallback/rewrite rules so unknown routes serve `index.html`. Client-side navigation from the home page will work once the app loads.
