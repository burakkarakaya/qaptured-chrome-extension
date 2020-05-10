// https://www.smashingmagazine.com/2019/04/mutationobserver-api-guide/

//let mList = [].slice.call(document.querySelectorAll('.mainView')), //ana kapsayıcı
//let mList = [].slice.call(document.querySelectorAll('.slider-item .bob-container span')), // item
//let mList = [].slice.call(document.querySelectorAll('.mainView .lolomo')), // list item
let mList = [].slice.call(document.body), // document
    options = {
        childList: true,
        subtree: true,
        //characterData: true
    },
    observer = new MutationObserver(mCallback);

function mCallback(mutations) {
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            console.log('Mutation Detected: A child node has been added or removed.', mutation.target);
        } else if (mutation.type === 'characterData') {
            console.log(mutation.target)
        }
    }
}

mList.forEach(function (target) { observer.observe(target, options); });



const MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
    utils = {
        detectEl: function (elm) {
            return elm == null ? false : true;
        },
        forEach: function (array, callback, scope) {
            for (var i = 0; i < array.length; i++) {
                callback.call(scope, i, array[i]); // passes back stuff we need
            }
        },
        hasClass: function (o) {
            o = o || {};
            var elm = o['element'] || {},
                classList = elm.classList || '',
                value = (o['value'] || '').replace(/\./g, '');

            return classList.contains(value) || false;
        }
    },
    qptExtensions = {
        el: {
            bdy: document.body,
            target: '.mainView',
            targetTile: '.bob-title'
        },
        addEvent: function () {
            const _t = this,
                target = document.querySelector(_t.el.target),
                observer = new MutationObserver(function (mutations, observer) {
                    let title = null;

                    utils.forEach(mutations, function (ind, mutation) {
                        const _target = mutation.target;
                        switch (true) {
                            case utils.hasClass({ element: _target, value: _t.el.targetTile }):
                                title = _target;
                                break;
                            case utils.detectEl(_target.querySelector(_t.el.targetTile)):
                                title = _target.querySelector(_t.el.targetTile);
                                break;

                            default:
                                break;
                        }
                    });

                    if (title) {
                        console.log(title.textContent);
                    }

                });

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












