﻿/// <reference path="AtomControl.js" />

(function (window, baseType) {

    return classCreatorEx({
        name: "WebAtoms.AtomViewStack",
        base: baseType,
        start: function (e) {
            this._swipeDirection = 'left-right';
        },
        properties: {
            selectedIndex: -1,
            previousIndex: -1,
            swipeDirection: 'left-right'
        },
        methods: {
            bringSelectionIntoView: function () {
            },
            set_swipeDirection: function (v) {
                var ov = this._swipeDirection;
                if (ov) {
                    $(this._element).removeClass(ov);
                }
                this._swipeDirection = v;
                if (v) {
                    $(this._element).addClass(v);
                }
            },
            set_selectedIndex: function (v) {
                this._previousIndex = this._selectedIndex;
                this._selectedIndex = v;
                this.updateUI();
            },
            onUpdateUI: function () {

                var element = this._element;
                var childEn = new ChildEnumerator(element);

                var selectedIndex = this.get_selectedIndex();
                var previousIndex = this._previousIndex;

                var queue = new WebAtoms.AtomDispatcher();
                queue.pause();

                var i = -1;

                var self = this;

                var selectedElement, previousElement;

                while (childEn.next()) {
                    i = i + 1;
                    var item = childEn.current();

                    $(item).addClass("view-stack-child");
                    if (previousIndex == -1) {
                        $(item).addClass("hidden");
                    }
                    if (i == selectedIndex) {
                        selectedElement = item;
                    } else if (i == previousIndex) {
                        previousElement = item;
                    } else {
                        $(item).addClass("hidden");
                    }
                }

                if (selectedElement) {
                    var width = $(element).innerWidth();
                    var height = $(element).innerHeight();
                    AtomUI.setItemRect(selectedElement, { width: width, height: height });

                    if (previousElement) {
                        var ael = [selectedElement,previousElement];
                        if (selectedIndex < previousIndex) {
                            $(selectedElement).css("left", -width);
                        } else {
                            $(selectedElement).css("left", width);
                        }
                        $(ael).removeClass("hidden");
                        $(ael).addClass("animate-left-property");
                        setTimeout(function () {
                            $(selectedElement).css("left", 0);
                            if (selectedIndex < previousIndex) {
                                $(previousElement).css("left", width);
                            } else {
                                $(previousElement).css("left", -width);
                            }
                            setTimeout(function () {
                                $(ael).removeClass("animate-left-property");
                                $(previousElement).addClass("hidden");
                            }, 600);
                        }, 10);
                    } else {
                        $(selectedElement).removeClass("hidden");
                    }
                }

                queue.start();

            },
            init: function () {
                var element = this.get_element();
                $(element).addClass("atom-view-stack");
                baseType.init.call(this);

                var element = this.get_element();

                if (!element.parentNode.atomControl) {
                    $(element).addClass("atom-view-stack-fill");
                }
                $(element).addClass(this._swipeDirection);

                //this.updateUI();
            }
        }
    });
})(window, WebAtoms.AtomControl.prototype);

