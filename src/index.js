'use strict';

export default class SiteMapper {
    constructor(map) {
        this.map = Object.freeze(map);
    }

    /**
     * Get array of urls to specified path
     *
     * @param q {string} Destination URL
     * @returns {array[string]}
     */
    getPath(q) {
        function _getPath(array, id) {
            if (!array) { return null; }

            for (let i = 0; i < array.length; i++) {
                const { url, children } = array[i];
                if (url === id) return [id];

                const deep = _getPath(children, id);
                if (Boolean(deep)) {
                    deep.unshift(url);
                    return deep;
                }
            }
        }

        return _getPath(this.map, q);
    }

    /**
     * Returns full page object for specified path
     *
     * @param q {string} Destination URL
     * @returns {object}
     */
    getObj(q) {
        const path = this.getPath(q);
        if (!path) { return; }

        return path.reduce((array, subPath, i) => {
            const obj = array.find(({ url }) => url === subPath);
            return i === path.length - 1 ? obj : obj.children;
        }, this.map);
    }

    /**
     * Returns page object without children objects
     *
     * @param q {string} Destination URL
     * @param active {boolean} Active property of returned link object
     * @returns {object}
     */
    getLink(q, active=false) {
        const obj = this.getObj(q);
        if (!obj) { return; }

        const { label, url } = obj;
        return {label, url, active};
    }

    /**
     * Returns list of immediate child links
     *
     * @param q {string} Destination URL
     * @param activeUrl {string} Optional url to mark as active
     * @returns {array[object]}
     */
    getSubnav(q, activeUrl) {
        const obj = this.getObj(q);
        if (!obj || !obj.children) { return; }

        return obj.children.map(({ url }) => this.getLink(url, url === activeUrl));
    }

    /**
     * Returns path list of links to provided url
     *
     * @param q {string} Destination URL
     * @param lastItemIsActive {boolean} If last item in returned array is active
     * @returns {array[object]}
     */
    getBreadcrumbNav(q, lastItemIsActive=true) {
        const path = this.getPath(q);
        if (!path) { return; }

        return path.map((url, i) => {
            const isActive = lastItemIsActive && i === path.length - 1;
            return this.getLink(url, isActive);
        });
    }
}
