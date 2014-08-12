/*:
	@module-license:
		The MIT License (MIT)

		Copyright (c) 2014 Jann Paolo Caña
		Copyright (c) 2014 Richeve Siodina Bebedor
		Copyright (c) 2014 Regynald Reiner Ventura

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"packageName": "burrow-app/task for 08-06-2014",
			"fileName": "insert-value.js",
			"moduleName": "insertValue",
			"authorName": "Jann Paolo Caña",
			"authorEMail": "paolo.garcia00@yahoo.com",
			"contributorList": [
				{
					"contributorName": "Richeve Siodina Bebedor",
					"contributorEMail": "richeve.bebedor@gmail.com"
				},
				{
					"contributorName": "Regynald Reiner Ventura",
					"contributorEMail": "regynaldventura@gmail.com"					
				}
			],
			"repository": "git@github.com:volkovasystems/burrow-app.git",
			"testCase": "insert-value-test.js",
			"isGlobal": true
		}
	@end-module-configuration

	@module-documentation:
		Insert the value using the specified condition with the following format:

			schema@key=value

			??model@key=value
	
		If no schema is specified then we will assume that the collectionName == schema.
	@end-module-documentation

	@include:
		{
			"mongoose@npm": "mongoose",
			"resolve-query-condition@github.com/volkovasystems": "resolveQueryCondition"
		}
	@end-include
*/

var insertValue = function insertValue( condition, collectionName, databaseName, databaseHost, databasePort, callback ){
	/*:
		@meta-configuration:
			{
				"condition:required": "string|object",
				"collectionName:required": "string",
				"databaseName:required": "string",
				"databaseHost:required": "string",
				"databasePort:required": "number",
				"callback:optional": "function"
			}
		@end-meta-configuration
	*/

	var queryCondition = resolveQueryCondition( condition );
	var dataModel = queryCondition.reference;
	var queryObject = queryCondition.queryObject;
	
	var modelNames = mongoose.modelNames( );

	//NOOP override.
	callback = callback || function( ){ };

	var mongoDatabaseURL = [ 
		"mongodb://",
		databaseHost, ":",
		databasePort, "/",
		databaseName 
	].join( "" );

	var connection = mongoose.createConnection( mongoDatabaseURL );

	connection.on( "connected",
		function onConnected( ){
			//Check if we have the model in the list of models.
			if( modelNames.indexOf( dataModel ) != -1 ){
				var theModel = connection.model( dataModel );
				
				var data = new theModel( queryObject );

				data.save(
					function onSave( error ){
						mongoose.disconnect( );

						if( error ){
							console.error( error );
							callback ( error );

						}else{
							console.log( true );
							callback( null, true );
						}
					} );
			}else{
				var error = new Error( "invalid model" );
				console.error( error );
				callback( error );
			}
		} );

	connection.on( "error",
		function onError( error ){
			console.error( error );

			callback( error );
		} );
};

var mongoose = require( "mongoose" );
var models_schemas = require( "./models.js" );
var resolveQueryCondition = require( "../resolve-query-condition/resolve-query-condition.js" );

exports.insertValue = insertValue;

insertValue( "myModel2@firstname=rein3", "newCollection", "newDatabase", "127.0.0.1", "27017");