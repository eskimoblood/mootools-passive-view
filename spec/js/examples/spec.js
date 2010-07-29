describe 'AddressListActivity'
  before

	eventBus = new EventBus()
	container = new Element('div')
	addressListActivity = new AddressListActivity(eventBus, {element: container, addressJson: JSON.decode(fixture('address.json')) });

  end

	describe 'after initialization'
		it 'should have an model with one address and the address should be rendered'
			container.innerHTML.should.be '<ul><li uid="0">Elizabeth Price</li></ul>'
		end
	end

	describe 'addAddress()'
		it 'should add a new address to the model, render the html of the list and fire an event with the new length of the list'
			length =0;
			eventBus.addEvent('addressBookLengthChanged', function(l){length = l});
			addressListActivity.addAddress({"firstname": "Amelia","name": "Fletcher","place": "Oxford", uid:1});
			container.innerHTML.should.be '<ul><li uid="0">Elizabeth Price</li><li uid="1">Amelia Fletcher</li></ul>'
			length.should.be 2
		end
	end

	describe 'removeAddress()'
		it 'should remove a address from the model, render the html of the list and fire an event with the new length of the list'
			length = 0;
			eventBus.addEvent('addressBookLengthChanged', function(l){length = l});
			addressListActivity.removeAddress(addressListActivity.model.get('uids')[1]);
			container.innerHTML.should.be '<ul><li uid="0">Elizabeth Price</li></ul>'
			length.should.be 1
		end
	end

	describe 'by click on item in the list the showAddress event should fire with the address json as argument'
		it 'should remove a address from the model, render the html of the list and fire an event with the new length of the list'
			address = 0;
			eventBus.addEvent('showAddress', function(l){address = l});
			container.fireEvent('click', {target: container.getElement('li')})
			address.firstname.should.be "Elizabeth"
		end
	end
end

describe 'AddressListEditor'
  before

	eventBus = new EventBus()
	container = new Element('form')
	addressListEditor = new AddressListEditor(eventBus, {element: container });
  end

	describe 'after showAddress on eventBus the adress should be shown in the form'
		it 'should have an model with one address and the address should be rendered'
			eventBus.fireEvent('showAddress', {"firstname": "Amelia","name": "Fletcher","place": "Oxford"})
			container.innerHTML.should.be '<label for="name">name<input id="name" value="Fletcher" type="text"></label><label for="firstname">firstname<input id="firstname" value="Amelia" type="text"></label><label for="place">place<input id="place" value="Oxford" type="text"></label><input type="submit">'
		end
	end

	describe 'it should fire an event with the update json as argument when the submit button was clicked'
		it 'should have an model with one address and the address should be rendered'
			json = {};
			eventBus.addEvent('addressChanged', function(value){ json= value})
			eventBus.fireEvent('showAddress', {"uid": 1,"firstname": "Amelia","name": "Fletcher","place": "Oxford"})
			inputs = addressListEditor.toElement().getElements('input');
			newValues =
			['a', 'b', 'c'].each(function(newValue, i){
				inputs[i].value = newValue
			})
			container.fireEvent('submit', {stop: $empty});
			json.should.eql { 'uid' : 1, 'name' : 'a', 'firstname' : 'b', 'place' : 'c' }
		end
	end


end


