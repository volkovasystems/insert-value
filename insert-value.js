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
		Inserts keyValue using the specified condition with the following format:

			{"key":"value"}

	@end-module-documentation

	@include:
		{
			"mongoose@npm": "mongoose",
			"resolve-query-condition@github.com/volkovasystems": "resolveQueryCondition"
		}
	@end-include
*/

var insertValue = function insertValue( keyValue, collectionName, databaseName, databaseHost, databasePort, callback ){
	/*:
		@meta-configuration:
			{
				"keyValue:required": "string|Object",
				"collectionName:required": "string",
				"databaseName:required": "string",
				"databaseHost:required": "string",
				"databasePort:required": "number",
				"callback:optional": "function"
			}
		@end-meta-configuration
	*/

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
			var schema = new Schema( { }, { strict: false } );
			var model = connection.model( collectionName, schema );

			var data = new model( JSON.parse( keyValue ) );

			data.save( function onSave( error ){
				mongoose.disconnect( );

				if( error ){
					console.error( error );
					callback ( error );

				}else{
					console.log( true );
					callback( null, true );
				}
			} );
		} );
	connection.on( "error",
		function onError( error ){
			console.error( error );
			callback( error );
		} );
};

var mongoose = require( "mongoose" );
var Schema = mongoose.Schema;
var resolveQueryCondition = require( "../resolve-query-condition/resolve-query-condition.js" );

exports.insertValue = insertValue;

insertValue( "{\"abc10\":\"123210\"}", "newCollection", "newDatabase", "127.0.0.1", "27017");