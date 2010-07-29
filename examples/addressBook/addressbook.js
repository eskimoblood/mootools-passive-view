/**
 * Created by IntelliJ IDEA.
 * User: andreaskoberle
 * Date: 17.07.2010
 * Time: 20:53:11
 * To change this template use File | Settings | File Templates.
 */
var AddressListActivityView = new Class({
	Extends: View.Mustache,
	options: {
		template: '<ul>{{#address}}<li uid="{{uid}}">{{firstname}} {{name}}</li>{{/address}}</ul>'
	}
})

var AddressListActivity = new Class({
	Extends: Activity,
	eventListener: {
			element: {
				'click:relay(li)': 'showAddress'
			},
		eventBus: {
			addressChanged: 'addAddress'
		}
	},
	view: AddressListActivityView,
	build: function() {
		this.model = new Model(this.eventBus);
		this.options.addressJson.addresses.each(function(address) {
			this.addAddress(address);
		}, this);
		this.allowRendering = true;
		this.render();
	},
	addAddress: function(address) {
		address.uid = address.uid || Math.uuidFast();
		this.model.set(address.uid, address);
		var uids = this.model.get('uids') || [];
		if(!uids.contains(address.uid)) {
			uids.push(address.uid);
			this.model.set('uids', uids);
		}
		if (this.allowRendering) this.render();
		this.eventBus.fireEvent('addressBookLengthChanged', uids.length);
	},
	removeAddress: function(uuid) {
		this.model.clear(uuid);
		this.render();
		this.eventBus.fireEvent('addressBookLengthChanged', this.model.get('uids').length);
	},
	showAddress: function(event, li) {
		this.eventBus.fireEvent('showAddress', this.model.get(li.get('uid')));
	},
	render: function() {
		if (this.allowRendering) {
			var address = [];
			this.model.get('uids').each(function(uid, cnt) {
				address.push(this.model.get(uid));
			}, this);
			this.view.set('html', {address: address})
		}
	}
});



var AddressListLengthActivity = new Class({
	Extends: Activity,
	eventListener: {
			eventBus: {
				addressBookLengthChanged: 'render'
			}
	},
	render: function(length) {
		this.view.set('text', length);
	}
});

var AddressListEditor = new Class({
	Extends: Activity,
	eventListener: {
		view: {'submit': 'submitChanges'},
		eventBus: {showAddress: 'showAddress'}
	},
	submitChanges: function(event) {
		event.stop();
		var json = {uid: this.uid};
		this.view.getElements('input[type=text]').each(function(input) {
			json[input.id] = input.value
		}, this);
		this.eventBus.fireEvent('addressChanged', json);
		this.view.empty();
	},
	showAddress: function(address) {
		var innerHTML = '';
		['name', 'firstname', 'place'].each(function(key) {
			innerHTML += '<label for="' + key + '">' + key +'<input id="' + key + '" type="text" value="' + address[key] +'"/></label>'
		});
		this.view.set('html', innerHTML += '<input type="submit">');
		this.uid = address.uid;
	}
});


var AddressListAdd = new Class({
	Extends: Activity,
	eventListener: {
		element: {click: 'addAddress'}
	},
	addAddress: function() {
		console.log('test')
		this.eventBus.fireEvent('showAddress', { 'uid' : '', 'name' : '', 'firstname' : '', 'place' : '' })
	}

});



