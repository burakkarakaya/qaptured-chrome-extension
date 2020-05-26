
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
    utils = {
        ajx: function (o, callback) {

            o = o || {};
            var uri = o['uri'] || '',
                type = o['type'] || 'json', // json ve html değerlerini alır. default değeri json
                method = o['method'] || 'POST',
                headers = o['headers'] || { 'Content-Type': 'application/json' },
                data = o['data'] || {},
                _callback = function (res) {
                    if (typeof callback !== 'undefined')
                        callback(res);
                };

            if (uri == '') {
                _callback({ type: 'error' });
                return false;
            }


            switch (type) {

                case 'json':
                    return fetch(uri, {
                        method: method,
                        headers: headers,
                        body: JSON.stringify(data)
                    })
                        .then(res => res.json())
                        .then(res => {
                            if (res.IsSuccess)
                                _callback({ type: 'success', data: res });
                            else
                                _callback({ type: 'error', message: res.Message });

                        })
                        .catch(error => {
                            _callback({ type: 'error', message: error });
                        });

                case 'html': {
                    var headers = {};
                    return fetch(uri)
                        .then(res => {
                            headers = res.headers || {};
                            return res.text();
                        })
                        .then(function (html) {
                            try {
                                var parser = new DOMParser();
                                var doc = parser.parseFromString(html, 'text/html');

                                _callback({ type: 'success', data: html, doc: doc, headers: headers || {} });

                            } catch (error) {
                                _callback({ type: 'error', message: error.message });
                            }

                        }).catch(function (error) {
                            _callback({ type: 'error', message: error });
                        });
                }

                default:
                    break;
            }
        },
        detectEl: function (elm) {
            return elm == null ? false : true;
        },
        forEach: function (array, callback, scope) {
            for (var i = 0; i < array.length; i++) {
                callback.call(scope, i, array[i]);
            }
        },
        hasClass: function (o) {
            o = o || {};
            var elm = o['element'] || {},
                classList = elm.classList || '',
                cls = (o['cls'] || '').replace(/\./g, '');

            return classList.contains(cls) || false;
        },
        getParents: function (elem, selector) {

            /* 
                https://github.com/happyBanshee/JS-helpers/wiki/.closest(),-.parents(),-.parentsUntil(),-.find()-in-JS
    
                
                var elem = document.querySelector('#some-element');
                utils.getParents(elem, '.some-class');
                utils.getParents(elem.parentNode, '[data-product-id]');
    
            */

            // Variables
            var firstChar = selector.charAt(0);
            var supports = 'classList' in document.documentElement;
            var attribute, value;

            // If selector is a data attribute, split attribute from value
            if (firstChar === '[') {
                selector = selector.substr(1, selector.length - 2);
                attribute = selector.split('=');

                if (attribute.length > 1) {
                    value = true;
                    attribute[1] = attribute[1].replace(/"/g, '').replace(/'/g, '');
                }
            }

            // Get closest match
            for (; elem && elem !== document && elem.nodeType === 1; elem = elem.parentNode) {

                // If selector is a class
                if (firstChar === '.') {
                    if (supports) {
                        if (elem.classList.contains(selector.substr(1))) {
                            return elem;
                        }
                    } else {
                        if (new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test(elem.className)) {
                            return elem;
                        }
                    }
                }

                // If selector is an ID
                if (firstChar === '#') {
                    if (elem.id === selector.substr(1)) {
                        return elem;
                    }
                }

                // If selector is a data attribute
                if (firstChar === '[') {
                    if (elem.hasAttribute(attribute[0])) {
                        if (value) {
                            if (elem.getAttribute(attribute[0]) === attribute[1]) {
                                return elem;
                            }
                        } else {
                            return elem;
                        }
                    }
                }

                // If selector is a tag
                if (elem.tagName.toLowerCase() === selector) {
                    return elem;
                }

            }

            return null;

        },
    },
    qptExtensions = {
        el: {
            target: '.mainView',
            targetTile: '.bob-title',
            parentsContainer: '.bob-container'
        },
        cls: {
            activeted: 'activeted'
        },
        set: function (element) {
            var _t = this;
            if (!utils.hasClass({ element: element, cls: _t.cls.activeted })) {
                element.classList.add(_t.cls.activeted);

                try {

                    var prts = utils.getParents(element, _t.el.parentsContainer),
                        sib = prts.previousElementSibling,
                        target = sib.querySelector('a');

                    // netflix idsi alınıp gonderilecek    
                    console.log(target, element, element.textContent);


                } catch (error) {
                    console.warn(error)
                }
            }
        },
        addEvent: function () {
            const _t = this,
                target = document.querySelector(_t.el.target),
                observer = new MutationObserver(function (mutations, observer) {
                    let title = null;

                    utils.forEach(mutations, function (ind, mutation) {
                        const _target = mutation.target;

                        switch (true) {
                            case utils.hasClass({ element: _target, cls: _t.el.targetTile }):
                                title = _target;
                                break;
                            case utils.detectEl(_target.querySelector(_t.el.targetTile)):
                                title = _target.querySelector(_t.el.targetTile);
                                break;

                            default:
                                break;
                        }
                    });

                    if (title)
                        _t.set(title);
                });

            if (observer)
                observer.observe(target, {
                    childList: true,
                    subtree: true,
                });

        },
        init: function () {
            var _t = this;
            _t.addEvent();
        }
    };

qptExtensions.init();