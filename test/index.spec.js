'use strict';

import { expect } from 'chai';
import SiteMapper from '../src/index.js';

const map = [
    { label: 'Section A', url: '/section-a' },
    {
        label: 'Section B', url: '/section-b',
        children: [
            { label: 'Page A', url: '/section-b/page-a' },
            { label: 'Page B', url: '/section-b/page-b' },
            { label: 'Page C', url: '/section-b/page-c' },
        ],
    },
    {
        label: 'Section C', url: '/section-c',
        children: [
            { label: 'Page D', url: '/page-d' },
            { label: 'Page E', url: '/page-e' },
            { label: 'Page F', url: '/page-f' },
        ],
    },
];

const sitemap = new SiteMapper(map);

describe('constructor', () => {
    it('should store the map', () => {
        expect(sitemap.map).to.deep.equal(map);
    });

    it('should make the map immutable', () => {
        const addItem = () => {
            sitemap.map.push({ url: '/test', label: 'Test' });
        };

        expect(addItem).to.throw;
    });
});

describe('getPath', () => {
    it('should return array to provided url', () => {
        expect(sitemap.getPath('/section-a')).to.deep.equal(['/section-a']);
        expect(sitemap.getPath('/section-b/page-a')).to.deep.equal(['/section-b', '/section-b/page-a']);
        expect(sitemap.getPath('/page-d')).to.deep.equal(['/section-c', '/page-d']);
    });

    it('should return undefined on no match', () => {
        expect(sitemap.getPath('/foobar')).to.be.undefined;
    });
});

describe('getObj', () => {
    it('should return the full page object', () => {
        expect(sitemap.getObj('/section-a')).to.deep.equal({ label: 'Section A', url: '/section-a' });
        expect(sitemap.getObj('/section-b')).to.deep.equal({
            label: 'Section B', url: '/section-b',
            children: [
                { label: 'Page A', url: '/section-b/page-a' },
                { label: 'Page B', url: '/section-b/page-b' },
                { label: 'Page C', url: '/section-b/page-c' },
            ],
        });
        expect(sitemap.getObj('/page-d')).to.deep.equal({ label: 'Page D', url: '/page-d' });
    });

    it('should return undefined on no match', () => {
        expect(sitemap.getObj('/foobar')).to.be.undefined;
    });
});

describe('getLink', () => {
    it('should return the page object without children', () => {
        expect(sitemap.getLink('/section-a')).to.deep.equal({ label: 'Section A', url: '/section-a', active: false });
        expect(sitemap.getLink('/section-b')).to.deep.equal({ label: 'Section B', url: '/section-b', active: false });
        expect(sitemap.getLink('/page-d')).to.deep.equal({ label: 'Page D', url: '/page-d', active: false });
    });

    it('should mark link as active', () => {
        expect(sitemap.getLink('/section-a', true)).to.deep.equal({ label: 'Section A', url: '/section-a', active: true });
    });

    it('should return undefined on no match', () => {
        expect(sitemap.getLink('/foobar')).to.be.undefined;
    });
});

describe('getSubnav', () => {
    it('should return undefined if url has no children', () => {
        expect(sitemap.getSubnav('/section-a')).to.be.undefined;
    });

    it('should return an array of child links', () => {
        expect(sitemap.getSubnav('/section-b')).to.deep.equal([
            { label: 'Page A', url: '/section-b/page-a', active: false },
            { label: 'Page B', url: '/section-b/page-b', active: false },
            { label: 'Page C', url: '/section-b/page-c', active: false },
        ]);
    });

    it('should mark the active link if provided', () => {
        expect(sitemap.getSubnav('/section-c', '/page-e')).to.deep.equal([
            { label: 'Page D', url: '/page-d', active: false },
            { label: 'Page E', url: '/page-e', active: true },
            { label: 'Page F', url: '/page-f', active: false },
        ]);
    });

    it('should return undefined on no match', () => {
        expect(sitemap.getSubnav('/foobar')).to.be.undefined;
    });
});

describe('getBreadcrumb', () => {
    it('should return a path of link objects', () => {
        expect(sitemap.getBreadcrumbNav('/section-a', false)).to.deep.equal([
            { label: 'Section A', url: '/section-a', active: false },
        ]);

        expect(sitemap.getBreadcrumbNav('/section-b/page-a', false)).to.deep.equal([
            { label: 'Section B', url: '/section-b', active: false },
            { label: 'Page A', url: '/section-b/page-a', active: false },
        ]);

        expect(sitemap.getBreadcrumbNav('/page-d', false)).to.deep.equal([
            { label: 'Section C', url: '/section-c', active: false },
            { label: 'Page D', url: '/page-d', active: false },
        ]);
    });

    it('should mark the last link as active by default', () => {
        expect(sitemap.getBreadcrumbNav('/section-a')).to.deep.equal([
            { label: 'Section A', url: '/section-a', active: true },
        ]);

        expect(sitemap.getBreadcrumbNav('/section-b/page-a')).to.deep.equal([
            { label: 'Section B', url: '/section-b', active: false },
            { label: 'Page A', url: '/section-b/page-a', active: true },
        ]);

        expect(sitemap.getBreadcrumbNav('/page-d')).to.deep.equal([
            { label: 'Section C', url: '/section-c', active: false },
            { label: 'Page D', url: '/page-d', active: true },
        ]);
    });

    it('should return undefined on no match', () => {
        expect(sitemap.getBreadcrumbNav('/foobar')).to.be.undefined;
    });
});
