var expect = require('chai').expect;

module.exports = function(helpers) {
    var widget = helpers.mount(require('./index'), {});

    var oldButton1Widget = widget.getWidget('button1');
    var oldButton2Widget = widget.getEl('button2').__widget;
    var oldButton1El = oldButton1Widget.el;
    var oldButton2El = widget.getEl('button2');

    expect(widget.getWidget('button1').getBodyEl().innerHTML).to.equal('normal');

    var self = widget;

    require('marko/widgets').batchUpdate(function() {
        self.setButtonSize('small');
        self.rerender();
    });

    var newButton1El = widget.getWidget('button1').el;
    var newButton2El = widget.getEl('button2');

    // // Both button widgets should be reused
    expect(widget.getWidget('button1')).to.equal(oldButton1Widget);
    expect(widget.getEl('button2').__widget).to.equal(oldButton2Widget);

    expect(widget.getWidget('button1').getBodyEl().innerHTML).to.equal('small');


    // // State changed for button1 so it should have a new el
    // // since it re-renders to update its view
    // console.log('newButton1El: ', newButton1El);
    expect(newButton1El === oldButton1El).to.equal(true);

    //
    // // State didn't change for button2 so it should be the same el
    expect(newButton2El).to.equal(oldButton2El);
};