/**
 * Created by IntelliJ IDEA.
 * User: andreaskoberle
 * Date: 21.07.2010
 * Time: 20:33:44
 * To change this template use File | Settings | File Templates.
 */
Model.Couch = new Class({
	Extends: Model,
	initialize: function() {

	},
	loadData: function() {

	},
	set: function() {
		this.parent(key, value, local);
		var request = this.getRequest();
		request.options.url = this.options.url + '/'

	},
	clear: function(key, local) {
		this.parent(key, local);

	},
	getRequest: function() {
		this.jsonp = this.jsonp || new Request.JSONP();
		return this.jsonp;
	}
});


