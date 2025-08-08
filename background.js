// Service worker for Safari Manifest V3 compatibility
console.log('Go Link Redirector service worker loaded');

// Use browser API for cross-browser compatibility (Safari, Firefox, etc.)
const api = typeof browser !== 'undefined' ? browser : chrome;

// Service worker lifecycle events
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
});

// Handle go link redirects
api.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    if (details.frameId === 0) {
      const url = new URL(details.url);
      console.log('Checking URL:', url.toString());
      
      // Handle direct go links (http://go/keyword, https://go/keyword)
      if ((url.hostname === 'go' || url.hostname === 'go.') && url.pathname !== '/') {
        const keyword = url.pathname.substring(1);
        const redirectUrl = `https://trot.to/${keyword}`;
        console.log('Redirecting to:', redirectUrl);
        
        api.tabs.update(details.tabId, {
          url: redirectUrl
        });
        return;
      }
      
      // Handle search engine queries that might contain "go/keyword"
      if (url.hostname.includes('google.com') || url.hostname.includes('duckduckgo.com')) {
        const searchParams = url.searchParams;
        const query = searchParams.get('q') || searchParams.get('query') || '';
        const goMatch = query.match(/^go\/(.+)$/);
        
        if (goMatch) {
          const keyword = goMatch[1];
          const redirectUrl = `https://trot.to/${keyword}`;
          console.log('Intercepting search for go link, redirecting to:', redirectUrl);
          
          api.tabs.update(details.tabId, {
            url: redirectUrl
          });
        }
      }
    }
  },
  {
    url: [
      { hostEquals: 'go' },
      { hostEquals: 'go.' },
      { hostContains: 'google.com' },
      { hostContains: 'duckduckgo.com' }
    ]
  }
);