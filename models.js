var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

	var mySchema = {
		firstname:String
	};

	var mySchema2 = new Schema(
	{
		lastname:String
	} );


	var mySchema3 = new Schema(
	{
		middlename:String
	} );

	
	var myModel = mongoose.model("myModel", mySchema );
	exports.myModel = myModel;
	
	var myModel2 = mongoose.model( "myModel2", mySchema2 );
	exports.myModel2 = myModel2;
