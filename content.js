
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
utils = {
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
            value = (o['value'] || '').replace(/\./g, '');

        return classList.contains(value) || false;
    }
},
qptExtensions = {
    el: {
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