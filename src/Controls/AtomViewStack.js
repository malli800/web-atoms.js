﻿/// <reference path="AtomControl.js" />

(function (baseType) {

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

                if (this._isAnimating) {
                    var self = this;
                    setTimeout(function () {
                        self.set_selectedIndex(v);
                    }, 50);
                    return;
                }
                if (v == this._selectedIndex)
                    return;
                this._previousIndex = this._selectedIndex;
                this._selectedIndex = v;
                this.updateUI();
            },
            get_selectedChild: function () {
                return this._selectedChild;
            },
            onUpdateUI: function () {

                var element = this._element;
                var childEn = new ChildEnumerator(element);

                var selectedIndex = this.get_selectedIndex();
                var previousIndex = this._previousIndex;

                var queue = WebAtoms.dispatcher;
                queue.pause();

                var i = -1;

                var self = this;

                var selectedElement, previousElement;

                while (childEn.next()) {
                    i = i + 1;
                    var item = childEn.current();
                    var $item = $(item);
                    $item.addClass("view-stack-child");
                    if (previousIndex == -1) {
                        $item.addClass("hidden");
                    }
                    if (i == selectedIndex) {
                        selectedElement = item;
                    } else if (i == previousIndex) {
                        previousElement = item;
                    } else {
                        $item.addClass("hidden");
                    }
                }

                if (selectedElement) {
                    var width = $(element).innerWidth();
                    var height = $(element).innerHeight();

                    this._selectedChild = selectedElement;
                    var $selectedElement = $(selectedElement);
                    AtomUI.setItemRect($selectedElement,selectedElement, { width: width, height: height });
                    var sac = selectedElement.atomControl;
                    if (sac) {
                        sac.updateUI();
                    }

                    if (previousElement && previousElement != selectedElement) {
                        var self = this;

                        var $previousElement = $(previousElement);

                        var sd = this._swipeDirection;
                        if (sd != null && /none/i.test(sd)) {
                            $previousElement.addClass("hidden");
                            $selectedElement.removeClass("hidden");
                        } else {
                            // animate...
                            var ael = [selectedElement, previousElement];
                            $(ael).removeClass("hidden");
                            this._isAnimating = true;
                            if (selectedIndex < previousIndex) {
                                $selectedElement.css("left", -width);
                                //log("left: -" + width);
                            } else {
                                $selectedElement.css("left", width);
                                //log("left: " + width);
                            }
                            $(ael).addClass("animate-left-property");
                            setTimeout(function () {
                                $selectedElement.css("left", 0);
                                //log("left: 0");
                                if (selectedIndex < previousIndex) {
                                    $previousElement.css("left", width);
                                } else {
                                    $previousElement.css("left", -width);
                                }
                                setTimeout(function () {
                                    self._isAnimating = false;
                                    $(ael).removeClass("animate-left-property");
                                    $previousElement.addClass("hidden");
                                }, 800);
                            }, 50);
                        }
                    } else {
                        $selectedElement.removeClass("hidden");
                    }
                }

                queue.start();

            },
            init: function () {
                var element = this.get_element();
                var $element = $(element);
                $element.addClass("atom-view-stack");
                baseType.init.call(this);

                if (!element.parentNode.atomControl) {
                    $element.addClass("atom-view-stack-fill");
                }
                $element.addClass(this._swipeDirection);

                //this.updateUI();
            }
        }
    });
})(WebAtoms.AtomControl.prototype);

