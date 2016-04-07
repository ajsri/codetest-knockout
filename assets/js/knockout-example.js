/*
knockout.js example - we're going to pull in a JSON object, display it in a responsive table, and
let the user filter them through checkboxes. When the viewport scales, the table should collapse
appropriately
*/


$(document).ready(function(){
	var sampleViewModel = {
		//create viewmodel, default state data initialization
		activeItem: ko.observable({}),
		title: 'Requests Table',
		showAll: ko.observable(true),
		Approved: ko.observable(true),
		Pending: ko.observable(true),
		Denied: ko.observable(true),
		status: {
			approved: ko.observable(0),
			denied: ko.observable(0),
			pending: ko.observable(0)
		},
		//helper functions
		//first argument returned is viewModel - IDK why
		modifyFilter: function(viewModel, event) {
			var type = event.currentTarget.id;
			sampleViewModel[type](!sampleViewModel[type]());
			if(!sampleViewModel.Approved() && !sampleViewModel.Pending() && !sampleViewModel.Denied()){
				sampleViewModel.Approved(true);
				sampleViewModel.Pending(true);
				sampleViewModel.Denied(true);
			}
			//if you add click handler to checkbox, remember to return true
			return true;
		},
		changeStatus: function(item, event){
			for(key in sampleViewModel.status){
				if(sampleViewModel.status.hasOwnProperty(key)){
					sampleViewModel.status[key](0);
				}
			}
			item.status(event.currentTarget.innerHTML);
			sampleViewModel.updateNumbers();
			return true;
		},
		updateNumbers: function(){
			sampleViewModel.requests().forEach(function(record){
				type = record.status().toLowerCase();
				sampleViewModel.status[type](sampleViewModel.status[type]() + 1);
			})
		},
		setActive: function(item, event){
			sampleViewModel.activeItem(item);
			$('#deleteModal').modal('show');
		},
		deleteConfirm: function(item, event){
			sampleViewModel.requests.remove(item);
			$('#deleteModal').modal('hide');
		},
		sort: function(viewModel, event) {
			var sortArgument = event.currentTarget.id;
			if(sortArgument === 'title'){

			}
			else{
				sampleViewModel.requests.sort(function(left, right){
					return left[sortArgument] == right[sortArgument] ? 0 : (left[sortArgument] < right[sortArgument] ? -1 : 0);					
				});
			}
		}
	}
	//custom binding for moment.js
	ko.bindingHandlers.moment = {
		init: function(element, valueAccessor, allBindings, viewModel, bindingContext){
			var time = valueAccessor()();
			element.innerHTML = moment(time).format('YYYY-MM-DD');
		},
		callback: function(element, valueAccessor, allBindings, viewModel, bindingContext){
		}
	}
	//use jQuery's getJSON helper to get data
	//http://api.jquery.com/jquery.getjson/
	$.getJSON('./assets/js/data.json', function(response){
		//I'm not going to manually create all observables - this is is a great mapping library instead
		sampleViewModel.requests = ko.mapping.fromJS(response.results);
		sampleViewModel.updateNumbers();
		ko.applyBindings(sampleViewModel);
	});
});
