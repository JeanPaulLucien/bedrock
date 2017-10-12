/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (Mozilla, Waypoint) {
    'use strict';

    var videoWaypoints = [];

    // Basic feature detect for JS support.
    function cutsTheMustard() {
        return 'querySelector' in document &&
               'querySelectorAll' in document &&
               'addEventListener' in window &&
               'classList' in document.createElement('div') &&
               typeof window.matchMedia !== 'undefined' &&
               typeof HTMLMediaElement !== 'undefined';
    }

    // Returns an elements position offset from the top of the page.
    function findPosition(obj) {
        var top = 0;
        do {
            top += obj.offsetTop;
            obj = obj.offsetParent;
        } while (obj);

        return top;
    }

    function scrollToElem(e) {
        e.preventDefault();
        var targetName = e.target.getAttribute('href').replace(/#/, '');
        var targetElem = document.getElementById(targetName);

        if (targetElem) {
            Mozilla.smoothScroll({
                top: findPosition(targetElem)
            });
        }
    }

    function setActiveFeature(id) {
        var currentElem = document.querySelector('.feature-videos-nav a.current');
        var el = document.querySelector('.feature-videos-nav a[href="#' + id + '"]');

        if (currentElem) {
            currentElem.classList.remove('current');
        }

        if (el) {
            el.classList.add('current');
        }
    }

    function goToPrevVideo() {
        var currentElem = document.querySelector('.feature-videos-nav a.current');

        if (currentElem) {
            var prevElem = currentElem.parentNode.previousElementSibling;

            if (prevElem) {
                prevElem.firstChild.click();
            }
        }
    }

    function goToNextVideo() {
        var currentElem = document.querySelector('.feature-videos-nav a.current');

        if (currentElem) {
            var nextElem = currentElem.parentNode.nextElementSibling;

            if (nextElem) {
                nextElem.firstChild.click();
            }
        }
    }

    function initFeatureVideoNavigation() {
        var stickyNavLinks = document.querySelectorAll('.feature-videos-nav a');
        var prevButton = document.querySelector('.feature-videos-nav .previous');
        var nextButton = document.querySelector('.feature-videos-nav .next');

        for (var i = 0; i < stickyNavLinks.length; i++) {
            stickyNavLinks[i].addEventListener('click', scrollToElem, false);
        }

        prevButton.addEventListener('click', goToPrevVideo, false);
        nextButton.addEventListener('click', goToNextVideo, false);
    }

    function initVideoWaypoints() {
        var sections = document.querySelectorAll('.feature-videos-content > .feature-video');

        for (var i = 0; i < sections.length; i++) {
            videoWaypoints.push(new Waypoint({
                element: sections[i],
                handler: function(direction) {
                    if (direction === 'down') {
                        setActiveFeature(this.element.id);
                    }
                },
                offset: '50%'
            }));

            videoWaypoints.push(new Waypoint({
                element: sections[i],
                handler: function(direction) {
                    if (direction === 'up') {
                        setActiveFeature(this.element.id);
                    }
                },
                offset: '-50%'
            }));
        }
    }

    function destroyVideoWaypoints() {
        videoWaypoints.forEach(function(waypoint) {
            waypoint.destroy();
        });
        videoWaypoints = [];
    }

    function initMediaQueries() {
        var desktopWidth;

        desktopWidth = matchMedia('(min-width: 1000px)');

        if (desktopWidth.matches) {
            initVideoWaypoints();
        }

        desktopWidth.addListener(function(mq) {
            if (mq.matches) {
                initVideoWaypoints();
            } else {
                destroyVideoWaypoints();
            }
        });
    }

    if (cutsTheMustard()) {
        document.querySelector('main').className = 'supports-videos';
        initMediaQueries();
        initFeatureVideoNavigation();
    }

})(window.Mozilla, window.Waypoint);
