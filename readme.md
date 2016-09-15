# Site-Mapper

A simple utility for programmatically generating navigations based on a sitemap tree

```javascript
'use strict';

import SiteMapper from 'site-mapper';

const sitemap = new SiteMapper([
	{ label: 'Section A', url: '/section-a' },
    {
        label: 'Section B', url: '/section-b',
        children: [
        	{ label: 'Page A', url: '/section-b/page-a' },
        ],
    },
]);

```

## API

### getPath(str)

Returns an array of url strings pathing from root to the provided url.

```javascript
sitemap.getPath('/section-a');
// ['/section-a']

sitemap.getPath('/section-b/page-a');
// ['/section-b', '/section-b/page-a']
```

### getObj(str)

Returns the full object (including children) of provided url from the site tree.

```javascript
sitemap.getObj('/section-a');
// { label: 'Section A', url: '/section-a' }

sitemap.getObj('/section-b');
// {
//     label: 'Section B', url: '/section-b',
//     children: [
//         { label: 'Page A', url: '/section-b/page-a' },
//     ],
// },
```

### getLink(str, _[bool]_)

Returns link object (without children) of provided url. Can also optionally be passed true to mark the link as being active.

```javascript
sitemap.getLink('/section-a');
// { label: 'Section A', url: '/section-a' }

sitemap.getObj('/section-b');
// { label: 'Section B', url: '/section-b' }

sitemap.getObj('/section-b/page-a');
// { label: 'Page A', url: '/section-b/page-a' }
```

### getSubnav(str, _[str]_)

Returns an array of first-child links to provided url. Can also optionally be passed the url of current active url.

```javascript
sitemap.getSubnav('/section-b', '/section-b/page-a');
// [
//     { label: 'Page A', url: '/section-b/page-a', active: true },
//     { label: 'Page B', url: '/section-b/page-b', active: false },
// ],
```

### getBreadcrumbNav(str, _[bool]_)

Returns an path array of link objects to provided url. By default marks last link in array as active, can be overridden with optional second parameter.

```javascript
sitemap.getSubnav('/section-a');
// [
//   { label: 'Section A', url: '/section-a', active: true },
// ]

sitemap.getSubnav('/section-b/page-a');
// [
//     { label: 'Section B', url: '/section-b', active: false },
//     { label: 'Page A', url: '/section-b/page-a', active: true },
// ],
```