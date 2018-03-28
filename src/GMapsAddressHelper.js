/**
 * @file Helper for extracting address info from a GMaps Place object.
 * @author Phillippe Santana, http://www.ideianoar.com.br
 * @license
 * Copyright (c) 2018 Ideia no Ar Tecnologia da Informacao Ltda.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * This script was based on samples by Google, at:
 * https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
 * https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
 */

/**
 * Creates and initializes an instance of GMapsAddressHelper.
 * @param {object} A google.maps.places.Place object, containing address data.
 * @return {object} An instance of GMapsAddressHelper.
 */
function GMapsAddressHelper(place) {
	this._place = place;
}

/**
 * Extracts address parts from the current Place object.
 * @return {object} An object containing the following properties with address information:
 *     - address: a short string representation of the address;
 *     - route: street, avenue or alike;
 *     - streetNumber: number in the route;
 *     - neighborhood: neighborhood or sublocality;
 *     - city: city or administrative area level 2;
 *     - state: state or administrative area level 1;
 *     - country: country name;
 *     - zipCode: zip/postal code.
 */
GMapsAddressHelper.prototype.extractParts = function () {
	if (!this._place || !this._place.geometry)
		throw 'No details available.';
	
	var parts = {
		address: this._getAddressName(),
		route: this._extractPart(['route']),
		streetNumber: this._extractPart(['street_number']),
		neighborhood: this._extractPart(['sublocality', 'sublocality_level_1']),
		city: this._extractPart(['administrative_area_level_2', 'locality']),
		state: this._extractPart(['administrative_area_level_1']),
		country: this._extractPart(['country']),
		zipCode: this._extractPart(['postal_code_prefix', 'postal_code'])
	};

	if (parts.neighborhood === parts.city)
		parts.neighborhood = null;

	return parts;
};

/**
 * Sets a new Place object to work with.
 * @param {object} place A google.maps.places.Place object, containing address data.
 */
GMapsAddressHelper.prototype.setPlace = function (place) {
	this._place = place;
};

/**
 * Extracts an address part from the address components.
 * @param {array} types Type names to match in a search through the address components.
 * @return {object} An object indicating wether a match has been found, along with its short and long names (if found).
 */
GMapsAddressHelper.prototype._extractPart = function (types) {
	var self = this;

	for (var ac in this._place.address_components) {
		for (var ct in this._place.address_components[ac].types) {
			for (var t in types) {
				if (types[t] === this._place.address_components[ac].types[ct]) {
					var comp = this._place.address_components[ac];
					return { found: true, longName: comp.long_name, shortName: comp.short_name };
				}
			}
		}
	}

	return { found: false, longName: null, shortName: null };
};

/**
 * Returns a short name represents the current address.
 * @return {object} An object containing a short and a long string representation of the address.
 */
GMapsAddressHelper.prototype._getAddressName = function () {
	var ac = this._place.address_components;

	function getAddr(propName) {
		return [
			(ac[0] && ac[0][propName] || ''),
			(ac[1] && ac[1][propName] || ''),
			(ac[2] && ac[2][propName] || '')
		].join(' ');
	}

	return {
		found: true,
		longName: getAddr('long_name'),
		shortName: getAddr('short_name')
	};
};